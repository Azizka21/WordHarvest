chrome.runtime.onMessage.addListener(details => {
    if (details.type === "change-subtitles-block") {
        const targetSpan = document.querySelector(
            'span[style="background-color:rgba(0,0,0,0.7);-webkit-box-decoration-break: clone;color:#ffffff;padding:5px 10px;border-radius:3px;margin:0 0;line-height:1.9;font-weight:400"]'
        );
        console.log(targetSpan);
        targetSpan.style.backgroundColor = 'green'
    }
});