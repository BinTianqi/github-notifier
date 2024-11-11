import express from 'express';
import fs from 'fs';
import https from 'https';
import { parseData } from './parser.js';
import { sendMessage } from "./main.js";
import verifySignature from "./verify.js"
import config from './config.js';

const keypair = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};

const app = express();

app.use((req, res, next) => {
    let str = '';
    req.on('data', (chunk) => {
        str += chunk
    });
    req.on('end', () => {
        req.body = str
        next()
    });
});

app.post('/', handlePost);

async function handlePost(req, res) {
    const payload = req.body;
    fs.writeFileSync("payload.json", payload)
    const signature = req.headers['x-hub-signature-256'];
    const gh_event = req.headers['x-github-event'];
    if(typeof(signature) == 'undefined') {
        res.status(401).send('Unauthorized');
        return;
    }
    const verified = await verifySignature(config.github.webhook_secret, signature, payload)
    if(!verified) {
        console.log('Signature incorrect');
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const message = parseData(gh_event, payload);
        sendMessage(message, config.telegram.chat_id, config.telegram.bot_token)
        res.status(200).send('OK');
    } catch (error) {
        console.log(error);
    }
}

https.createServer(keypair, app).listen(8009, () => {
    console.log('Server is listening 8009');
});
