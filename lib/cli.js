const logger = require('./logger');
const createClient = require('./migrations');
const createStore = require('./store');

module.exports = async (accessToken, spaceId, environmentId, runFrom) => {
  let migrationClient;
  let store;
  let position;

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
      position = await store.getPosition();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  } else {
    position = runFrom;
  }

  try {
    let lastSuccessful = await migrationClient.runMigration(position, './tests/fixtures/scripts/');

    if (!runFrom) {
      await store.setPosition(lastSuccessful);
    }
  } catch (err) {
    logger.error(`Failed at update ${err.failedPosition}`);
    if (!runFrom) {
      await store.setPosition(err.lastSuccessful);
    }
    throw err;
  }
};
