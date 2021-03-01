---
title: GitHub Pull Request Automation with GitHub Actions
date: 2019-10-17T00:00:00+00:00
tags:
  - project
  - github
  - workflow
---

![](/img/blog/github-pull-request-management-with-github-actions/cover.jpg)

[GitHub Actions](https://github.com/features/actions) are currently in beta but are already proving to be another great addition to the GitHub ecosystem.

The Actions allow you to integrate Azure DevOps-like workflows into your repositories, either defined by you or from the ever growing [marketplace](https://github.com/marketplace?type=actions).

![](/img/blog/github-pull-request-management-with-github-actions/marketplace.png)

## Creating an Action

GitHub’s "hello world" [Creating a JavaScript action](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/creating-a-javascript-action) article is a great way to get a simple action running and understand the basics of the metadata, toolkit packages, and workflow definitions. All possible GitHub API integrations can be found in the [octokit documentation](https://octokit.github.io/rest.js/v18).

Actions can be created for a specific project, or opened up to the marketplace and installed across any GitHub project. Like many things GitHub offers, running actions in opensource is free!

## PR Merge Bot

[PR Merge Bot](https://github.com/squalrus/merge-bot) manages pull request integrations by allowing a structured workflow. The workflow can use required labels, blocking labels, and require that reviewers sign-off. Once conditions are met the pull request will be integrated and branch deleted. The workflow can be configured with the following settings:

**reviewers**: Reviewers required and reviewers must all approve. This enforces a reviewer mode where there cannot be any pending reviews and the submitted reviews must be in an "approved" state. Default is `true`.

**labels**: One or more labels required for integration. Default is `"ready"`.

**blocking-labels**: One or more labels that block the integration. Default is `"do not merge"`.

**method**: Merge method to use. Possible values are `merge`, `squash` or `rebase`. Default is `merge`.

**test**: Runs in test mode and will comment rather than merge. This allows you to experiment with the settings without integrating a pull request. Default is `false`.

You can use PR Merge Bot by configuring a YAML-based workflow file, e.g. `.github/workflows/merge-bot.yml`.

```
name: Merge Bot
on:
  pull_request:
    types: [labeled, unlabeled, review_request_removed]
  pull_request_review:
jobs:
  merge:
    runs-on: ubuntu-latest
    name: Merge
    steps:
    - name: Integration check
      uses: squalrus/merge-bot@v0.2.0
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        test: true
        reviewers: true
        labels: ready, merge
        blocking-labels: do not merge
        method: squash
```

If you’re interested in adding review workflows to your pull requests, give [PR Merge Bot](https://github.com/squalrus/merge-bot) a try! If you’d like to see a feature added, create a pull request or an issue.
