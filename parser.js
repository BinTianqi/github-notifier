import { escapeChar, parseTimeMs } from "./utils.js"

export default function parseData(gh_event, payload) {
    let msg = ""
    const data = JSON.parse(payload)
    let noBy = false
    const sender = data.sender
    const action = data.action
    if(gh_event === 'issues') {
        const issue = data.issue
        msg = `<b>Issue ${action}</b>\n`
            + `<a href="${issue.html_url}">#${issue.number} ${escapeChar(issue.title)}</a>\n`
        if(action === 'locked') msg += `Reason: ${issue.active_lock_reason}\n`
        if(action === 'closed') msg += `Reason: ${issue.state_reason}\n`
        if(action.includes('milestone')) msg += `Milestone: ${escapeChar(data.milestone.title)}\n`
        if(action.includes('label')) msg += `Label: ${escapeChar(data.label.name)}\n`
    } else if (gh_event === 'issue_comment') {
        const issue = data.issue
        const comment = data.comment
        msg = `<b>Issue comment ${action}</b>\n`
            + `<a href="${issue.html_url}">#${issue.number} ${escapeChar(issue.title)}</a>\n`
            + `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
    } else if(gh_event === 'discussion') {
        const discussion = data.discussion
        msg = `<b>Discussion ${action}</b>\n`
            + `<a href="${discussion.html_url}">#${discussion.number} ${escapeChar(discussion.title)}</a>\n`
        if(action.includes('label')) msg += `Label: ${escapeChar(data.label.name)}\n`
        if(action === 'answered') msg += `Answer id: <a href="${data.answer.html_url}">${data.answer.id}</a>\n`
        if(action === 'unanswered') msg += `Old answer id: <a href="${data.old_answer.html_url}">${data.old_answer.id}</a>\n`
        if(action === 'created' || action === 'category_changed') msg += `Category: <a href="${discussion.category.html_url}">${discussion.category.name}</a>\n`
    } else if (gh_event === 'discussion_comment') {
        const discussion = data.discussion
        const comment = data.comment
        msg = `<b>Discussion comment ${action}</b>\n`
            + `<a href="${discussion.html_url}">#${discussion.number} ${escapeChar(discussion.title)}</a>\n`
            + `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
    } else if (gh_event === 'pull_request') {
        const pr = data.pull_request
        msg = `<b>Pull request ${action.replaceAll('_', ' ')}</b>\n`
            + `<a href="${pr.html_url}">#${pr.number} ${escapeChar(pr.title)}</a>\n`
        if (action.includes('assign')) msg += `Assignee: <a href="${data.assignee.html_url}">${data.assignee.login}</a>\n`
        if (action.includes('milestone')) msg += `Milestone: <a href="${data.milestone.html_url}">${escapeChar(data.milestone.label)}</a>\n`
        if (action.includes('label')) msg += `Label: ${escapeChar(data.label.name)}\n`
    } else if (gh_event === 'push') {
        msg = `<b>Push</b>\n`
            + `ref: ${data.ref}\n`
        if(data.commits.length > 0) {
            msg += '<blockquote>'
            data.commits.forEach(commit => {
                msg += `<a href="${commit.url}">${commit.id.substring(0, 7)}</a> `
                    + `${escapeChar(commit.message.split("\n")[0])}\n`
            })
            msg += '</blockquote>'
        }
    } else if (gh_event === 'commit_comment') {
        const comment = data.comment
        msg = `<b>Commit comment ${action}</b>\n`
            + `On commit ${comment.commit_id}\n`
            + `Comment id: <a href="${comment.html_url}">${comment.id}</a>\n`
    } else if (gh_event === 'workflow_run') {
        const wfr = data.workflow_run
        msg = `<b>Workflow run ${action.replaceAll('_', ' ')}</b>\n`
            + `<a href="${wfr.html_url}">${escapeChar(wfr.display_title)}</a>\n`
            + `${wfr.name} #${wfr.run_number}\n`
        if(action === 'requested') msg += `Event: ${wfr.event}\n`
        msg += `Status: ${wfr.status}\n`
        if(wfr.conclusion != null) {
            msg += `Conclusion: ${wfr.conclusion}\n`
        }
        if(action === 'completed') {
            const timeMs = Date.parse(wfr.updated_at) - Date.parse(wfr.created_at)
            msg += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        if(action !== "requested") noBy = true
    } else if (gh_event === 'workflow_job') {
        const wfj = data.workflow_job
        msg = `<b>Workflow job ${action.replaceAll('_', ' ')}</b>\n`
            + `<a href="${wfj.html_url}">${escapeChar(wfj.name)}</a>\n`
            + `Status: ${wfj.status}\n`
        if(wfj.conclusion != null) msg += `Conclusion: ${wfj.conclusion}\n`
        if(wfj.completed_at != null) {
            const timeMs = Date.parse(wfj.completed_at) - Date.parse(wfj.started_at)
            msg += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        if(action !== "queued") noBy = true
    } else if (gh_event === 'check_run') {
        const cr = data.check_run
        msg = `<b>Check run ${action.replaceAll('_', ' ')}</b>\n`
            + `<a href="${cr.html_url}">${escapeChar(cr.name)}</a>\n`
            + `Status: ${cr.status}\n`
        if(cr.conclusion != null) msg += `Conclusion: ${cr.conclusion}\n`
        if(cr.completed_at != null) {
            const timeMs = Date.parse(cr.completed_at) - Date.parse(cr.started_at)
            msg += `Time spent: ${parseTimeMs(timeMs)}\n`
        }
        if(action === "completed") noBy = true
    } else if (gh_event === 'check_suite') {
        const cs = data.check_suite
        msg = `<b>Check suite ${action}</b>\n`
        if(cs.status != null) msg += `Status: ${cs.status}\n`
        if(cs.conclusion != null) msg += `Conclusion: ${cs.conclusion}\n`
        const timeMs = Date.parse(cs.updated_at) - Date.parse(cs.created_at)
        msg += `Time spent: ${parseTimeMs(timeMs)}\n`
        if(action === "completed") noBy = true
    } else if (gh_event === 'create') {
        if(data.ref_type === 'branch') msg += `<b>Branch created</b>\n`
        else msg += `<b>Tag created</b>\n`
        msg += `ref: ${data.ref}\n`
    } else if (gh_event === 'delete') {
        if(data.ref_type === 'branch') msg += `<b>Branch deleted</b>\n`
        else msg += `<b>Tag deleted</b>\n`
        msg += `ref: ${data.ref}\n`
    } else if (gh_event === 'release') {
        const release = data.release
        msg = `<b>Release ${action}</b>\n`
            + `<a href="${release.html_url}">${release.name}</a>\n`
        if(action !== 'published') msg += `Draft: ${release.draft}\n`
        msg += `Pre-release: ${release.prerelease}\n`
        if(release.assets.length > 0) {
            msg += '<blockquote>'
            release.assets.forEach(asset => {
                msg += `\n<a href="${asset.browser_download_url}">${asset.name}</a>`
            })
            msg += '</blockquote>'
        }
    } else if (gh_event === 'label') {
        const label = data.label
        msg = `<b>Label ${action}</b>\n`
            + `Name: ${escapeChar(label.name)}\n`
            + `Color: #${label.color}\n`
    } else if (gh_event === 'milestone') {
        const milestone = data.milestone
        msg = `<b>Milestone ${action}</b>\n`
            + `<a href="${milestone.html_url}">${milestone.title}</a>\n`
    } else if (gh_event === 'star') {
        msg = `<b>Star ${action}</b> by <a href="${sender.html_url}">${sender.login}</a>\n`
            + `Total stargazers: ${data.repository.stargazers_count}`
        noBy = true
    } else if (gh_event === 'watch') {
        msg = `<b>New watcher</b>: <a href="${sender.html_url}">${sender.login}</a>\n`
            + `Total watchers: ${data.repository.watchers_count}`
        noBy = true
    } else if (gh_event === 'fork') {
        msg = `<b>New fork</b>\n`
            + `<a href="${forkee.html_url}">${sender.login}/${data.forkee.name}</a>`
        noBy = true
    } else if (gh_event === 'repository_ruleset') {
        const ruleset = data.repository_ruleset
        msg = `<b>Repository ruleset ${action}</b>\n`
            + `Name: ${ruleset.name}\n`
            + `Target: ${ruleset.target}\n`
            + `Enforcement: ${ruleset.enforcement}\n`
    } else if (gh_event === 'ping' || gh_event === 'meta') {
        const hook = data.hook
        msg = `<b>Hello webhook</b>\n`
            + `Name: ${hook.name}\n`
            + `Type: ${hook.type}\n`
            + `Active: ${hook.active}\n`
    } else {
        return `<i>Unhandled event: ${gh_event}</i>`
    }
    if(!noBy) msg += `By <a href="${sender.html_url}">${sender.login}</a>`
    return msg
}

