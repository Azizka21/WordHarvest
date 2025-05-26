chrome.webRequest.onCompleted.addListener(
    async (details) => {
        if (details.initiator && details.initiator.startsWith('chrome-extension://')) {
            return;
        }
        const response = await fetch(details.url);
        const text = await response.text();
        chrome.tabs.sendMessage(details.tabId, {
            type: "update-subtitles",
            subtitles: text,
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