import { parseData } from "./parser.js";
import { Webhooks } from '@octokit/webhooks';

export default {
    async fetch(req, env, ctx) {
        let status = 500;
        let response = "";
        const payload = await req.text();
        let sign = req.headers.get('x-hub-signature-256');
        let gh_event = req.headers.get('x-github-event');
        if(sign == null) { sign = req.headers.get('X-Hub-Signature-256'); }
        if(gh_event == null) { gh_event = req.headers.get('X-GitHub-Event'); }
        if(sign == null) {
            status = 401;
            response += "Signature not found in headers";
        } else {
            try {
                const webhook = new Webhooks({ secret: env.WEBHOOK_SECRET })
                if((await webhook.verify(payload, sign))) {
                    const message = parseData(gh_event, payload);
                    console.log(message)
                    const result = await sendMessage(message, env.CHAT_ID, env.BOT_TOKEN);
                    status = 200;
                    response += "Response from Telegram server:\n" + result;
                } else {
                    status = 401;
                    response += "Invalid signature";
                }
            } catch (err) {
                console.log(err);
                response += `Error occurred\n${err}`;
            }
        }
        return new Response(response, { status: status });
    },
};

async function sendMessage(message, chatId, botToken) {
    let data = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        link_preview_options: {
            is_disabled: true
        }
    };
    const fetched = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const res = await fetched.json();
    return JSON.stringify(res);
}
