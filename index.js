//const { runMigration } = require('contentful-migration/built/bin/cli');
let { ACCESS_TOKEN, SPACE_ID, ENV } = process.env;
const migrationClient = require('./lib/migrations')(ACCESS_TOKEN, SPACE_ID, ENV);
const logger = require('./lib/logger');

const { ensureStateStore, getPosition, setPosition } = require('./lib/store')(ACCESS_TOKEN, SPACE_ID, ENV);

const go = async () => {
  try {
    await ensureStateStore();
    let position = await getPosition();
    await migrationClient.runMigration(position, './tests/fixtures/scripts/');
  } catch (err) {
    logger.error(err.failedPosition);
    process.exit(-1);
  }
};

go();

//createStateStore();
