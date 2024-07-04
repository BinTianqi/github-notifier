export function parseData(dataStr) {
    var data = '';
    try {
        data = JSON.parse(dataStr);
    } catch (error) {
        return 'Failed to parse data';
    }
    if(data.issue) {
        const issue = data.issue;
        const action = data.action;
        const title = escapeChar(issue.title);
        if(data.comment) {
            const comment = data.comment;
            if(action == 'created') {
                return `<b>New issue comment</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nid: <a href="${comment.html_url}">${comment.id}</a>\nAuthor: <a href="${comment.user.html_url}">${data.sender.login}</a>`;
            } else if (action == 'edited') {
                return `<b>Issue comment edited</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nid: <a href="${comment.html_url}">${comment.id}</a>\nEdited by: <a href="${comment.user.html_url}">${data.sender.login}</a>`;
            } else {
                return `<b>Issue comment deleted</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nid: <a href="${comment.html_url}">${comment.id}</a>\nDeleted by: <a href="${comment.user.html_url}">${data.sender.login}</a>`;
            }
        } else {
            if(action == 'opened') {
                return `<b>New issue</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nAuthor: <a href="${issue.user.html_url}">${data.sender.login}</a>`;
            } else if(action == 'edited') {
                return `<b>Issue edited</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nEdited by <a href="${issue.user.html_url}">${data.sender.login}</a>`;
            } else if(action == 'closed') {
                return `<b>Issue closed</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nClosed by <a href="${issue.user.html_url}">${data.sender.login}</a>`;
            }
        }
    } else if (data.starred_at) {
        if(data.action = 'created') {
            return `<b>New star</b>\nBy <a href="${data.sender.html_url}">${data.sender.login}</a>`;
        } else {
            return `<b>Star deleted</b>\nBy <a href="${data.sender.html_url}">${data.sender.login}</a>`;
        }
    } else if (data.forkee) {
        const forkee = data.forkee;
        return `<b>New fork</b>\n<a href="${forkee.html_url}">${forkee.owner.login}/${forkee.name}</a>`;
    } else {}
    return '<i>Unparsed action</i>';
}

function escapeChar(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

