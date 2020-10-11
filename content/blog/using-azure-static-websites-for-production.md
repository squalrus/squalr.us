---
title: Using Azure Static Websites for production
date: 2019-08-18T00:00:00+00:00
draft: true
---

This is a follow-up to my previous article [Cutting hosting costs by 99% with static websites on Azure](https://medium.com/@squalrus/cutting-hosting-costs-by-99-with-static-websites-on-azure-44483b6b2c3f) in which I describe the basics of setting up the feature as well as discuss the cost benefits. I realized there were a few configuration issues that needed to be solved for websites to be production ready.

## Create Azure Storage and enable "Static website"

Create a StorageV2 storage account to utilize the static website hosting. Enable "Static website" through the Azure portal UI.

![](/img/blog/using-azure-static-websites-for-production/0-storage-account.png)

## Create a CDN Profile and endpoint

Create the Premium Verizon CDN profile to utilize the rules engine feature. Then create the CDN endpoint, add the custom domain, and enable HTTPS.

![](/img/blog/using-azure-static-websites-for-production/1-cdn-endpoint.png)

> For a more detailed setup of the first two steps check out my previous article [Cutting hosting costs by 99% with static websites on Azure](https://medium.com/@squalrus/cutting-hosting-costs-by-99-with-static-websites-on-azure-44483b6b2c3f).

## Configure the CDN Rules Engine

After the initial setup of the Static Website, there are a few CDN rules to create to manage the URLs of your site in a production environment. The rules engine can be accessed with "Manage" within the CDN profile. In the CDN portal navigate to "HTTP Large" > "Rules Engine" to manage CDN rules.

![](/img/blog/using-azure-static-websites-for-production/2-manage-ui.png)

### Redirect HTTP to HTTPS

Why? Without redirecting to HTTPS the site will be navigable in HTTP and browsers will warn users the website is not secure. With this redirect in place, anyone that tried to browse the site in HTTP will be immediately redirected to the site in HTTPS.

To add the redirect create a new rule that matches on any HTTP request scheme and 301 redirects to the site with HTTPS protocol.

![](/img/blog/using-azure-static-websites-for-production/3-rule-https.png)

### Add HSTS header

Why? Similar to the Redirect HTTP to HTTPS rule, this will also enforce the secure HTTPS version of the site but will allow the browser to handle the redirect before even reaching the server.

To add the header create a new rule that enriches every request with `Strict-Transport-Security` set to `max-age=31536000`.

![](/img/blog/using-azure-static-websites-for-production/4-rule-hsts.png)

### Force trailing slash

Why? Maintaining consistency of the URL scheme by forcing a trailing slash will avoid duplicate SEO content. Search engines could index two URLs with the same content and negatively affect SEO of the site.

To add the redirect create a new rule that matches `/[a-zA-Z0–9_]+(?!/)$` URL Path Regex and 301 redirects to the same URL including the trailing slash `https://%{host}/$1/`.

> NOTE: the rules engine does not support advanced regex features like word shorthand `/w`.

![](/img/blog/using-azure-static-websites-for-production/5-rule-slash.png)

### Redirect to www

Why? If a site has a www subdomain and naked domain created, the naked domain should redirect to the www subdomain to avoid duplicate SEO content being indexed by search engines.

To add the redirect, both domains must be added as custom domains for the CDN endpoint. A rule can then be added that targets the naked edge CNAME and 301 redirects to the www subdomain.

![](/img/blog/using-azure-static-websites-for-production/6-rule-www.png)

> NOTE: updating rules can take up to several hours to propagate.

## Conclusion

Adding redirects and headers to maintain URL consistency and quality will improve SEO and prepare the site for production. Utilizing Azure Storage and static websites will keep cost down to pennies per month.
