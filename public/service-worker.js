chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
      chrome.storage.local.set({ ON: true });
  }
});
