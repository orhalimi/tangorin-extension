chrome.browserAction.onClicked.addListener(function (activeTab) {
  var newURL = "http://tangorin.com/examples/";
  chrome.tabs.create({
    url: newURL
  });
});

/*chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      console.log("message");
return true;
  }
);*/
