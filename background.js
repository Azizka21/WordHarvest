chrome.webRequest.onCompleted.addListener(
    (details) => {
        chrome.tabs.sendMessage(details.tabId, {
            type: "update-subtitles",
            subtitles: details.url,
        })
    },
    { urls: ["*://*/*.vtt"] });

chrome.commands.onCommand.addListener(command => {
    if (command === "log-url") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, {type:"log-url"})
        });
    }
})