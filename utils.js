export function escapeChar(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function parseTimeMs(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    hours = hours % 24
    minutes = minutes % 60
    seconds = seconds % 60
    let readableTime = ""
    if (days > 0) readableTime += days + "d"
    if (hours > 0) readableTime += hours + "h"
    if (minutes > 0) readableTime += minutes + "m"
    if (seconds > 0) readableTime += seconds + "s"
    return readableTime.trim()
}
