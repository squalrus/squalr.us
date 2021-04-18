---
title: "A blog post about the blog you're reading this post on"
date: 2021-04-21T15:51:27-07:00
tags:
  - process
  - workflow
---

A few months ago I decided I wanted to do some blogging about technical challenges, process observations (and opinions), and some topics I would find valuable to have written down somewhere. I also find blogging cathartic as a means to get an idea, that could otherwise stay wedged, out of my head.

## The Web Developer's Blog Pitfall

As a web developer, it's _extremely_ difficult to resist the urge to build a blog site from scratch. "I do web development professionally, surely I can create a small blog website for myself. I mean, if I can't spin up a small blog website from scratch, am I _really_ a web developer?" Thoughts like this are a slippery slope. Sure I _can_, but **should** I?

I spent some time debating what I am actually trying to get out of the project -- do I want to flex the technical skills I've learned up to this point and build a site from scratch or do I want to focus on content? I chose the latter. Having the site up and running in a few hours allowed me to focus on writing posts. While the platform is established, there are still opportunities to tweak performance or even create a theme, if I'm so inclined.

## Getting My Fix

After looking at a few platforms, I ended up choosing [Hugo](https://gohugo.io/) -- it's blog-ready, has a lot of community built themes, and is simple. [Hugo's documentation](https://gohugo.io/documentation/) is extremely straightforward, there's a lot of [themes](https://themes.gohugo.io/), and with a few clicks [a Hugo site can be published on Azure](https://docs.microsoft.com/en-us/azure/static-web-apps/publish-hugo). Within a few hours I had a website deployed to https://squalr.us/ using the [m10c theme](https://themes.gohugo.io/hugo-theme-m10c/).

Now that the site is established and a few posts are added, I can get my engineering fix.

First, I ran the site through [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fsqualr.us%2F&tab=mobile) to identify any web performance issues, and found a small one related to Cumulative Layout Shift. I opened a [pull request](https://github.com/vaga/hugo-theme-m10c/pull/63) updating some CSS to fix an images' height.

![Cumulative Layout Shift at 0.282](/img/blog/a-blog-post-about-the-blog-youre-reading-this-post-on/cls-before.png)

Not only did this present an opportunity to do some web development, but I would argue it's more fulfilling than had I "built a site on my own". Contributing in this way allows me to collaborate and give back to a community, benefitting more than just my site. If yor looking for a straightforward, performant theme, I recommend [m10c](https://github.com/vaga/hugo-theme-m10c/) by [vaga](https://github.com/vaga).

Second, I ran the site through [WebPageTest](https://www.webpagetest.org/result/210410_BiDcJM_9828a9157e1bfb14a7a43820dd6dc018/) to learn that there are some opportunities to improve both security and caching, something that is not auto-solved out of the box with Hugo or Azure Static Web Apps.

![WebPageTest scores showing security score of 'B' and cache static content score of 'D'](/img/blog/a-blog-post-about-the-blog-youre-reading-this-post-on/web-page-test-before.png)

## Cache static content

My site was flagged for not having a very robust cache policy. Azure Static Web Apps supports adding cache headers via a `staticwebapp.config.json` file that can be included in the root of the deployed site. Adding this file to Hugo's `/static/` folder allowed me to configure the following for caching.

{{< gist squalrus 0ac98ffce73ca3e30958f3bea8246c4a >}}

## Security headers

The site was also flagged for missing security headers, specifically `x-frame-options` and a `content-security-policy`. Again, Azure Static Web Apps supports adding these security headers via a `staticwebapp.config.json` file.

### `X-Frame-Options`

> The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a `<frame>`, `<iframe>`, `<embed>` or `<object>`. Sites can use this to avoid click-jacking attacks, by ensuring that their content is not embedded into other sites.

Because I do not have any need for my personal site to be embedded, I set this to `DENY`.

### `Content-Security-Policy`

> Content Security Policy (CSP) is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement to distribution of malware.

Setting an accurate Content Security Policy can be done fairly easily by trial and error, in fact a "what if" style header can also be used that will not enforce the policy but any violation will be reported: `Content-Security-Policy-Report-Only`.

#### `default-src`

Value: `'self' https://squalr.us;`
Explained: States that content can come from the "self" or my production domain (needed for some staging environments my site runs on).

#### `script-src`

Value: `'self' https://www.google-analytics.com 'sha256-d8WoQSinwBfvQBSI1cIf68DLqh2eUwA1HYB0xu6gBsA=' https://platform.twitter.com https://gist.github.com;`
Explained: States that JavaScript may be executed from "self", Google Analytics, Twitter (embedded Tweet), GitHub (embedded Gist), and the sha256 value represents a hash of the snippet of inline Google Analytics JavaScript ([more on base64 hash policy source](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#sources)).

#### `style-src`

Value: `'self' https://squalr.us https://github.githubassets.com 'unsafe-inline';`
Explained: CSS can be loaded from the "self", my production domain (needed for some staging environments my site runs on), GitHub (embedded Gist), and `'unsafe-inline'`, should generally be avoided, but needed for a dynamic CSS snippet that is embedded.

#### `frame-src`

Value: `https://platform.twitter.com;`
Explained: Allows for an iframe to embed Twitter (embedded Tweet).

#### `connect-src`

Value: `https://www.google-analytics.com`
Explained: Restricts the URLs which can be loaded using script interface, limited to Google Analytics in this case.

{{< gist squalrus 5b060eacb55aec76b98fc6ae4fa05b86 >}}

After making these updates, I was able to bump up my scores for both security and caching. The remaining opportunities in caching are related to Google Analytics and the caching policy that they maintain for the JavaScript library.

![WebPageTest scores showing security score of 'A+' and cache static content score of 'B'](/img/blog/a-blog-post-about-the-blog-youre-reading-this-post-on/web-page-test-after.png)

## Conclusion

Hugo offered a great platform to spin up a blog in a few hours. Azure offers great, easy infrastructure and automation to host a blog. For anyone wanting to follow in my footsteps, I created the skeleton of my blog as a template repository: https://github.com/squalrus/hugo-on-azure.

If you have any suggestions or feedback on my approach, please reach out on Twitter [@chadschulz](https://twitter.com/chadschulz).
