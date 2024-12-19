chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'createImage',
        title: 'Create Image from Selected Text',
        contexts: ['selection']
    })
})

chrome.contextMenus.onClicked.addListener(async info => {
    if (info.menuItemId === 'createImage') {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        })
        chrome.tabs.sendMessage(tab.id || 0, { text: info.selectionText })
    }
})
