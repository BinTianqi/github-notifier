export function parseData(dataStr) {
    var data = '';
    try {
        data = JSON.parse(dataStr);
    } catch (error) {
        return 'Failed to parse data';
    }
    const action = data.action;
    var result = '';
    if(data.issue) {
        if(action == 'created') {
            return parseIssueCreated(data);
        } else if(action == 'edited') {
            return parseIssueEdited(data);
        } else {
            return action;
        }
    } else {
        return action;
    }
}

function parseIssueEdited(data) {
    const issue = data.issue;
    return `**Issue edited**\n[#${issue.number}](${issue.html_url}) ${issue.title}`;
}

function parseIssueCreated(data) {
    const issue = data.issue;
    return `**Issue created**\n[#${issue.number}](${issue.html_url}) ${issue.title}`;
}

