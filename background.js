const timeout = 15 * 60 * 1000 // ms
let lastActive = {}
let timers = {}

chrome.tabs.onActivated.addListener((event) => {
    console.log(`Tab activated: ${event.windowId}:${event.tabId}`)
    console.log(`Disabling idle timer for: ${event.windowId}:${event.tabId}`)
    // TODO
    if (timers[event.windowId] && timers[event.windowId][event.tabId]) {
        clearTimeout(timers[event.windowId][event.tabId])
    }
    if (lastActive[event.windowId]) {
        console.log(`Starting the idle timer for last active tab: ${event.windowId}:${lastActive[event.windowId]}`)
        if (!timers[event.windowId]) {
            timers[event.windowId] = {}
        }
        timers[event.windowId][event.tabId] = setTimeout(((tabId) => {
            // using a closure to capture the event.tabId in the callback
            return () => {
                console.log(`Moving the tab to the end: ${tabId}`)
                chrome.tabs.move(tabId, { index: -1 })
            }
        })(lastActive[event.windowId]), timeout)
    }
    console.log(`Setting the last active tab to: ${event.windowId}: ${event.tabId}`)
    lastActive[event.windowId] = event.tabId
})
