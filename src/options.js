const defaultOptions = {
  moveactive: false
}
function getInputValue(id) {
  const element = document.getElementById(id)
  switch (element.type) {
    case 'checkbox':
      return element.checked
      break;
    default:
      return element.value
      break;
  }
}
// Saves options to chrome.storage
function save_options() {
  let options = {}
  for (const id of Object.keys(defaultOptions)) {
    options[id] = document.getElementById(id).value
  }
  console.log(options)
  /*
  var default_prompt_time = document.getElementById('default_prompt_time').value;
  var block_time = document.getElementById('block_time').value;
  var blacklist = document.getElementById('blacklist').value;
  */
  chrome.storage.sync.set(options, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved';
    setTimeout(function() {
      status.textContent = '';
    }, 10000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(defaultOptions, function(items) {
    console.log(items)
    for (const id of Object.keys(items)) {
      document.getElementById(id).value = items[id]
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
                                                 save_options);

if(typeof module !== "undefined") {
  module.exports = {
    getInputValue,
    save_options
  }
}
