chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'.
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite.
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state.
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });

    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on.
      await chrome.scripting.insertCSS({
        files: ["style.css"],
        target: { tabId: tab.id },
      });
      // Execute the script when the user turns the extension on.
      await chrome.scripting.executeScript({
        target : { tabId : tab.id },
        files : [ "remarklet.iife.js" ],
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off.
      await chrome.scripting.removeCSS({
        files: ["style.css"],
        target: { tabId: tab.id },
      });
    }
});
