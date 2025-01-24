document.addEventListener('DOMContentLoaded', async function() {
    const toggle = document.getElementById('rtlToggle');
    
    // Load saved state
    browser.storage.local.get(['rtlEnabled']).then(result => {
        toggle.checked = result.rtlEnabled || false;
    });
    
    // Handle toggle changes
    toggle.addEventListener('change', async function() {
        // Save state
        await browser.storage.local.set({ rtlEnabled: toggle.checked });
        
        try {
            // Get all tabs that match our URL pattern
            const tabs = await browser.tabs.query({
                url: "*://chat.deepseek.com/*"
            });
            
            // Send message to each matching tab
            for (const tab of tabs) {
                try {
                    await browser.tabs.sendMessage(tab.id, {
                        rtlEnabled: toggle.checked
                    });
                } catch (err) {
                    console.log(`Could not send message to tab ${tab.id}:`, err);
                }
            }
        } catch (err) {
            console.log('Error while handling toggle:', err);
        }
    });
});