chrome.webRequest.onCompleted.addListener(
    (details) => {
        console.log(details.url)
    },
    { urls: ["*://*/*.vtt"] });