chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: "NoBgCopy",
      contexts: ["image"],
      id: 'copy'
    });

    chrome.contextMenus.onClicked.addListener(genericOnClick);
});

function genericOnClick(info, tab) {
  if (info.menuItemId === 'copy') {
    console.log(info);
    console.log(tab);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: runCodeOnPage,
      args: [info, tab]
    });
  }
}

function runCodeOnPage(info, tab) {
  console.log("Removing background to: "+info.srcUrl);
}