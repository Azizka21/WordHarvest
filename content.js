chrome.runtime.onMessage.addListener(details => {
    if (details.type === "update-subtitles"){
        const rawVtt = details.subtitles.trim();
        const blocks = rawVtt.replace(/^WEBVTT.*?\n+/, '').split(/\r?\n\r?\n/);
        const parsedSubtitles = blocks.map(block => {
            const lines = block.split(/\r?\n/);
            const [start, end] = lines[0].split(' --> ');
            const startS = timeToSeconds(start)
            const endS = timeToSeconds(end)
            const content = document.createElement('div')
            lines.slice(1).forEach(line => {
                const words = line.split(' ')
                words.forEach(word => {
                    const wordSpan = document.createElement('span')
                    wordSpan.textContent = word
                    content.appendChild(wordSpan)
                    content.appendChild(document.createTextNode(' '));
                })
            })
            Object.assign(content.style, {
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
            return { start, end, startS, endS, content };
        })
        window.subtitles = parsedSubtitles
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
        video.parentNode.appendChild(currentSubtitleBlock.content);
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