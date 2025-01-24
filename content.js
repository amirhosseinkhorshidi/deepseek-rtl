let rtlEnabled = false;

browser.storage.local.get(['rtlEnabled']).then(result => {
    rtlEnabled = result.rtlEnabled || false;
    updateRTL();
});

browser.runtime.onMessage.addListener((request) => {
    if (request.rtlEnabled !== undefined) {
        rtlEnabled = request.rtlEnabled;
        updateRTL();
    }
});

function updateRTL() {
    if (rtlEnabled) {
        document.body.classList.add('rtl-enabled');
        
        // Apply RTL to all text elements
        const elements = document.querySelectorAll(`
            .ds-markdown--block,
            .f9bf7997.c05b5566,
            .f9bf7997:nth-child(3) > div:nth-child(2),
            [role="textbox"],
            [contenteditable="true"],
            textarea
        `);

        elements.forEach(el => {
            if (!el.classList.contains('rtl-applied') && 
                !el.tagName.toLowerCase().match(/^(code|pre)$/)) {
                el.classList.add('rtl-applied');
            }
        });
    } else {
        document.body.classList.remove('rtl-enabled');
        document.querySelectorAll('.rtl-applied').forEach(el => {
            el.classList.remove('rtl-applied');
        });
    }
}

const observer = new MutationObserver(_.throttle(() => {
    if (rtlEnabled) {
        updateRTL();
    }
}, 100));

observer.observe(document.body, {
    childList: true,
    subtree: true
});

document.addEventListener('DOMContentLoaded', updateRTL);
window.addEventListener('load', updateRTL);