---
title: "Deploying an 11ty Site to Azure Static Web Apps"
date: 2021-05-13T20:27:15-07:00
---

I am a huge fan of two things: [Azure](https://azure.microsoft.com/en-us/) and [static site generators](https://jamstack.org/generators/). I am super excited Azure now has an easy-to-use, free offering for deploying small hobby websites. Historically hosing a small site on Azure cost about $50/mo (to get SSL support), then through Azure Storage Static Web hosting the cost went down to pennies but was [complex to configure](/2018/07/cutting-hosting-costs-by-99-with-static-websites-on-azure/). Now Azure offers [Azure Static Web Apps](https://azure.microsoft.com/en-us/services/app-service/static/) (generally available as of 05/12/2021) which makes hosting a breeze for a static site.

Azure offers the [Azure Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli) and [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) to help with development, or you can leverage the trusty Azure Portal to provision the Web App.

## Setup

From the Azure Portal [Create an new Static Web App](https://portal.azure.com/#create/Microsoft.StaticApp). Configure the Subscription, Resource Group, Web App Name, and Region that best fits your site's needs.

![](/img/blog/deploying-an-11ty-site-to-azure-static-web-apps/1-new-static-web-app.png)

After authenticating with GitHub (and grant permission), choose the Organization, Repository, and Branch to be used for the production deployment of the site. For Build Details, chose "Custom" (Azure does not currently offer an 11ty preset), keep App location set to "/", and update Output location to be "_site" (the default output directory for 11ty). _Note: the Build Details values can be updated later if needed._

![](/img/blog/deploying-an-11ty-site-to-azure-static-web-apps/2-github-authentication.png)

The previous step will add a GitHub Action YAML file to the repository in the `.github/workflows/` folder, something like `azure-static-web-apps-lively-forest-064040d1e.yml`. This file handles the CI/CD for both production _and_ pull requests deployments.

The GitHub Action YAML needs to be modified slightly to build the 11ty site. Add a "build" script to `package.json` and add it as the build command in the GitHub Action YAML as `app_build_command: "npm run build"` ([example](https://github.com/squalrus/11ty-demo/blob/96be3e0e749661ee3885d21e367b1e6ffa18cd5f/.github/workflows/azure-static-web-apps-lively-forest-064040d1e.yml#L28)).

```
// package.json
"scripts": {
    "build": "eleventy"
}
```

```
// .github/workflows/azure-static-web-apps-*.yml
app_build_command: "npm run build"
```

The production GitHub Action will kick off immediately and deploy the site to a domain with a name similar to the generated name + identifier used for the YAML file, like https://lively-forest-064040d1e.azurestaticapps.net/. Any pull request created will automatically be deployed to `https://lively-forest-064040d1e-{pr-number}.azurestaticapps.net/` (where `{pr-number}` is the number of the GitHub pull request) for testing and verification. When a pull request is merged, the GitHub Action will run to remove the temporary environment and deploy the latest in `main` to the production environment. The free tier of Azure Static Web Apps offers up to 3 pre-production environments.

Finally, add your custom domain by adding a `CNAME` or `TXT` record through your DNS provider to validate the domain ownership.

![](/img/blog/deploying-an-11ty-site-to-azure-static-web-apps/3-custom-domain.png)

## Resources & Further Reading

- [API support in Azure Static Web Apps with Azure Functions](https://docs.microsoft.com/en-us/azure/static-web-apps/apis)
- [Authentication and authorization for Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)
