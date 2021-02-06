Object.assign(global, require('jest-chrome'))
document.body.innerHTML = `
<button id="save" />
`
const options = require("../src/options.js")

describe("Options", () => {
  beforeEach(() => {
    chrome.storage.sync.get = jest.fn()
    chrome.storage.sync.set= jest.fn()
  })

  it("can read checkbox", () => {
    document.body.innerHTML = `
    <input type="checkbox" id="checkbox1" checked></input>
    `
    expect(options.getInputValue("checkbox1")).toBe(true)

    document.body.innerHTML = `
    <input type="checkbox" id="checkbox1"></input>
    `
    expect(options.getInputValue("checkbox1")).toBe(false)
  })

  it("can save options", () => {
    document.body.innerHTML = `
    <input type="checkbox" id="moveactive" checked></input>
    <input type="checkbox" id="moveinactive"></input>
    `
    options.save_options()
    expect(chrome.storage.sync.set({
      moveactive: true,
      moveinactive: false,
    }))
  })
})
