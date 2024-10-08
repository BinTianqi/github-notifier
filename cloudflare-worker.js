import { parseData } from "./parser.js";
import { sendMessage } from "./main.js";
import { Webhooks } from '@octokit/webhooks';

export default {
    async fetch(req, env, ctx) {
        let status = 500;
        let response = "";
        const payload = await req.text();
        const sign = req.headers.get('X-Hub-Signature-256')
        const gh_event = req.headers.get('X-GitHub-Event')
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
                    response += "Response from Telegram server:\n" + JSON.stringify(result);
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

