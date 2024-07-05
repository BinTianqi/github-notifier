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
    } else if (gh_event == 'push') {
        var result = `<b>New push</b>\n`;
        result += `ref: ${data.ref}\n`;
        result += `By: <a href="${sender.html_url}">${sender.login}</a>\n`;
        result += `${data.commits.length} commits:`;
        data.commits.forEach(commit => {
            result += `\n<a href="${commit.url}">${commit.id.substr(0, 7)}</a> `;
            const msg = escapeChar(commit.message);
            if(msg.indexOf('\n') != -1) {
                result += msg.substr(0, msg.indexOf('\n'));
            } else {
                result += msg;
            }
        });
        return result;
    } else if (gh_event == 'workflow_run') {
        const wfr = data.workflow_run;
        var result = '';
        if(action == 'requested') {
            result += `<b>Workflow run requested</b>\n`;
        } else if (action == 'in_progress') {
            result += `<b>Workflow run in progress</b>\n`;
        } else {
            result += `<b>Workflow run completed</b>\n`;
        }
        result += `<a href="${wfr.html_url}">${escapeChar(wfr.display_title)}</a>\n`;
        result += `${wfr.name} #${wfr.run_number}\n`;
        result += `Event: ${wfr.event}\n`;
        result += `Status: ${wfr.status}\n`;
        if(wfr.conclusion != null) {
            result += `Conclusion: ${wfr.conclusion}\n`;
        }
        if(action == 'completed') {
            const timeMs = Date.parse(wfr.updated_at) - Date.parse(wfr.created_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
        return result;
    } else if (gh_event == 'workflow_job') {
        const wfj = data.workflow_job;
        var result = '';
        if(action == 'waiting') {
            result += `<b>Workflow job waiting</b>\n`;
        } else if (action == 'queued') {
            result += `<b>Workflow job queued</b>\n`;
        } else if (action == 'in_progress') {
            result += `<b>Workflow job in progress</b>\n`;
        } else {
            result += `<b>Workflow job completed</b>\n`;
        }
        result += `<a href="${wfj.html_url}">${escapeChar(wfj.name)}</a>\n`;
        result += `Status: ${wfj.status}\n`;
        if(wfj.conclusion != null) {
            result += `Conclusion: ${wfj.conclusion}\n`;
        }
        if(wfj.completed_at != null) {
            const timeMs = Date.parse(wfj.completed_at) - Date.parse(wfj.started_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
        return result;
    } else if (gh_event == 'check_run') {
        const cr = data.check_run;
        var result = '';
        if(action == 'created') {
            result += `<b>Check run created</b>\n`;
        } else if (action == 'completed') {
            result += `<b>Check run completed</b>\n`;
        } else if (action == 'requested_action') {
            result += `<b>Check run requested action</b>\n`;
        } else {
            result += `<b>Check run re-requested</b>\n`;
        }
        result += `<a href="${cr.html_url}">${escapeChar(cr.name)}</a>\n`;
        result += `Status: ${cr.status}\n`;
        if(cr.conclusion != null) {
            result += `Conclusion: ${cr.conclusion}\n`;
        }
        if(cr.completed_at != null) {
            const timeMs = Date.parse(cr.completed_at) - Date.parse(cr.started_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
        return result;
    } else if (gh_event == 'create') {
        var result = '';
        if(data.ref_type == 'branch') { result += `<b>New branch</b>\n`; }
        else { result += `<b>New tag</b>\n`; }
        result += `ref: ${data.ref}\n`
        result += `Created by: <a href="${sender.html_url}">${sender.login}</a>`;
        return result;
    } else if (gh_event == 'star') {
        var result = '';
        if(action == 'created') { result += `<b>New star</b>\n`; }
        else { result += `<b>Star deleted</b>\n`; }
        result += `By <a href="${sender.html_url}">${sender.login}</a>`;
        return result;
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

function parseTimeMs(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    minutes = minutes % 60;
    seconds = seconds % 60;
    let readableTime = "";
    if (days > 0) { readableTime += days + "d"; }
    if (hours > 0) { readableTime += hours + "h"; }
    if (minutes > 0) { readableTime += minutes + "m"; }
    if (seconds > 0) { readableTime += seconds + "s"; }
    return readableTime.trim();
}
