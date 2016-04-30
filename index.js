var tabs = require("sdk/tabs");
var { setTimeout, clearTimeout  } = require("sdk/timers");
var timeout = require("sdk/simple-prefs").prefs["timeout"];

timers = {} //Hash table, tab.id => timer id

function onOpen(tab) {
  console.log('tab opned: ' + tab.id)
}

function onActivate(tab) {
  console.log('tab activated, timer canceled: ' + tab.id)
  var tid = timers[tab.id];
  clearTimeout(tid);
}

function onDeactivate(tab) {
  console.log('tab deactivated: ' + tab.id)
  var tid = setTimeout(function(){
    tab.pin()
    tab.unpin()
    console.log("tab was inactive for too long, move the the end")
  }, timeout * 60 * 1000);
  console.log('timer started: ' + tab.id)

  timers[tab.id] = tid;
}

tabs.on('open', onOpen);
tabs.on('activate', onActivate);
tabs.on('deactivate', onDeactivate);
