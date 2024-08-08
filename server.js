import express from 'express';
import fs from 'fs';
import https from 'https';
import { Webhooks } from '@octokit/webhooks';
import { parseData } from './parser.js';
import config from './config.js';

const keypair = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};
const webhooks = new Webhooks({
    secret: config.github.webhook_secret
})

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
    const data = req.body;
    const sign = req.headers['x-hub-signature-256'];
    const gh_event = req.headers['x-github-event'];
    if(typeof(sign) == 'undefined') {
        res.status(401).send('Unauthorized');
        return;
    }
    if(!(await webhooks.verify(data, sign))) {
        console.log('Signature incorrect');
        res.status(401).send('Unauthorized');
        return;
    }
    let message = '';
    try {
        message = parseData(gh_event, data);
        sendMessage(message)
        res.status(200).send('OK');
    } catch (error) {
        console.log(error);
        sendMessage('<i>An error occurred</i>')
    }
}

function sendMessage(message) {
    let data = {
        chat_id: config.telegram.chat_id,
        text: message,
        parse_mode: "HTML",
        link_preview_options: {
            is_disabled: true
        }
    };
    fetch(`https://api.telegram.org/bot${config.telegram.bot_token}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.statusCode;
    })
}

https.createServer(keypair, app).listen(8009, () => {
    console.log('Server is listening 8009');
});
