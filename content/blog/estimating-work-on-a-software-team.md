---
title: Estimating work on a software team
date: 2021-02-25T00:00:00+00:00
tags:
  - process
  - workflow
---

How long is this going to take?

Estimating work is difficult. Properly estimating work is work. When working on a team with many stakeholders, accurate estimates provide valuable data to decision makers. The estimate can contribute to a features priority and help plan the roadmap for a team.

From the engineering side, it can be difficult to resist the desire to start coding. It may feel counter-intuitive, but pausing to establish a plan can be invaluable.

<!--more-->

## Why break it down

Breaking down the work gives the engineering team a realistic view into scope as well as the potential for load-balancing work across the team. For folks outside the team, this information _could_ play into the priority of the feature (if complexity is a consideration) as well as be valuable input to understand how a feature fits in among other projects when building a roadmap.

## Breaking it down

As an example, trying to guestimate an entire feature called "Build new product catalog page with filtering" is very difficult. Without properly planning out the work, some important checkpoints or details could be easy overlooked.

Exploring the details of the feature will likely determine that the large featured may benefit from being broken down into smaller features:

- [Integrate with an API to receive the data](#integrate-with-an-api-to-receive-the-data)
- [Build the UI for the product catalog](#build-the-ui-for-the-product-catalog)
- [Reviews](#reviews)

Even at this level it becomes clear there could be more than originally thought.

### Integrate with an API to receive the data

Exploring this requirement will raise questions around data format, resiliency, and latency. Breaking this down more could result in items like:

- **Provision data store for persistent data**: in the event the source API goes down, or to maintain business continuity during deployments, the data could be cached rather than making live calls. Also, if searching/filtering is required that the API does not support a new data store may be required to achieve the faceting needed to support the UI.
- **Create the internal consumption of the API**: the core "back-end work" consuming the API and converting to the format needed to render the UI.
- **Add tests**: add integration and unit tests for the underlying code.
- **Create outside-in monitoring**: if the source API becomes unavailable, it may be better to know through monitoring rather than being surprised when the application fails.

### Build the UI for the product catalog

Right off the bat, this _may_ need to be broken down further to an index page and a detail page separately. For simplicity sake, let's explore the front-end as a single unit of work:

- **Add new UI components**: technically each new UI component (search bar, buttons, tile, etc.) could warrant its own work item, especially if working in a design system with its own workflow, requirements, and delivery method.
- **Create page(s)**: build the actual page with sematic HTML and pre-built UI components.
- **Add UX tests**: depending on the complexity of the user interface, there may be a desire to validate the experience with UX tests that simulate common user flows.
- **Add fallback scenarios**: in the event the API becomes unavailable or invalid inputs are received, the UI should degrade gracefully and display helpful messaging.

### Reviews

Reviews can be critical checkpoints throughout the development cycle, the first one being with the engineering team to verify the plan looks correct. Checkpoints can be done with Subject Matter Experts (SMEs) or on smaller teams this may be done by the author or team lead. The entire list could be a single "launch checklist", each review item may be its own work item, or a single review could result in a collection of work items. The level of detail will depend on the complexity of the project, team, and engineering fundamentals.

- **Responsive/cross-browser/performance testing**: as the author of the experience, do the due diligence of validating the experience across various screen sizes and browsers.
- **Accessibility**: ensure the UI meets accessibility requirements and provides a consistent user experience regardless of how it's being consumed.
- **Analytics**: verify the goals of the feature can be tracked, or at least page visits are captured to understand usage.
- **Design review**: design sign-off of the experience and user experience.
- **Stakeholder review**: sign-off by the stakeholders/owners of the feature.
- **Localization**: if the feature requires localization support, take into account the time it takes to get the content translated, testing in the various languages, and verifying the UI in a RTL language, if applicable.

## Estimating

After breaking down an entire project, it's easy to see how a project quickly grows. It also becomes easier to see how items become dependencies of one another and how work could be load-balanced across the team.

Breaking it into the smallest, actionable pieces allows for the estimate to be more granular and specific, which contributes the the larger feature/project estimate.

Estimate in an abstract value rather than something tangible like "hours". Estimating in "hours" is very prescriptive as to how long an item should take. An engineer completing the task in more time that the original estimate may feel like they are underperforming when it may be due to historical knowledge or career stage. A certain task may be more challenging for one individual than another, so estimating in terms of "hours" doesn't make sense, especially when work items may be transferred within a team.

Using an abstract scale, like the fibonacci sequence based on complexity, allows for the estimate to describe the **item** rather than the **individual** working on it.

Settle on a fairly simple, well understood unit of work that describes a "2" -- this could be something like "adding a form field to an existing form", but should be specific to the type of work the team takes on. From there, anything more complex becomes a "3", "5", "8", "13", or "21" and anything simpler is a "1". This should allow most individuals on the team to estimate work items similarly. This scale can also be used for estimating ceremonies, like [planning poker](https://en.wikipedia.org/wiki/Planning_poker), and for a discrepancy, the focus becomes more about the complexity of an item, rather than why an individual may think the item is "easy".

## Planning

When planning work for an upcoming sprint, learn from the previous sprints. Because the estimation is abstract it is not as easy as saying "every developer has 32 hours". However, this is good because "every developer has 32 hours" is likely not accurate.

Planning across the team (rather that by individual) can account for the distractions and "bad days" an individual may have that could disrupt a sprint. Looking over a rolling 6 to 10 week period for an entire team can give a more realistic expectation of output.

Monitoring the previous 8 weeks to show that the team completes 50 units of work per week takes into account complexity of items, varying skill sets/career stages of the engineers, and can produce a more realistic, averaged estimate than tracking with other methods.
