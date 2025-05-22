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
    }
    if (details.type === "log-url") {
        const video = document.querySelector('video');
        video.pause();
        const time = video.currentTime;
        console.log(time)
        console.log(window.subtitles)
    }
})
