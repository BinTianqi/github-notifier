export function parseData(gh_event, dataStr) {
    let result = '';
    let data;
    try {
        data = JSON.parse(dataStr);
    } catch (error) {
        return 'Failed to parse data';
    }
    const sender = data.sender;
    const action = data.action;
    if(gh_event === 'issues') {
        const issue = data.issue;
        if(action === 'labeled') { result += `<b>New issue label</b>\n`; }
        else if (action === 'unlabeled') { result += `<b>Issue label removed</b>\n`; }
        else if (action === 'opened') { result += `<b>New issue</b>\n`; }
        else if (action === 'edited') { result += `<b>Issue edited</b>\n`; }
        else if (action === 'closed') { result += `<b>Issue closed</b>\n`; }
        result += `<a href="${issue.html_url}">#${issue.number}</a> ${escapeChar(issue.title)}\n`;
        if(action === 'labeled') { result += `Label: ${escapeChar(data.label.name)}\nBy <a href="${sender.html_url}">${sender.login}</a>`; }
        else if (action === 'unlabeled') { result += `Label: ${escapeChar(data.label.name)}\nBy <a href="${sender.html_url}">${sender.login}</a>`; }
        else if (action === 'opened') { result += `Author: <a href="${sender.html_url}">${sender.login}</a>`; }
        else if (action === 'edited') { result += `Edited by <a href="${sender.html_url}">${sender.login}</a>`; }
        else if (action === 'closed') { result += `Closed by <a href="${sender.html_url}">${sender.login}</a>`; }
    } else if (gh_event === 'issue_comment') {
        const issue = data.issue;
        const comment = data.comment;
        if(action === 'created') { result += `<b>New issue comment</b>\n`; }
        else if (action === 'edited') { result += `<b>Issue comment edited</b>\n`; }
        else { result += `<b>Issue comment deleted</b>\n`; }
        result += `<a href="${issue.html_url}">#${issue.number}</a> ${escapeChar(issue.title)}\n`;
        result += `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
        if(action === 'created') { result += `Author: <a href="${sender.html_url}">${sender.login}</a>`; }
        else if (action === 'edited') { result += `Edited by: <a href="${sender.html_url}">${sender.login}</a>`; }
        else { result += `Deleted by: <a href="${sender.html_url}">${sender.login}</a>`; }
    } else if(gh_event === 'discussion') {
        const discussion = data.discussion;
        if(action === 'labeled') { result += `<b>New discussion label</b>\n`; }
        else if (action === 'unlabeled') { result += `<b>Discussion label removed</b>\n`; }
        else if (action === 'created') { result += `<b>New discussion</b>\n`; }
        else if (action === 'edited') { result += `<b>Discussion edited</b>\n`; }
        else if (action === 'closed') { result += `<b>Discussion closed</b>\n`; }
        else if (action === 'reopened') { result += `<b>Discussion reopened</b>\n`; }
        else if (action === 'deleted') { result += `<b>Discussion deleted</b>\n`; }
        else if (action === 'answered') { result += `<b>Discussion answered</b>\n`; }
        else if (action === 'unanswered') { result += `<b>Discussion unanswered</b>\n`; }
        else if (action === 'locked') { result += `<b>Discussion locked</b>\n`; }
        else if (action === 'unlocked') { result += `<b>Discussion unlocked</b>\n`; }
        else if (action === 'pinned') { result += `<b>Discussion pinned</b>\n`; }
        else if (action === 'unpinned') { result += `<b>Discussion unpinned</b>\n`; }
        else if (action === 'transferred') { result += `<b>Discussion transferred</b>\n`; }
        else { result += `<b>Discussion category changed</b>\n`; }
        result += `<a href="${discussion.html_url}">#${discussion.number}</a> ${escapeChar(discussion.title)}\n`;
        if(action === 'labeled' || action === 'unlabeled') { result += `Label: ${escapeChar(data.label.name)}\n`; }
        if(action === 'answered') { result += `Answer id: <a href="${data.answer.html_url}">${data.answer.id}</a>\n` }
        if(action === 'unanswered') { result += `Answer id: <a href="${data.old_answer.html_url}">${data.old_answer.id}</a>\n` }
        if(action === 'created' || action === 'category_changed') { result += `Category: <a href="${discussion.category.html_url}">${discussion.category.name}</a>\n`; }
        result += `By <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'discussion_comment') {
        const discussion = data.discussion;
        const comment = data.comment;
        if(action === 'created') { result += `<b>New discussion comment</b>\n`; }
        else if (action === 'edited') { result += `<b>Discussion comment edited</b>\n`; }
        else { result += `<b>Discussion comment deleted</b>\n`; }
        result += `<a href="${discussion.html_url}">#${discussion.number}</a> ${escapeChar(discussion.title)}\n`;
        result += `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`;
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'pull_request') {
        const pr = data.pull_request;
        if(action === 'opened') { result += `<b>New pull request</b>\n`; }
        else if (action === 'closed') { result += `<b>Pull request closed</b>\n`; }
        else if (action === 'reopened') { result += `<b>Pull request reopened</b>\n`; }
        else if (action === 'edited') { result += `<b>Pull request edited</b>\n`; }
        else if (action === 'assigned') { result += `<b>Pull request assigned</b>\n`; }
        else if (action === 'unassigned') { result += `<b>Pull request unassigned</b>\n`; }
        else if (action === 'enqueued') { result += `<b>Pull request enqueued</b>\n`; }
        else if (action === 'dequeued') { result += `<b>Pull request dequeued</b>\n`; }
        else if (action === 'milestoned') { result += `<b>Pull request milestoned</b>\n`; }
        else if (action === 'demilestoned') { result += `<b>Pull request demilestoned</b>\n`; }
        else if (action === 'labeled') { result += `<b>Pull request labeled</b>\n`; }
        else if (action === 'unlabeled') { result += `<b>Pull request unlabeled</b>\n`; }
        else if (action === 'converted_to_draft') { result += `<b>Pull request converted to draft</b>\n`; }
        else if (action === 'ready_for_review') { result += `<b>Pull request ready for review</b>\n`; }
        else if (action === 'locked') { result += `<b>Pull request locked</b>\n`; }
        else if (action === 'unlocked') { result += `<b>Pull request unlocked</b>\n`; }
        else if (action === 'review_requested') { result += `<b>Pull request requested review</b>\n`; }
        else if (action === 'review_request_removed') { result += `<b>Pull request review request removed</b>\n`; }
        else if (action === 'auto_merge_disabled') { result += `<b>Pull request auto merge disabled</b>\n`; }
        else if (action === 'auto_merge_enabled') { result += `<b>Pull request auto merge enabled</b>\n`; }
        else { result += `<b>Pull request synchronized</b>\n`; }
        result += `<a href="${pr.html_url}">#${pr.number}</a> ${escapeChar(pr.title)}\n`;
        if (action === 'assigned' || action === 'unassigned') { result += `Assignee: <a href="${data.assignee.html_url}">${data.assignee.login}</a>>\n`; }
        if (action === 'milestoned' || action === 'demilestoned') { result += `Milestone: <a href="${data.milestone.html_url}">${escapeChar(data.milestone.label)}</a>\n`; }
        if (action === 'labeled' || action === 'unlabeled') { result += `Label: ${escapeChar(data.label.name)}\n`; }
        result += `By <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'push') {
        result = `<b>New push</b>\n`;
        result += `ref: ${data.ref}\n`;
        result += `By: <a href="${sender.html_url}">${sender.login}</a>\n`;
        result += `${data.commits.length} commits:`;
        data.commits.forEach(commit => {
            result += `\n<a href="${commit.url}">${commit.id.substring(0, 8)}</a> `;
            const msg = escapeChar(commit.message);
            if(msg.indexOf('\n') !== -1) {
                result += msg.substring(0, msg.indexOf('\n'));
            } else {
                result += msg;
            }
        });
    } else if (gh_event === 'workflow_run') {
        const wfr = data.workflow_run;
        if(action === 'requested') { result += `<b>Workflow run requested</b>\n`;
        } else if (action === 'in_progress') { result += `<b>Workflow run in progress</b>\n`;
        } else { result += `<b>Workflow run completed</b>\n`; }
        result += `<a href="${wfr.html_url}">${escapeChar(wfr.display_title)}</a>\n`;
        result += `${wfr.name} #${wfr.run_number}\n`;
        result += `Event: ${wfr.event}\n`;
        result += `Status: ${wfr.status}\n`;
        if(wfr.conclusion != null) {
            result += `Conclusion: ${wfr.conclusion}\n`;
        }
        if(action === 'completed') {
            const timeMs = Date.parse(wfr.updated_at) - Date.parse(wfr.created_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'workflow_job') {
        const wfj = data.workflow_job;
        if(action === 'waiting') { result += `<b>Workflow job waiting</b>\n`; }
        else if (action === 'queued') { result += `<b>Workflow job queued</b>\n`; }
        else if (action === 'in_progress') { result += `<b>Workflow job in progress</b>\n`; }
        else { result += `<b>Workflow job completed</b>\n`; }
        result += `<a href="${wfj.html_url}">${escapeChar(wfj.name)}</a>\n`;
        result += `Status: ${wfj.status}\n`;
        if(wfj.conclusion != null) { result += `Conclusion: ${wfj.conclusion}\n`; }
        if(wfj.completed_at != null) {
            const timeMs = Date.parse(wfj.completed_at) - Date.parse(wfj.started_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'check_run') {
        const cr = data.check_run;
        if(action === 'created') { result += `<b>Check run created</b>\n`; }
        else if (action === 'completed') { result += `<b>Check run completed</b>\n`; }
        else if (action === 'requested_action') { result += `<b>Check run requested action</b>\n`; }
        else { result += `<b>Check run re-requested</b>\n`; }
        result += `<a href="${cr.html_url}">${escapeChar(cr.name)}</a>\n`;
        result += `Status: ${cr.status}\n`;
        if(cr.conclusion != null) { result += `Conclusion: ${cr.conclusion}\n`; }
        if(cr.completed_at != null) {
            const timeMs = Date.parse(cr.completed_at) - Date.parse(cr.started_at);
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'check_suite') {
        const cs = data.check_suite;
        if(action === 'completed') { result += `<b>Check suite completed</b>\n`; }
        else if (action === 'requested') { result += `<b>Check suite requested</b>\n`; }
        else { result += `<b>Check suite re-requested</b>\n`; }
        if(cs.status != null) { result += `Status: ${cs.status}\n`; }
        if(cs.conclusion != null) { result += `Conclusion: ${cs.conclusion}\n`; }
        const timeMs = Date.parse(cs.updated_at) - Date.parse(cs.created_at);
        result += `Time spent: ${parseTimeMs(timeMs)}\n`
        result += `By: <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'create') {
        if(data.ref_type === 'branch') { result += `<b>New branch</b>\n`; }
        else { result += `<b>New tag</b>\n`; }
        result += `ref: ${data.ref}\n`
        result += `Created by <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'delete') {
        if(data.ref_type === 'branch') { result += `<b>Branch deleted</b>\n`; }
        else { result += `<b>Tag deleted</b>\n`; }
        result += `ref: ${data.ref}\n`
        result += `By <a href="${sender.html_url}">${sender.login}</a>`;
    } else if (gh_event === 'release') {
        const release = data.release;
        if(data.action === 'created') { result += `<b>Release created</b>\n`; }
        else if (data.action === 'deleted') { result += `<b>Release deleted</b>\n`; }
        else if (data.action === 'published') { result += `<b>Release published</b>\n`; }
        else if (data.action === 'unpublished') { result += `<b>Release unpublished</b>\n`; }
        else if (data.action === 'release') { result += `<b>Release</b>\n`; }
        else if (data.action === 'pre-released') { result += `<b>Pre-release</b>\n`; }
        else { result += `<b>Release edited</b>\n`; }
        result += `${release.name}\n`;
        result += `id: <a href="${release.html_url}">${release.id}</a>\n`;
        result += `Draft: ${release.draft}\n`;
        result += `Pre-release: ${release.prerelease}\n`;
        result += `By <a href="${sender.html_url}">${sender.login}</a>\n`;
        result += `${release.assets.length} assets:`;
        release.assets.forEach(asset => {
            result += `\n<a href="${asset.browser_download_url}">${asset.name}</a>`;
        });
    } else if (gh_event === 'star') {
        if(action === 'created') { result += `<b>New star</b>\n`; }
        else { result += `<b>Star deleted</b>\n`; }
        result += `By <a href="${sender.html_url}">${sender.login}</a>\n`;
        result += `Total stargazers: ${data.repository.stargazers_count}`;
    } else if (gh_event === 'watch') {
        result += `<b>New watcher</b>\n`;
        result += `<a href="${sender.html_url}">${sender.login}</a>\n`;
        result += `Total watchers: ${data.repository.watchers_count}`;
    } else if (gh_event === 'fork') {
        const forkee = data.forkee;
        result += `<b>New fork</b>\n`;
        result += `<a href="${forkee.html_url}">${forkee.owner.login}/${forkee.name}</a>`;
    } else {
        return `<i>Unhandled event: ${gh_event}</i>`;
    }
    if (result !== '') {
        return result;
    } else {
        return `<i>Unhandled event: ${gh_event}</i>`;
    }
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
