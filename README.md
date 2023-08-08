# Launchpad CD

Tired of dealing with clunky UI, slow build servers, and time-consuming auth/build flows? Introducing Launchpad! 🎉 The VSCode Extension that enables one-click deployments via your Jenkins server.
## Features [WIP 🚧]
 - Start a new build from the Command Palete:
   1. CMD+P > Start a new build/deploy
   2. Input your parameters as defined in your `.launchpadrc.json`
   3. Magic

> Insert fancy gif here

## Requirements
 - Workspace must have git setup
 - VSCode Settings for `launchpad` (See below)
 - `.launchpadrc.json`

## Extension Settings
* `launchpad.jenkinsUsername`: Your Jenkins username
* `launchpad.jenkinsKey`: Your Jenkins API Key

## Known Issues
A lot

## Release Notes
### 0.1.0 [WIP]
 - Usable Release with a functional build/deploy command

### 0.0.1
 - Init API & basic config
 - Init commands & settings

---

## Following extension guidelines
* [I should probably read this... eventually](https://code.visualstudio.com/api/references/extension-guidelines)
