let lastActive = {}
let moveInactiveTimers = {}
//let closeInactiveTimers = {}

const options = {
  moveActiveToFront: true,
  moveToFrontTimeout: 200, // ms
  moveInactiveToEnd: false,
  moveToEndTimeout: 15 * 60 * 1000, // ms
  //moveToEndTimeout: 2 * 1000, // ms
}

function moveActiveToFront(event) {
  // There will be an error if we move right away while the user is still dragging the tab
  setTimeout(((tabId) => {
    // using a closure to capture the event.tabId in the callback
    return () => {
      console.log(`Moving the tab to the front: ${tabId}`)
      chrome.tabs.move(tabId, { index: 0 })
    }
  })(event.tabId), options.moveToFrontTimeout)
}

function moveInactiveToEnd(event) {
  console.log(`Disabling idle timer for: ${event.windowId}:${event.tabId}`)
  // TODO
  if (moveInactiveTimers[event.windowId] && moveInactiveTimers[event.windowId][event.tabId]) {
    clearTimeout(moveInactiveTimers[event.windowId][event.tabId])
  }
  if (lastActive[event.windowId]) {
    console.log(`Starting the idle timer for last active tab: ${event.windowId}:${lastActive[event.windowId]}`)
    if (!moveInactiveTimers[event.windowId]) {
      moveInactiveTimers[event.windowId] = {}
    }
    moveInactiveTimers[event.windowId][event.tabId] = setTimeout(((tabId) => {
      // using a closure to capture the event.tabId in the callback
      return () => {
        console.log(`Moving the tab to the end: ${tabId}`)
        chrome.tabs.move(tabId, { index: -1 })
      }
    })(lastActive[event.windowId]), options.moveToEndTimeout)
  }
  console.log(`Setting the last active tab to: ${event.windowId}: ${event.tabId}`)
  lastActive[event.windowId] = event.tabId
}

chrome.tabs.onActivated.addListener((event) => {
    console.log(`Tab activated: ${event.windowId}:${event.tabId}`)
    if (options.moveActiveToFront) {
      moveActiveToFront(event)
    }
    if (options.moveInactiveToEnd) {
      moveInactiveToEnd(event)
    }
})
