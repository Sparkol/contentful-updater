const program = require('commander');
const run = require('./lib/cli');
let { ACCESS_TOKEN } = process.env;

program
  .requiredOption('-s, --space-id <id>', 'The Contentful space id')
  .option('-e, --environment-id <id>', 'The Contentful environment id (defaults to master)', 'master')
  .option('-f, --run-from <index>', 'The update position to run from (if omitted then the store will be used', false);

program.parse(process.argv);

try {
  run(ACCESS_TOKEN, program.spaceId, program.environmentId, program.runFrom);
} catch (err) {
  process.exit(-1);
}
