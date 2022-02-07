# VC Sessions

![License](https://img.shields.io/github/license/zS1L3NT/ts-discord-vcsessions?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/ts-discord-vcsessions?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/ts-discord-vcsessions?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/ts-discord-vcsessions?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/ts-discord-vcsessions?style=for-the-badge)

VC Sessions is a Discord Bot meant to create a new Voice Channel (VC) every single time a user joins the Session Creator Channel (SCC). This SCC should be named something like `New Session`. When a user joins `New Session`, a new VC will be generated and the user will be moved to the new VC. The new VC is called a Session and each Session will be automatically cleared when unused.

VC Sessions is built upon [Nova Bot](https://github.com/zS1L3NT/ts-npm-nova-bot), my Discord bot framework. This bot has been shut down due to it's low user usage.

## Features

-   Unique Session names
    -   Every time a new Session is created, if a VC with the name of `➤ 1` doesn't exist, VC Sessions will create a new Session with `➤ 1` as it's name
    -   If a voice channel with the name of `➤ 1` exists, `➤ 2` will be created
-   Prevent spam creation of VCs
    -   Whenever a user joins the SCC, VC Sessions will check if there are any empty Sessions in the server that are waiting to be destroyed. If there are, VC Sessions will not create a new VC but instead move the user into the existing Session.
-   Discord Commands (Interactions)
    -   Admin
        -   `/set session-creator-channel` - Designates an existing voice channel to be the SCC.
        -   `/set timeout` - Sets the timeout for how long VC Sessions will wait before destroying a Session after all users leave

## Usage

Copy the `config.example.json` file to `config.json` then fill in the json file with the correct project credentials.

With `yarn`

```
$ yarn
$ yarn dev
```

With `npm`

```
$ npm i
$ npm run dev
```

## Built with

-   TypeScript
    -   [![@types/node](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/dev/@types/node?style=flat-square)](https://npmjs.com/package/@types/node)
    -   [![typescript](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/dev/typescript?style=flat-square)](https://npmjs.com/package/typescript)
-   DiscordJS
    -   [![discord.js](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/discord.js?style=flat-square)](https://npmjs.com/package/discord.js)
-   Miscellaneous
    -   [![colors](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/colors?style=flat-square)](https://npmjs.com/package/colors)
    -   [![nova-bot](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/nova-bot?style=flat-square)](https://npmjs.com/package/nova-bot)
    -   [![tracer](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-vcsessions/tracer?style=flat-square)](https://npmjs.com/package/tracer)
