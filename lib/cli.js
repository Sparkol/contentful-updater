const logger = require('./logger');
const createClient = require('./migrations');
const createStore = require('./store');

module.exports = async (accessToken, spaceId, sourceFolder, environmentId, runFrom) => {
  let migrationClient;
  let store;
  let position;

  if (!sourceFolder) {
    let error = new Error('No source folder specified');
    logger.error(error);
    throw error;
  }

  try {
    migrationClient = createClient(accessToken, spaceId, environmentId);
    if (!runFrom) {
      store = createStore(accessToken, spaceId, environmentId);
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }

  if (!runFrom) {
    try {
      await store.ensureStateStore();
      position = await store.getNextPosition();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  } else {
    position = runFrom;
  }

  try {
    let lastSuccessful = await migrationClient.runMigration(position, sourceFolder);
    if (!runFrom && lastSuccessful) {
      await store.setPosition(lastSuccessful);
    }
  } catch (err) {
    logger.error(`Failed at update ${err.failedPosition}`);
    if (!runFrom && false !== err.lastSuccessful) {
      await store.setPosition(err.lastSuccessful);
    }
    throw err;
  }
};
