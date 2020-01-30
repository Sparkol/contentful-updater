const logger = require('./logger');
const glob = require('glob-promise');
const path = require('path');

const migrationClient = require('contentful-migration/built/bin/cli');

const getPositionFromFilename = filename => {
  let prefix = filename.match(/[0-9]{3}/);
  if (!prefix) {
    return false;
  }
  return parseInt(prefix[0]);
};

const getMigrationFiles = async (fromPosition, sourceDir) => {
  logger.verbose(`Looking for migration scripts in ${sourceDir}`);

  let files = await glob(path.join(sourceDir, '**/*.js'));

  files = files.filter(file => {
    let position = getPositionFromFilename(file);
    return position >= fromPosition;
  });

  return files;
};

module.exports = (accessToken, spaceId, environmentId = 'master') => {
  if (!accessToken) {
    throw new Error('Expected Contentful access token');
  }

  if (!spaceId) {
    throw new Error('Expected Contentful space id');
  }

  const runMigration = async (fromPosition, sourceDir) => {
    const options = {
      spaceId,
      accessToken,
      environmentId,
      yes: true
    };

    logger.info(`Running migration from ${fromPosition}`);

    let files = await getMigrationFiles(fromPosition, sourceDir);
    let currentPosition = false;
    let lastSuccessful = false;

    try {
      for await (filePath of files) {
        filePath = path.join(process.cwd(), filePath);
        logger.info(`Running migration in ${filePath}`);
        currentPosition = getPositionFromFilename(filePath);
        await migrationClient.runMigration({ ...options, ...{ filePath } });
        lastSuccessful = currentPosition;
      }
    } catch (err) {
      err.failedPosition = currentPosition;
      err.lastSuccessful = lastSuccessful;
      throw err;
    }

    return lastSuccessful;
  };

  return {
    runMigration
  };
};
