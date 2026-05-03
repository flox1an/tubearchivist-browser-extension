export function createServices(browserType) {
  function storageGet(keys) {
    return new Promise(resolve => {
      browserType.storage.local.get(keys, result => resolve(result));
    });
  }

  function storageSet(values) {
    return new Promise((resolve, reject) => {
      browserType.storage.local.set(values, () => {
        if (browserType.runtime.lastError) {
          reject(browserType.runtime.lastError);
          return;
        }
        resolve();
      });
    });
  }

  async function sendMessage(message) {
    let { success, value } = await browserType.runtime.sendMessage(message);
    if (!success) {
      throw value;
    }
    return value;
  }

  return {
    storageGet,
    storageSet,
    sendMessage,
  };
}

