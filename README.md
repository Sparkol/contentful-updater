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

- Clone the reop
- `$ npm link`

## Usage

- Generate a content management access token [see documentation](https://www.contentful.com/developers/docs/references/authentication/).
- $ `ACCESS_TOKEN=<your-token> migration-contentful <options>`

### Commandline Options


| Option        | Decription    |
| ------------- | ------------- |
| `-s, --space-id <space-id>` | Spectify the Contentful space |
| `-e, --environment-id <environment-id>` | Specify the Contentful environment (default "master") |
| `-f, --run-from <index>` | Run from a specific index rather than using the state store |
