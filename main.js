import express from 'express';
import fs from 'fs';
import https from 'https';
import { Webhooks } from '@octokit/webhooks';
import { parseData } from './parser.js';
import TGbot from 'node-telegram-bot-api';
import config from './config.json' with { type: 'json' };

const keypair = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};
const bot = new TGbot(config.telegram.bot_token, { polling: false });
const webhooks = new Webhooks({
    secret: config.github.webhook_secret
})

const app = express();

const messageOptions = {
    parse_mode: 'HTML',
    disable_web_page_preview: true
}

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
        await bot.sendMessage(config.telegram.chat_id, message, messageOptions);
        res.status(200).send('OK');
    } catch (error) {
        console.log(error);
        await bot.sendMessage(config.telegram.chat_id, '<i>An error occurred</i>', messageOptions);
    }
}

https.createServer(keypair, app).listen(8009, () => {
    console.log('Server is listening 8009');
});

