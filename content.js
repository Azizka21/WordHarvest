chrome.runtime.onMessage.addListener(details => {
    if (details.type === "update-subtitles"){
        fetch(details.subtitles)
            .then(response => {
                if (!response.ok) throw new Error('Сервер вернул ошибку');
                return response.text()
            })
            .then(response => {
                const rawVtt = response.trim();
                const blocks = rawVtt.replace(/^WEBVTT.*?\n+/, '').split(/\r?\n\r?\n/);
                const parsedSubtitles = blocks.map(block => {
                    const lines = block.split(/\r?\n/);
                    const [start, end] = lines[0].split(' --> ');
                    const text = lines.slice(1).join('\n');
                    return { start, end, text };
                });
                window.subtitles = parsedSubtitles
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
