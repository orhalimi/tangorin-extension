chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "http://tangorin.com/examples/";
    chrome.tabs.create({ url: newURL });
});
