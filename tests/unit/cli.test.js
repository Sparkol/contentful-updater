const chai = require('chai');
let { expect } = chai;
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const path = require('path');

let cli;

let ensureStateStoreSpy = sinon.spy();
let getPositionSpy = sinon.spy();
let setPositionSpy = sinon.spy();
let runMigrationSpy = sinon.spy();
let getNextPositionSpy = sinon.spy();

const runMigrationMock = () => {
  return Promise.resolve(1);
};

const getCliFunction = (runMigrationFunction = runMigrationSpy) => {
  return proxyquire('../../lib/cli', {
    './store': () => {
      return {
        ensureStateStore: ensureStateStoreSpy,
        getPosition: getPositionSpy,
        getNextPosition: getNextPositionSpy,
        setPosition: setPositionSpy
      };
    },
    './migrations': () => {
      return {
        runMigration: runMigrationFunction
      };
    }
  });
};

describe('CLI', () => {
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

  it('should not use a store if a `runFrom` option has been specified', async () => {
    let { accessToken, spaceId, environmentId } = process.env;
    cli = getCliFunction();
    await cli(accessToken, spaceId, './', environmentId, 1);

    expect(ensureStateStoreSpy.called).to.be.false;
    expect(getPositionSpy.called).to.be.false;
    expect(setPositionSpy.called).to.be.false;
  });

  it('should use a store if a `runFrom` option has not been specified', async () => {
    let { accessToken, spaceId, environmentId } = process.env;
    cli = getCliFunction(runMigrationMock);
    await cli(accessToken, spaceId, './', environmentId);

    expect(ensureStateStoreSpy.called).to.be.true;
    expect(getNextPositionSpy.called).to.be.true;
    expect(setPositionSpy.called).to.be.true;
  });

  it('should run a migration', async () => {
    let { accessToken, spaceId, environmentId } = process.env;
    cli = getCliFunction();
    await cli(accessToken, spaceId, './', environmentId);
    expect(runMigrationSpy.called).to.be.true;
  });

  it('should update the store after a successful migration', async () => {
    let { accessToken, spaceId, environmentId } = process.env;
    cli = getCliFunction(runMigrationMock);
    await cli(accessToken, spaceId, './', environmentId);
    expect(setPositionSpy.called).to.be.true;
  });
});
