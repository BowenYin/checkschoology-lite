var ignore = false;
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({url: "https://schoology.harker.org/calendar"});
});
chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: "https://schoology.harker.org/calendar"});
});
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (ignore || !/.*:\/\/(schoology\.harker\.org|athena\.harker\.org|app\.schoology\.com)\/calendar\/.+\/.+/.test(details.url) || details.method !== "GET") {
      ignore = false;
      return;
    }
    ignore = true;
    chrome.tabs.sendMessage(details.tabId, details.url);
  },
  {
    urls: [
      "*://schoology.harker.org/calendar/*",
      "*://athena.harker.org/calendar/*",
      "*://app.schoology.com/calendar/*",
    ],
    types: ["xmlhttprequest"]
  }
);