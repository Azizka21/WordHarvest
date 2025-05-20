const buffer = new Map()

chrome.webRequest.onCompleted.addListener(
    (details) => {
        chrome.tabs.sendMessage(details.tabId, {
            type: "update-subtitles",
            subtitles: details.url,
        })
    },
    { urls: ["*://*/*.vtt"] });