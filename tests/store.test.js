const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const { contentfulStub, createUiExtensionSpy } = require('./helper');

let sandbox;
let store;

describe('State store', () => {
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(process, 'env').value({
      accessToken: 'thisiscontentfulaccesstoken',
      spaceId: '0123456',
      NODE_ENV: 'test'
    });

    let { accessToken, spaceId, env } = process.env;
    store = await proxyquire('../lib/store', {
      'contentful-management': contentfulStub
    })(accessToken, spaceId, env);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a state store extension in Contentful if one is not present', async () => {
    await store.ensureStateStore();
    expect(createUiExtensionSpy.called).to.be.true;
  });

  it('should not create a state store extension in contentful if one is already present', async () => {
    await store.ensureStateStore();
    await store.ensureStateStore();
    expect(createUiExtensionSpy.calledOnce).to.be.true;
  });

  it('should return an update position of 0 after inital creation', async () => {
    await store.ensureStateStore();
    let position = await store.getPosition();
    //console.log('out', position);
    expect(position).to.eq(0);
  });

  it('should update the position', async () => {
    await store.ensureStateStore();
    await store.setPosition(5);
    let position = await store.getPosition();
    expect(position).to.eq(5);
  });
});
