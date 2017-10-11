chrome.browserAction.onClicked.addListener(function (activeTab) {
  const uri = "http://tangorin.com/examples/";
  chrome.tabs.create({
    url: uri
  });
});

