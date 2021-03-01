---
title: Estimating work on a software team
date: 2021-02-25T00:00:00+00:00
tags:
  - process
  - workflow
---

How long is this going to take?

Estimating work is difficult. Properly estimating work is work. When working on a team with a lot of stakeholders accurate estimations provide data decision makers need. The estimate can contribute to a features priority and help plan out a roadmap for future work.

From the engineering side, it can be difficult to resist the desire to start coding. It is important to take some initial steps to establish a "plan".

<!--more-->

## Why break it down

Breaking down the work gives the engineering team a realistic view into the scope as well as how much of it could be load-balanced across the team. For folks external to the team, this information _could_ play into the priority of the feature (if complexity is a consideration) as well as inform the roadmap for how the feature fits in among other projects.

## Breaking it down

Trying to guestimate a feature called "Build new product catalog page with filtering" is very difficult, and without properly planning out the work, some important checkpoints or details could be easy overlooked.

Exploring the details of the feature more will likely determine that the large epic may benefit from being broken down into smaller features:

- [Integrate with an API to receive the data](#integrate-with-an-api-to-receive-the-data)
- [Build the UI for the product catalog](#build-the-ui-for-the-product-catalog)
- [Reviews](#reviews)

Even at this level it becomes clear there is going to be a little more than originally thought.

### Integrate with an API to receive the data

Exploring this detail will raise questions around data format, resiliency, and latency. Breaking this down more could result in items like:

- **Provision data store for persistent data**: in the event the source API goes down, or to maintain business continuity during deployments, the data could be copied rather than making live calls. Also, if searching/filtering is required that the API does not support a new data store may be required to achieve the faceting needed to support the UI.
- **Create the internal consumption of the API**: the core "back-end work" consuming the API and converting to the format needed.
- **Add tests**: add integration and unit tests for the underlying code.
- **Create outside-in monitoring**: if the source API becomes unavailable, it may be better to know through monitoring rather than being surprised when the application fails.

### Build the UI for the product catalog

Right off the bat, this _may_ need to be broken down further to detail an index page and a detail page separately. For simplicity sake, let's explore the front-end.

- **Add new UI components**: technically each new UI component (search bar, buttons, tile, etc.) could warrant its own work item, especially if working in a design system with its own complex workflow and requirements.
- **Create page(s)**: build the actual page leveraging sematic HTML and prebuilt UI elements.
- **Add UX tests**: depending on the complexity of the user interface, there may be a desire to validate the experience with UX tests that validate common user flows.
- **Add fallback scenarios**: in the event the API becomes unavailable or invalid inputs are received, does the UI degrade gracefully and display helpful messaging.

### Reviews

Reviews can be critical checkpoints along the feature development cycle, the first one being with the engineering team to verify the plan looks correct. Other checkpoints can be done with Subject Matter Experts (SMEs) or on smaller teams this may be done by the same person, but regardless it is important to take into account for various concepts prior to launch. Each of the concepts may be their own work item, meeting, or collection of items depending on the complexity of the project or team.

- **Responsive/cross-browser/performance testing**: as the author of the experience, do the due diligence of validating the experience across various screen sizes and browsers.
- **Accessibility**: does the UI meet accessibility guidelines and provide a consistent user experience regardless of how it's being consumed.
- **Analytics**: can the goals of the feature be tracked, or at least visits to understand usage.
- **Design review**: design sign-off of the experience and user experience.
- **Stakeholder review**: sign-off by the drivers/owners of the feature.
- **Localization**: depending on the turnaround time for localized content, this could impact the release date.

## Estimating

After seeing an entire project broken down, it's easy to see how a project can quickly grow. It also becomes easier to see how items become dependencies of one-another and how work could be load-balanced across the team.

Breaking it into the smallest, actionable parts allows for the estimate to be more granular and specific contributing the the larger feature/project estimate.

It is recommended to estimate in an abstract value, rather than something like "hours". Estimating in "hours" is very prescriptive as to how long an item should take. An engineer completing the task in more time that the original estimate may feel inadequate. Depending on historical knowledge or stage of career a certain task may be more challenging for one individual than another, so estimating in terms of "hours" doesn't make sense, especially when work items may be transferred within a team.

Using an abstract scale, like the fibonacci sequence based on complexity allows for the estimate to describe the item rather than the individual working on it.

Settle on a fairly simple, well understood unit of work that describes a number "2" -- this could be something like "adding a form field to an existing form", but should be specific to the type of work the team takes on. From there anything more complex grows to "3", "5", "8", "13", or "21" and anything simpler becomes a "1". This should allow most individuals on the same team to estimate work items similarly. This method can still be used when more religious estimating ceremonies are used. For a discrepancy, the focus becomes more about the complexity of an item, rather than why an individual may think the item is "easy".

## Planning

When planning work for an upcoming sprint, learn from the work of previous sprints. Because the estimation is abstract it is not as easy as saying "every developer has 32 hours". This is good because "every developer has 32 hours" is likely not accurate.

Planning across the team, rather that by individual, can account for the distractions and "bad days" an individual may have that could disrupt a sprint. Looking over a rolling 6 to 10 week period for an entire team can give a more realistic expectation of output.

Monitoring the previous 8 weeks to show that the team completes 50 units of work per week takes into account complexity of items, varying skill sets/career stages of the engineers, and can produce a more realistic, averaged estimate than tracking with other methods.
