---
title: "The Importance of Software Documentation"
date: 2021-03-28T20:55:27-07:00
tags:
  - process
  - workflow
---

The first time I heard the term "durable artifact" was from [Isaac Hepworth](https://twitter.com/isaach) about a year and a half ago. At the time we were part of an evolving web team with a lot of opportunity for process and workflow improvements. Fast-forward to today and this same team is broken into specialized groups, planning out sprints and quarters, and working on complex site-wide features (during a global pandemic) and documentation has become more relevant than ever.

Our team used to rely on an email or an individual design comp to contain all of the requirements needed to build a feature. However, as we matured so did our features and so did the need for our documentation to evolve.

A feature is no longer a hastily hacked together single-page update but a rich, well tested, accessible web experience built with reusable UI components and fueled by data-driven hypothesized business value. This level of complexity can no longer be tracked solely in conversations, chats, or emails and requires a centralized document. This project spec, or canonical document, not only acts as the single source of truth but is infinitely valuable when new team members join the project or leadership wants an overview of the project. [Isaac](https://twitter.com/isaach) summarized this concept well:

{{< tweet 1367003154923937793 >}}

## The Project Spec™

The document can act as a "hub" for any links or assets that are required for the project -- think design comp, work items, or complimentary analytics or API documentation. In addition to assets, including all of the points of contact and individuals from various disciplines involved in the project keeps a record of the project team and who should sign-off at various steps along the way.

The most important part of the document is the scope of the project, aka "what are we doing". Equally as important, and what is typically sussed out through conversations and questions, is what is **not** in scope. The last critical element to the document is the success criteria which answers: what is the motivation of the feature and how do we measure the success once it has been launched.

Depending on the type of project, other details may be valuable to capture. A few ideas:

- Delivery time frame: the required/requested launch date.
- Dependencies: other features, teams, or data that the project relies on.
- Development estimates: a high-level estimate, in terms of weeks, of development time.
- Compliance requirements: accessibility, security, and/or privacy requirements.

## Collaboration

From an engineer's perspective, working on a project document together is much more appealing than being forwarded an email and being asked "can you look into this". The document shows that there is a desire to invest in the project (it is _real_) and that some initial work has been established to describe "what we know so far". Collaborating on the document also indicates a sense of ownership in the project and that all parties are working together toward a common goal.

While a product/project manager may be the "owner" of the document, the responsibility does not fall on them alone to create it. There are areas of project documentation that require the expertise and knowledge of members across the team.

Ability to collaborate is one of the greatest strengths of the document. A project document will keep everyone on the same page with the information up-to-date and available at a moment's notice. This canonical document can also replace, what could be, several meetings and the struggles that come with them: finding time that works for everyone, capturing notes from meetings, and pulling people away from actually _doing_ the work. Instead, the team is able to work through the document asynchronously and have an ongoing ping-pong of questions and answers as the document comes to life.

As for the best tools for the job, something that allows for co-authoring and commenting within the document, like [Microsoft Word](https://www.microsoft.com/en-us/microsoft-365/word), would be my recommendation.

## Team Documentation

The importance of team documentation is similar to recordkeeping done within a civilization -- _"the past teaches us about the present"_. This can apply in several areas: maintaining a troubleshooting guide for common issues helps future you when the problem resurfaces, documenting past A/B test results allows for sharable data-driven decisions, and documenting when a feature was added, updated, or removed allows for the teams' timeline to be easily shared. When this information lives in emails and oral history, the accuracy and evidence of the history begin to fade.

Some sort of a team wiki that has a low barrier of entry is ideal. Allow for anyone on the team to edit and add to documentation. Rather than explicit owners of articles, find a tool that allows for individuals to "follow" ([Azure DevOps wiki](https://docs.microsoft.com/en-us/azure/devops/project/wiki/follow-notifications-wiki-pages?view=azure-devops) does this well) to keep an eye on the areas they are most interested in. Anyone following the article can be notified of changes and make adjustments if incorrect information is added. The most important concepts are that _anyone_ on the team is able to edit and that the contribution is simple and easy. The more people willing (and excited) to maintain documentation, the better it will be.

Incorporating a project spec back into the team wiki is important. If the wiki is acting as the teams' centralized, single source of truth for information, the project spec should be referenced somewhere within. Upon completion of a project, there's an opportunity to summarize the update in a changelog for the feature and perhaps add more specific testing, contributing, or maintenance documentation to the greater team-wide documentation.
