const chai = require('chai');
let { expect } = chai;
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const path = require('path');

let scriptError = new Error('Could not run migration');

const requireContentfulMigration = (runMigrationFn, accessToken, spaceId, env) => {
  return proxyquire('../../lib/migrations', {
    'contentful-migration/built/bin/cli': {
      runMigration: runMigrationFn
    }
  })(accessToken, spaceId, env);
};

describe('Migrations', () => {
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(process, 'env').value({
      NODE_ENV: 'test',
      accessToken: 'thisiscontentfulaccesstoken',
      spaceId: '0123456',
      env: 'master'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should throw an error if a Contentful access token is not provided', async () => {
    let { spaceId, env } = process.env;

    expect(() => {
      requireContentfulMigration(sinon.spy(), '', spaceId, env);
    }).to.throw('Expected Contentful access token');
  });

  it('should throw an error if a Contentful space id is not provided', async () => {
    let { accessToken, env } = process.env;

    expect(() => {
      requireContentfulMigration(sinon.spy(), accessToken, '', env);
    }).to.throw('Expected Contentful space id');
  });

  it('should only include migration files starting from the current index', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationSpy = sinon.spy();
    let migration = requireContentfulMigration(runMigrationSpy, accessToken, spaceId, env);
    await migration.runMigration(2, './tests/fixtures/scripts/');

    let migrationCalledWith = runMigrationSpy.args[0];

    expect(runMigrationSpy.callCount).to.eq(1);
    expect(migrationCalledWith[0].filePath).to.eq(path.join(__dirname, '..', 'fixtures/scripts/002-add-slug-field.js'));
  });

  it('should execute migrations in order', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationSpy = sinon.spy();
    let migration = requireContentfulMigration(runMigrationSpy, accessToken, spaceId, env);
    await migration.runMigration(0, './tests/fixtures/scripts/');

    expect(runMigrationSpy.callCount).to.eq(3);

    expect(runMigrationSpy.args[0][0].filePath).to.eq(
      path.join(__dirname, '..', 'fixtures/scripts/000-create-page-content-type.js')
    );
    expect(runMigrationSpy.args[1][0].filePath).to.eq(
      path.join(__dirname, '..', 'fixtures/scripts/001-update-page-content-type.js')
    );
    expect(runMigrationSpy.args[2][0].filePath).to.eq(
      path.join(__dirname, '..', 'fixtures/scripts/002-add-slug-field.js')
    );
  });

  it('should return the position of the last successful migration', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationSpy = sinon.spy();
    let migration = requireContentfulMigration(runMigrationSpy, accessToken, spaceId, env);
    let finalPosition = await migration.runMigration(0, './tests/fixtures/scripts/');

    expect(finalPosition).to.eq(2);
  });

  it('should throw an error if the migration file is invalid', async () => {
    let { accessToken, spaceId, env } = process.env;

    let runMigrationStub = sinon.stub();
    runMigrationStub.onCall(2).rejects(scriptError);

    let migration = requireContentfulMigration(runMigrationStub, accessToken, spaceId, env);
    await migration.runMigration(2, './tests/fixtures/scripts/');

    // https://www.valentinog.com/blog/throw-async/
    await expect(migration.runMigration(1, './tests/fixtures/scripts/')).to.be.eventually.rejectedWith(scriptError);
  });

  it('should return the position of a failed update when an invalid update is encountered', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationStub = sinon.stub();
    runMigrationStub.onCall(1).rejects(scriptError);
    let migration = requireContentfulMigration(runMigrationStub, accessToken, spaceId, env);

    await expect(migration.runMigration(0, './tests/fixtures/scripts/'))
      .to.be.eventually.rejectedWith(scriptError)
      .and.have.property('failedPosition', 1);
  });

  it('should return the last valid update position when an invalid update is encountered', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationStub = sinon.stub();
    runMigrationStub.onCall(2).rejects(scriptError);
    let migration = requireContentfulMigration(runMigrationStub, accessToken, spaceId, env);

    await expect(migration.runMigration(0, './tests/fixtures/scripts/'))
      .to.be.eventually.rejectedWith(scriptError)
      .and.have.property('lastSuccessful', 1);
  });

  it('should return a last successful value of false when no successful updates were made', async () => {
    let { accessToken, spaceId, env } = process.env;
    let runMigrationStub = sinon.stub();
    runMigrationStub.onCall(0).rejects(scriptError);
    let migration = requireContentfulMigration(runMigrationStub, accessToken, spaceId, env);

    await expect(migration.runMigration(0, './tests/fixtures/scripts/'))
      .to.be.eventually.rejectedWith(scriptError)
      .and.have.property('lastSuccessful', false);
  });
});
