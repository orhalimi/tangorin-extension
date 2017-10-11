chrome.browserAction.onClicked.addListener(function (activeTab) {
  var uri = "http://tangorin.com/examples/";
  chrome.tabs.create({
    url: uri
  });
});

