const { Octokit } = require("@octokit/rest");

// Tạo một instance của Octokit với authentication token
const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN // Thay bằng token của bạn
});