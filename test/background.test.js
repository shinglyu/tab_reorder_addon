Object.assign(global, require('jest-chrome'))
const bg = require("../background.js")

jest.useFakeTimers()

describe("Background script", () => {
  beforeEach(() => {
    chrome.tabs.move = jest.fn()
    chrome.tabs.remove = jest.fn()
  })

  it("can move active tab to front", () => {
    bg.moveActiveToFront({
      windowId: 123,
      tabId: 456,
    })
    jest.runAllTimers()
    expect(chrome.tabs.move).toHaveBeenCalledWith(456, {index: 0})
  })

  it("can move inactive tab to end", () => {
    bg.moveInactiveToEnd({
      windowId: 123,
      tabId: 456,
    })
    bg.moveInactiveToEnd({
      windowId: 123,
      tabId: 789,
    })
    jest.runAllTimers()
    expect(chrome.tabs.move).toHaveBeenCalledWith(456, {index: -1})
  })

  it("can close inactive tab", () => {
    bg.closeInactive({
      windowId: 123,
      tabId: 456,
    })
    bg.closeInactive({
      windowId: 123,
      tabId: 789,
    })
    jest.runAllTimers()
    expect(chrome.tabs.remove).toHaveBeenCalledWith(456)
  })
})
