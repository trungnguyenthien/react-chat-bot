const { Octokit } = require("@octokit/rest");

// Tạo một instance của Octokit với authentication token
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN // Thay bằng token của bạn
});


// Hàm để lấy tất cả bình luận trong pull request
async function getPullRequestComments(owner, repo, pullNumber) {
  try {
    // Gọi API để lấy tất cả bình luận trong pull request
    const { data } = await octokit.issues.listComments({
      owner: owner,
      repo: repo,
      issue_number: pullNumber,
    });

    // Hiển thị danh sách bình luận
    data.forEach(comment => {
      console.log(`Comment by ${comment.user.login}:`);
      console.log(comment.body);
      console.log("-----");
    });
  } catch (error) {
    console.error("Error fetching pull request comments: ", error);
  }
}

// Hàm để lấy tất cả commit giữa hai commit cụ thể
async function getCommitsBetween(owner, repo, startCommit, endCommit) {
  try {
    // Gọi API để lấy danh sách commit
    const { data: commits } = await octokit.repos.compareCommits({
      owner: owner,
      repo: repo,
      base: startCommit,
      head: endCommit,
    });

    // Hiển thị danh sách commit
    commits.commits.forEach(commit => {
      console.log(`Commit: ${commit.sha}`);
      console.log(`Author: ${commit.commit.author.name}`);
      console.log(`Date: ${commit.commit.author.date}`);
      console.log(`Message: ${commit.commit.message}`);
      console.log("-----");
    });
  } catch (error) {
    console.error("Error fetching commits: ", error);
  }
}


// Hàm để lấy thông tin pull request và danh sách commit
async function getPullRequestInfo(owner, repo, pullNumber) {
  try {
    // Lấy thông tin pull request
    const { data: pullRequest } = await octokit.pulls.get({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    });

    console.log("Pull Request Info:");
    console.log(`Title: ${pullRequest.title}`);
    console.log(`User: ${pullRequest.user.login}`);
    console.log(`State: ${pullRequest.state}`);
    console.log(`Created at: ${pullRequest.created_at}`);
    console.log(`Merged at: ${pullRequest.merged_at}`);
    console.log("-----");

    // Lấy danh sách commit trong pull request
    const { data: commits } = await octokit.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    });

    console.log("Commits in Pull Request:");
    commits.forEach(commit => {
      console.log(`Commit SHA: ${commit.sha}`);
      console.log(`Author: ${commit.commit.author.name}`);
      console.log(`Date: ${commit.commit.author.date}`);
      console.log(`Message: ${commit.commit.message}`);
      console.log("-----");
    });
  } catch (error) {
    console.error("Error fetching pull request info: ", error);
  }
}

// Hàm để lấy thông tin chi tiết về pull request
async function getPullRequestDetails(owner, repo, pullNumber) {
  try {
    // Lấy thông tin cơ bản về pull request
    const { data: pullRequest } = await octokit.pulls.get({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    });

    let response = {}

    // Lấy các commit của pull request
    const { data: commits } = await octokit.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: pullNumber,
    });

    response.title = pullRequest.title
    response.description = pullRequest.body
    response.state = pullRequest.state
    response.created_at = pullRequest.created_at
    response.closed_at = pullRequest.closed_at
    response.merged_at = pullRequest.merged_at
    response.base_branch = pullRequest.base.ref
    response.head_branch = pullRequest.head.ref
    response.assignee = pullRequest.assignee ? pullRequest.assignee.login : 'None'
    response.milestone = pullRequest.milestone ? pullRequest.milestone.title : 'None'
    

    // Hiển thị thông tin cơ bản về pull request
    // console.log(`Title: ${pullRequest.title}`);
    // console.log(`State: ${pullRequest.state}`);
    // console.log(`Created at: ${pullRequest.created_at}`);
    // console.log(`Closed at: ${pullRequest.closed_at}`);
    // console.log(`Merged at: ${pullRequest.merged_at}`);
    // console.log(`Base branch: ${pullRequest.base.ref}`);
    // console.log(`Head branch: ${pullRequest.head.ref}`);
    // console.log(`Assignee: ${pullRequest.assignee ? pullRequest.assignee.login : 'None'}`);
    // console.log(`Labels: ${pullRequest.labels.map(label => label.name).join(', ')}`);
    // console.log(`Milestone: ${pullRequest.milestone ? pullRequest.milestone.title : 'None'}`);
    // console.log(`Description: ${pullRequest.body}`);

    response.commits = []
    // Hiển thị các commit của pull request
    for (const commit of commits) {
      const { data: commitDetails } = await octokit.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: commit.sha,
      });

      response.commits.push({
        id: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        additions: commitDetails.stats.additions,
        deletions: commitDetails.stats.deletions,
        html_url: commit.html_url,
      })

      // console.log(`Commit: ${commit.sha}`);
      // console.log(`Author: ${commit.commit.author.name}`);
      // console.log(`Added lines: ${commitDetails.stats.additions}`);
      // console.log(`Removed lines: ${commitDetails.stats.deletions}`);
      // console.log("-----");
    }
    return response

  } catch (error) {
    console.error("Error fetching pull request details: ", error);
    return null
  }
}


module.exports = {
  getPullRequestInfo,
  getPullRequestDetails,
  getPullRequestComments,
  getCommitsBetween
};