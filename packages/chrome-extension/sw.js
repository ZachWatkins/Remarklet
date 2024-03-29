// chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
//   if (url !== 'https://example.com/#inject-programmatic') return;
//   const { options } = await chrome.storage.local.get('options');
//   chrome.scripting.executeScript({
//     target: { tabId },
//     files: ['content-script.js'],
//     ...options
//   });
// });

// chrome.runtime.onMessage.addListener(async ({ name, options }) => {
//   if (name === 'inject-programmatic') {
//     await chrome.storage.local.set({ options });
//     await chrome.tabs.create({
//       url: 'https://example.com/#inject-programmatic'
//     });
//   }
// });
chrome.runtime.onMessage.addListener(async ({ name, options }) => {
    const activeTab = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (name === 'inject-programmatic') {
        chrome.scripting.executeScript({
            target: { tabId: activeTab[0].id },
            files: ['content-script.js'],
            ...options,
        });
    }
});
