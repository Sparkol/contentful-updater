# Contentful Updater

## Overview

This commandline utility runs Contentful migration scripts as outlined in [the contentful migration repo](https://github.com/contentful/contentful-migration).

The scripts to be executed will be executed in order of file name, which should be sequential and three digits. e.g.:

```
000-init.js
001-create-settings-contenttype.js
002-update-settings-contenttype.js
...
```

On successful update, the tool will update a state store which is stored in Contentful as an extension.

## Installation

- `$ npm install -g Sparkol/contentful-updater`
- `$ nvm use`
- `$ npm link`

## Usage

- Generate a content management access token [see documentation](https://www.contentful.com/developers/docs/references/authentication/).
- `$ ACCESS_TOKEN=<your-token> contentful-update <options>`

### Commandline Options


| Option        | Decription    |
| ------------- | ------------- |
| `-s, --space-id <space-id>` | *REQUIRED* Spectify the Contentful space |
| `-f, --folder <folder-path>` | *REQUIRED* Path to the folder containing the scripts |
| `-e, --environment-id <environment-id>` | Specify the Contentful environment (default "master") |
| `-r, --run-from <index>` | Run from a specific index rather than using the state store |
