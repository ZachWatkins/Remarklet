# Contributing

Thank you for considering investing your time by contributing to the project!

The purpose of the Remarklet project can be summed up as follows:

> **Remarklet** adds visual editing tools to your web pages. This makes modifying them remarkably easy, even on touchscreens!

At this time, I am accepting contributions to improve the following areas:

- Security
- Documentation
- Tests
- GitHub Actions

Read our [Code of Conduct](code-of-conduct.md) to help this open-source project's community remain open and welcoming.

This guide will help you get started and explains the process for open source contributions.

## Discussions

The [Discussions](https://github.com/zachwatkins/remarklet/discussions) area is for conversations related to the project, a pull request you are working on, a new idea, or to share your experience.

## Issues

The [GitHub Issues](https://github.com/zachwatkins/remarklet/issues) area is where we receive and process requests to fix a bug, modify a feature, or add a feature. Issues with a **triage** label are pending review and not ready for work. Before submitting a new issue, please see if there is one already open for it where you can add your comment.

Create a new issue using one of our [templates](https://github.com/zachwatkins/remarklet/issues/new/choose) to help us understand and respond to it more quickly.

If you want to work on an issue, please comment on it to let me know and I can assign the issue to you. This helps us avoid duplicate work. If I do not receive your pull request within 2 weeks, I will assume that you are no longer working on it and will unassign the issue. For more information on submitting pull requests, see the [Pull Requests](#pull-requests) section below.

### Bugs

We use [GitHub Issues](https://github.com/zachwatkins/remarklet/issues) to receive and process requests to fix bugs. Before submitting a new bug report, please see if there is an issue already open for it where you can add your comment. If you have encountered a new, unreported bug then you can submit a [bug report](https://github.com/ZachWatkins/Remarklet/issues/new?template=bug-report.yml). This helps us keep track of the issues and makes it easier for you to follow up on them.

Bug issues that are out of scope to fix are documented in a GitHub Discussion here: [Known issues not in scope](https://github.com/ZachWatkins/Remarklet/discussions/100).

### Security Bugs

To report a vulnerability with the project please send an email to zwatkins.it@gmail.com with [SECURITY] at the beginning of the subject line.

When a vulnerability is found, I will notify users in [GitHub Discussions](https://github.com/zachwatkins/remarklet/discussions).

For more information on our security policy, see here: [Security](https://github.com/ZachWatkins/Remarklet/security/policy).

### Feature Requests

Feature requests are welcome! You may want to open a discussion first (see [Discussions](https://github.com/zachwatkins/remarklet/discussions)) before submitting a feature request to see if others are interested in it. If you have a feature request that you would like to submit, please use the [feature request template](https://github.com/ZachWatkins/Remarklet/issues/new?template=feature-request.yml).

## Pull requests

A [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) allows you to submit changes you've written to the project's files.

When you submit a pull request, you are proposing that the changes be merged into the main branch of the project. This is a great way to contribute to open source projects and share your work with others.

The software license is the [MIT License](https://opensource.org/licenses/MIT). In order to contribute code to this project you must agree to the terms of the license. You must also agree to the following:

- You are the original author of the code you are submitting.
- You have the right to submit the code under the terms of the MIT License.
- You are granting permission for your code to be used, modified, and distributed by others under the same license.
- You are not submitting code that is subject to any other license or agreement.

Pull requests will be accepted for changes related to:

- Fixing a bug
- Adding a new feature
- Improving the documentation
- Improving test coverage
- GitHub Actions
- Security of the project

### Code Contribution Guides

To develop this project, you will need to install [Node.js](https://nodejs.org/en/) version 22 and [Git](https://git-scm.com/).

For resources to help you get started with creating your code contribution, see here:

- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)
- [GitHub Markdown reference](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github)

Once you've installed Node.js (which includes the popular `npm` package manager), open your terminal and run the following to develop the project:

```sh
git clone https://github.com/zachwatkins/remarklet
cd remarklet
npm ci
```

This will clone the repository and install the dependencies.

To develop the Remarklet library, you can check out the specific version branch you want to modify. Example:

```sh
git switch v1.2
```

To develop the website, you will need to check out the main branch and run the website server:

```sh
git switch main
cd website
npm ci
npm start
```

If you want to see Remarklet in action, you can run the demo site locally:

```sh
cd demo
npm ci
npm run dev
```

This will start a local development server which runs at `http://localhost:3000` and imports the project root file at `./index.js`.

To develop the documentation website, run:

```sh
cd website
npm ci
npm start
```

This will start a local development server which runs at `http://localhost:3000`.

#### Cross Platform Development

To maintain this project while allowing as many people as possible to contribute, it's important to keep in mind the different environments that people may be using to develop on.

Line endings are a common source of problems when working on cross-platform projects. Windows uses `CRLF` line endings, while Unix-based systems (like Linux and macOS) use `LF` line endings.
To avoid issues with line endings, we recommend using `LF` line endings in your code. Most modern text editors and IDEs can be configured to use `LF` line endings by default.
To ensure that your code is using `LF` line endings, you can use the following command in your terminal:

```sh
git config --global core.autocrlf input
```

This will configure Git to automatically convert `CRLF` line endings to `LF` when you commit your code, and convert `LF` line endings to `CRLF` when you check out your code on Windows.
This way, you can work on your code in a cross-platform environment without worrying about line endings causing issues.

When writing JavaScript that will execute in a Node.js-like context, instead of a browser context, be mindful of Windows using `\r\n` for line endings unlike Unix-based systems which use `\n`.

#### Make Changes locally

1. [Fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#fork-an-example-repository)

2. Install or update NodeJS using the version specified in `package.json` under "engines".

3. Create a new branch and start making your changes!

4. Commit the changes to the new branch on your forked version of the repository.

5. Include the following markdown code in your pull request's description once you have worked through the build failures and tests are passing:

```markdown
- [x] I've worked through build failures and tests are passing.
```

#### Pull Request

When your changes are ready for review, create a pull request (also known as a "PR"). A maintainer for the repository will review your proposal and may ask questions or request additional information.

- Use the pull request template to help us understand your changes and their purpose.
- Link your pull request to an [issue](https://github.com/zachwatkins/remarklet/issues) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so we have permission to merge your PR's branch.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or comments on the pull request. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch to update the pull request.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

#### Your pull request is merged!

Congratulations! Thank you for your contribution!

Once your pull request is merged, you will appear in our [list of contributors](https://github.com/zachwatkins/remarklet/graphs/contributors).
