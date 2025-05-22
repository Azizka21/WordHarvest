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
                    const startS = timeToSeconds(start)
                    const endS = timeToSeconds(end)
                    const text = lines.slice(1).join('\n');
                    return { start, end, startS, endS, text };
                });
                window.subtitles = parsedSubtitles
            })
    }
    if (details.type === "log-url") {
        const video = document.querySelector('video');
        video.pause();
        const time = video.currentTime;
        const currentSubtitleBlock = window.subtitles.find(block => time >= block.startS && time <= block.endS)
        console.log(currentSubtitleBlock ? currentSubtitleBlock.text : "")
    }
})

function timeToSeconds(rawTime) {
    const cleaned = rawTime.trim().replace(/\s+/g, '');
    const [h, m, sRest] = cleaned.split(':');
    if (!sRest) return null;
    let s = '0', ms = '0';
    if (sRest.includes('.')) {
        [s, ms] = sRest.split('.');
    } else {
        s = sRest;
    }
    return (Number(h) * 3600 + Number(m) * 60 + Number(s)) + (Number(ms) / 1000)
}
