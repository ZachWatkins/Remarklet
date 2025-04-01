# Welcome to the Remarklet contributing guide

Thank you for considering investing your time by contributing to the project!

At this time, I am accepting contributions to improve the following areas:

- Security
- Documentation
- Tests
- GitHub Actions

Read our [Code of Conduct](CODE_OF_CONDUCT.md) to help this open-source project's community remain open and welcoming.

This guide will help you get started and explains our process for open source contributions.

To understand the purpose of the project, read the [README](README.md).

## Getting started

For resources to help you get started with creating your contribution, see here:

- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)
- [GitHub Markdown reference](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/about-writing-and-formatting-on-github)

Check to see what [types of contributions](/contributing/types-of-contributions.md) we accept before making changes.

## Issues

### Create a new issue

If you encounter a problem while using the project and have determined there is something in the code that isn't working as intended, [search for an existing issue](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments) before creating a new one. If it doesn't exist then you may [open a new issue](https://github.com/zachwatkins/remarklet/issues/new/choose).

### Solve an issue

You are welcome to find an [existing issue](https://github.com/zachwatkins/remarklet/issues) that you want to help us with. You can use issue labels to help your search. If you find an issue that isn't assigned to someone then you are welcome to open a pull request to submit your solution.

#### Make Changes locally

1. [Fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo#fork-an-example-repository)

2. Install or update NodeJS using the version specified in `package.json` under "engines".

3. Create a new branch and start making your changes!

4. Commit the changes to the new branch on your forked version of the repository.

5. Use the [self-review](/contributing/self-review.md) checklist to help us review your pull request more quickly.

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

Once your pull request is merged, you will appear in our [list of contributors](https://github.com/ZachWatkins/.github/graphs/contributors).

## Windows

This site can be developed on Windows, however a few potential gotchas need to be kept in mind:

1. Regular Expressions: Windows uses `\r\n` for line endings, while Unix-based systems use `\n`. Therefore, when working on Regular Expressions, use `\r?\n` instead of `\n` in order to support both environments. The Node.js [`os.EOL`](https://nodejs.org/api/os.html#os_os_eol) property can be used to get an OS-specific end-of-line marker.
2. Paths: Windows systems use `\` for the path separator, which would be returned by `path.join` and others. You could use `path.posix`, `path.posix.join` etc and the [slash](https://ghub.io/slash) module, if you need forward slashes - like for constructing URLs - or ensure your code works with either.
3. Bash: Not every Windows developer has a terminal that fully supports Bash, so it's generally preferred to write [scripts](/script) in JavaScript instead of Bash.
4. Filename too long error: There is a 260 character limit for a filename when Git is compiled with `msys`. While the suggestions below are not guaranteed to work and could cause other issues, a few workarounds include:
    - Update Git configuration: `git config --system core.longpaths true`
    - Consider using a different Git client on Windows
