# Collectors Hideout Backoffice

 Collectors Hideout Backoffice is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and developed as a college project for LDS.

# Table of Contents:
* [Overview](#overview)
* [Build Project](#build-project)
* [Run Project](#run-project)
* [Test Project](#test-project)
* [Build Project as Docker Image](#building-as-docker-image)
* [Quick Start](#quick-start)
* [Backoffice Configuration](#chatbot-configuration)

# Overview

This project contains a backoffice environment built with [Next.js](https://nextjs.org/) to help manage Collectors Hideout bussiness website. This backoffice contains 6 pages:

* **Proposals:** Manages auction proposals made by costumers.

* **Users:** Manages relevant information about the users of the website.

* **Auctions:** Manages aproved auction proposals made by both costumers and authorized staff.

* **Collectables:** Manages collectables information create by authorized staff only.

* **Publications:** Manages publications made by both costumers and authorized staff.

* **Orders:** Manages orders information made by costumers.

# Build Project

To build project, run one of the following commands:    

```bash
npm run build
# or
yarn build
# or
pnpm build
```
# Run Project

To run project, run one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

# Test Project

To test project, run one of the following commands:

```bash
npm run test
# or
yarn test
# or
pnpm test
```

# Running as docker container

To build as docker image and start container, run the following commands from within the project folder:

```bash
docker build --file ./Dockerfile --tag collectors_hideout_backoffice:v1 .

docker run `
    --publish 3800:3000 `
    --env-file .env `
    --env-file .env.docker `
    --name collectors_hideout_backoffice `
    --detach `
    collectors_hideout_backoffice:v1

```

**Note:** All environment variables can be found in .env.docker file.

# Collectors Hideout Configuration

Before running the project, the backoffice can be configurated through the .env files.