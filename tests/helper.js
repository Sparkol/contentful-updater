const sinon = require('sinon');
const validExtension = require('./fixtures/responses');

const createUiExtensionSpy = sinon.spy();
const getUiExtension = sinon.stub();

getUiExtension.onFirstCall().throws({
  message: JSON.stringify({
    status: 404
  })
});

getUiExtension.resolves(validExtension);

const getEnvironment = sinon.stub().resolves({
  getUiExtension,
  createUiExtensionWithId: createUiExtensionSpy
});
const getSpace = sinon.stub().resolves({ getEnvironment });

module.exports.contentfulStub = {
  createClient: () => ({ getSpace })
};

module.exports.createUiExtensionSpy = createUiExtensionSpy;
