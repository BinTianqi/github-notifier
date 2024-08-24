export async function sendMessage(message, chatId, botToken) {
    let data = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        link_preview_options: {
            is_disabled: true
        }
    }
    const fetched = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const res = await fetched.json()
    return res
}
