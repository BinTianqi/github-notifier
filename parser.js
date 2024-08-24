export function parseData(gh_event, dataStr) {
    let result = ''
    let data
    let noBy = false
    try {
        data = JSON.parse(dataStr)
    } catch (error) {
        return `Failed to parse data\n${error}`
    }
    const sender = data.sender
    const action = data.action
    if(gh_event === 'issues') {
        const issue = data.issue
        result += `<b>Issue ${action}</b>\n`
        result += `<a href="${issue.html_url}">#${issue.number} ${escapeChar(issue.title)}</a>\n`
        if(action === 'locked') result += `Reason: ${issue.active_lock_reason}`
        if(action === 'closed') result += `Reason: ${issue.state_reason}`
        if(action.includes('milestone')) result += `Milestone: ${escapeChar(data.milestone.title)}`
        if(action.includes('label')) result += `Label: ${escapeChar(data.label.name)}\n`
    } else if (gh_event === 'issue_comment') {
        const issue = data.issue
        const comment = data.comment
        result += `<b>Issue comment ${action}</b>\n`
        result += `<a href="${issue.html_url}">#${issue.number} ${escapeChar(issue.title)}</a>\n`
        result += `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
    } else if(gh_event === 'discussion') {
        const discussion = data.discussion
        result += `<b>Discussion ${action}</b>\n`
        result += `<a href="${discussion.html_url}">#${discussion.number} ${escapeChar(discussion.title)}</a>\n`
        if(action.includes('label')) result += `Label: ${escapeChar(data.label.name)}\n`
        if(action === 'answered') result += `Answer id: <a href="${data.answer.html_url}">${data.answer.id}</a>\n`
        if(action === 'unanswered') result += `Old answer id: <a href="${data.old_answer.html_url}">${data.old_answer.id}</a>\n`
        if(action === 'created' || action === 'category_changed') result += `Category: <a href="${discussion.category.html_url}">${discussion.category.name}</a>\n`
    } else if (gh_event === 'discussion_comment') {
        const discussion = data.discussion
        const comment = data.comment
        result += `<b>Discussion comment ${action}</b>\n`
        result += `<a href="${discussion.html_url}">#${discussion.number} ${escapeChar(discussion.title)}</a>\n`
        result += `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
    } else if (gh_event === 'pull_request') {
        const pr = data.pull_request
        result += `<b>Pull request ${action.replaceAll('_', ' ')}</b>\n`
        result += `<a href="${pr.html_url}">#${pr.number} ${escapeChar(pr.title)}</a>\n`
        if (action.includes('assign')) result += `Assignee: <a href="${data.assignee.html_url}">${data.assignee.login}</a>\n`
        if (action.includes('milestone')) result += `Milestone: <a href="${data.milestone.html_url}">${escapeChar(data.milestone.label)}</a>\n`
        if (action.includes('label')) result += `Label: ${escapeChar(data.label.name)}\n`
    } else if (gh_event === 'push') {
        result = `<b>Push</b>\n`
        result += `ref: ${data.ref}\n`
        if(data.commits.length > 0) {
            result += '<blockquote>'
            data.commits.forEach(commit => {
                result += `<a href="${commit.url}">${commit.id.substring(0, 7)}</a> `
                const msg = escapeChar(commit.message)
                if(msg.indexOf('\n') !== -1) result += msg.substring(0, msg.indexOf('\n'))
                else result += msg
                result += '\n'
            })
            result += '</blockquote>'
        }
    } else if (gh_event === 'workflow_run') {
        const wfr = data.workflow_run
        result += `<b>Workflow run ${action.replaceAll('_', ' ')}</b>\n`
        result += `<a href="${wfr.html_url}">${escapeChar(wfr.display_title)}</a>\n`
        result += `${wfr.name} #${wfr.run_number}\n`
        if(action === 'requested') result += `Event: ${wfr.event}\n`
        result += `Status: ${wfr.status}\n`
        if(wfr.conclusion != null) {
            result += `Conclusion: ${wfr.conclusion}\n`
        }
        if(action === 'completed') {
            const timeMs = Date.parse(wfr.updated_at) - Date.parse(wfr.created_at)
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
    } else if (gh_event === 'workflow_job') {
        const wfj = data.workflow_job
        result += `<b>Workflow job ${action.replaceAll('_', ' ')}</b>\n`
        result += `<a href="${wfj.html_url}">${escapeChar(wfj.name)}</a>\n`
        result += `Status: ${wfj.status}\n`
        if(wfj.conclusion != null) result += `Conclusion: ${wfj.conclusion}\n`
        if(wfj.completed_at != null) {
            const timeMs = Date.parse(wfj.completed_at) - Date.parse(wfj.started_at)
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
    } else if (gh_event === 'check_run') {
        const cr = data.check_run
        result += `<b>Check run ${action.replaceAll('_', ' ')}</b>\n`
        result += `<a href="${cr.html_url}">${escapeChar(cr.name)}</a>\n`
        result += `Status: ${cr.status}\n`
        if(cr.conclusion != null) result += `Conclusion: ${cr.conclusion}\n`
        if(cr.completed_at != null) {
            const timeMs = Date.parse(cr.completed_at) - Date.parse(cr.started_at)
            result += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
    } else if (gh_event === 'check_suite') {
        const cs = data.check_suite
        result += `<b>Check suite ${action}</b>\n`
        if(cs.status != null) result += `Status: ${cs.status}\n`
        if(cs.conclusion != null) result += `Conclusion: ${cs.conclusion}\n`
        const timeMs = Date.parse(cs.updated_at) - Date.parse(cs.created_at)
        result += `Time spent: ${parseTimeMs(timeMs)}\n`
    } else if (gh_event === 'create') {
        if(data.ref_type === 'branch') result += `<b>Branch created</b>\n`
        else result += `<b>Tag created</b>\n`
        result += `ref: ${data.ref}\n`
    } else if (gh_event === 'delete') {
        if(data.ref_type === 'branch') result += `<b>Branch deleted</b>\n`
        else result += `<b>Tag deleted</b>\n`
        result += `ref: ${data.ref}\n`
    } else if (gh_event === 'release') {
        const release = data.release
        result += `<b>Release ${action}</b>\n`
        result += `<a href="${release.html_url}">${release.name}</a>\n`
        if(action !== 'published') result += `Draft: ${release.draft}\n`
        result += `Pre-release: ${release.prerelease}\n`
        if(release.assets.length > 0) {
            result += '<blockquote>'
            release.assets.forEach(asset => {
                result += `\n<a href="${asset.browser_download_url}">${asset.name}</a>`
            })
            result += '</blockquote>'
        }
    } else if (gh_event === 'star') {
        result += `<b>Star ${action}</b> by <a href="${sender.html_url}">${sender.login}</a>\n`
        result += `Total stargazers: ${data.repository.stargazers_count}`
        noBy = true
    } else if (gh_event === 'watch') {
        result += `<b>New watcher</b>: <a href="${sender.html_url}">${sender.login}</a>\n`
        result += `Total watchers: ${data.repository.watchers_count}`
        noBy = true
    } else if (gh_event === 'fork') {
        result += `<b>New fork</b>\n`
        result += `<a href="${forkee.html_url}">${sender.login}/${data.forkee.name}</a>`
        noBy = true
    } else if (gh_event === 'ping') {
        result += `<b>Ping</b>\n`
        result += `Active: ${data.hook.active}\n`
        result += `Events:`
        hook.events.forEach(hookEvent => {
            result += ' ' + hookEvent
        })
    } else {
        return `<i>Unhandled event: ${gh_event}</i>`
    }
    if(!noBy) result += `By <a href="${sender.html_url}">${sender.login}</a>`
    if (result !== '') {
        return result
    } else {
        return `<i>Unhandled event: ${gh_event}</i>`
    }
}

function escapeChar(str) {
    return str.replaceAll('&', '&amp').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function parseTimeMs(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    hours = hours % 24
    minutes = minutes % 60
    seconds = seconds % 60
    let readableTime = ""
    if (days > 0) { readableTime += days + "d" }
    if (hours > 0) { readableTime += hours + "h" }
    if (minutes > 0) { readableTime += minutes + "m" }
    if (seconds > 0) { readableTime += seconds + "s" }
    return readableTime.trim()
}
