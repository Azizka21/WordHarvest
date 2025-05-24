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
        let currentSubtitleBlock
        for (let block of window.subtitles) {
            if (block.startS > time) {
                break
            }
            currentSubtitleBlock = block
        }
        const subtitleDiv = document.createElement('div');
        Object.assign(subtitleDiv.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '3px',
            lineHeight: '1.9',
            fontWeight: '400',
            zIndex: '999999',
            fontFamily: 'sans-serif',
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
            margin: '0'
        });
        subtitleDiv.innerHTML = currentSubtitleBlock.text
        video.parentNode.appendChild(subtitleDiv);
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
