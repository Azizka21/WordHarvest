chrome.runtime.onMessage.addListener(details => {
    if (details.type === "update-subtitles"){
        fetch(details.subtitles)
            .then(response => {
                if (!response.ok) throw new Error('Сервер вернул ошибку');
                return response.text()
            })
            .then(response => {
                window.subtitles = response
            })
        window.subtitles = details.subtitles
    }
    if (details.type === "log-url") {
        console.log(window.subtitles)
    }
})
