const contentful = require('contentful-management');
const extensionId = 'contentful-management-update-state-store';
const logger = require('./logger');

const getConnection = (accessToken, spaceId, env) => {
  let client = contentful.createClient({
    accessToken
  });

  return client.getSpace(spaceId).then(space => space.getEnvironment(env));
};

module.exports = (accessToken, spaceId, env = 'master') => {
  if (!accessToken) {
    throw new TypeError('Expected Contentful access token');
  }

  if (!spaceId) {
    throw new TypeError('Expected Contentful space id');
  }

  const client = getConnection(accessToken, spaceId, env);

  const checkStateStore = async () => {
    return client
      .then(environment => environment.getUiExtension(extensionId))
      .then(() => {
        return true;
      })
      .catch(err => {
        let error = JSON.parse(err.message);
        switch (error.status) {
          case 404:
            return false;
          default:
            throw err;
        }
      });
  };

  const createStateStore = async () => {
    return client
      .then(environment =>
        environment.createUiExtensionWithId(extensionId, {
          extension: {
            name: 'Update state store',
            srcdoc: '-1',
            fieldTypes: [],
            sidebar: false
          }
        })
      )
      .catch(logger.error);
  };

  const getPosition = async () => {
    return client
      .then(environment => environment.getUiExtension(extensionId))
      .then(uiExtension => {
        return parseInt(uiExtension.extension.srcdoc);
      })
      .catch(err => {
        let error = JSON.parse(err.message);
        switch (error.status) {
          case 404:
            return false;
          default:
            throw err;
        }
      });
  };

  const getNextPosition = async () => {
    let currentPosition = await getPosition();
    return currentPosition + 1;
  };

  const setPosition = async position => {
    return client
      .then(environment => environment.getUiExtension(extensionId))
      .then(uiExtension => {
        uiExtension.extension.srcdoc = position.toString();
        return uiExtension.update();
      })
      .then(() => logger.info(`Store set to position ${position}`))
      .catch(logger.error);
  };

  const ensureStateStore = async () => {
    let hasStateStore;

    try {
      hasStateStore = await checkStateStore();
    } catch (err) {
      throw err;
    }

    if (hasStateStore) {
      logger.verbose('Store exists nothing to do');
      // nothing to do
      return;
    }

    // create the store
    await createStateStore();

    return;
  };

  return {
    ensureStateStore,
    getPosition,
    setPosition,
    getNextPosition
  };
};
