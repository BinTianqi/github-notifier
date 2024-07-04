export function parseData(gh_event, dataStr) {
    var data = '';
    try {
        data = JSON.parse(dataStr);
    } catch (error) {
        return 'Failed to parse data';
    }
    const sender = data.sender;
    const action = data.action;
    if(gh_event == 'issues') {
        const issue = data.issue;
        const title = escapeChar(issue.title);
        if(action == 'labeled') {
            return `<b>New issue label</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nLabel: ${data.label.name}\nBy <a href="${sender.html_url}">${sender.login}</a>`;
        } else if (action == 'unlabeled') {
            return `<b>Issue label removed</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nLabel: ${data.label.name}\nBy <a href="${sender.html_url}">${sender.login}</a>`;
        } else if (action == 'opened') {
            return `<b>New issue</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nAuthor: <a href="${sender.html_url}">${sender.login}</a>`;
        } else if (action == 'edited') {
            return `<b>Issue edited</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nEdited by <a href="${sender.html_url}">${sender.login}</a>`;
        } else if (action == 'closed') {
            return `<b>Issue closed</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nClosed by <a href="${sender.html_url}">${sender.login}</a>`;
        } 
    } else if (gh_event == 'issue_comment') {
        const issue = data.issue;
        const title = escapeChar(issue.title);
        const comment = data.comment;
        if(action == 'created') {
            return `<b>New issue comment</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nComment id: <a href="${comment.html_url}">${comment.id}</a>\nAuthor: <a href="${sender.html_url}">${sender.login}</a>`;
        } else if (action == 'edited') {
            return `<b>Issue comment edited</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nComment id: <a href="${comment.html_url}">${comment.id}</a>\nEdited by: <a href="${sender.html_url}">${sender.login}</a>`;
        } else {
            return `<b>Issue comment deleted</b>\n<a href="${issue.html_url}">#${issue.number}</a> ${title}\nComment id: <a href="${comment.html_url}">${comment.id}</a>\nDeleted by: <a href="${sender.html_url}">${sender.login}</a>`;
        }
    } else if (gh_event == 'pull_request') {
        const pr = data.pull_request;
        const title = escapeChar(pr.title);
        if(action == 'opened') {
            return `<b>New pull request</b>\n<a href="${pr.html_url}">#${pr.number}</a> ${title}\nAuthor: <a href="${sender.html_url}">${sender.login}</a>`;
        }
    } else if (gh_event == 'star') {
        if(action == 'created') {
            return `<b>New star</b>\nBy <a href="${sender.html_url}">${sender.login}</a>`;
        } else {
            return `<b>Star deleted</b>\nBy <a href="${sender.html_url}">${sender.login}</a>`;
        }
    } else if (gh_event == 'watch') {
        if(action == 'started') {
            return `<b>New watcher</b>\n<a href="${sender.html_url}">${sender.login}</a>`;
        }
    } else if (gh_event == 'fork') {
        const forkee = data.forkee;
        return `<b>New fork</b>\n<a href="${forkee.html_url}">${forkee.owner.login}/${forkee.name}</a>`;
    } else {}
    return `<i>Unhandled event: ${gh_event}</i>`;
}

function escapeChar(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

