chrome.runtime.onMessage.addListener(details => {
    if (details.type === "update-subtitles"){
        window.subtitles = details.subtitles
    }
})
