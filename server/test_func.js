require('dotenv').config();

const {
  getPullRequestInfo,
  getPullRequestDetails,
  getPullRequestComments,
  getCommitsBetween
} = require('./service/git')

//https://github.com/apple/swift/pull/74309
async function main() {
  console.log(await getPullRequestDetails('apple', 'swift', '74309'))
}

main()