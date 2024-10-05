chrome.runtime.onInstalled.addListener(async function () {
    chrome.contextMenus.create({
      title: "NoBgCopy",
      contexts: ["image"],
      id: 'copy'
    });

    chrome.contextMenus.onClicked.addListener(genericOnClick);
});

async function genericOnClick(info, tab) {
  if (info.menuItemId === 'copy') {
    console.log(info);
    console.log(tab);

    let gradio = chrome.runtime.getURL('gradio-client.js');
    console.log("Gradio client url: "+gradio);

    console.log("Injecting gradio script to page...");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['gradio-client.js']
    });

    console.log("Running code on page...");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: runCodeOnPage,
      args: [info, tab, gradio]
    });

    console.log("Task ended.");
  }
}

async function runCodeOnPage(info, tab, gradio) {
  // GUI
  console.log("Creating GUI...");

  let div = document.createElement('div');
  div.id = 'no-bg-copy-gui';
  div.style.position = 'fixed';
  div.style.top = '50%';
  div.style.left = '50%';
  div.style.zIndex = '100000';
  div.style.backgroundColor = 'white';
  div.style.padding = '10px';
  div.style.border = '1px solid black';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  div.style.color = 'black';

  let h1 = document.createElement('h1');
  h1.innerText = 'NoBgCopy';
  h1.id = 'no-bg-copy-title';
  div.appendChild(h1);

  let p = document.createElement('p');
  p.innerText = 'Removing background...';
  p.id = 'no-bg-copy-status';
  div.appendChild(p);

  document.body.appendChild(div);

  // Background removal
  console.log("Running code on page...");
  console.log("Downloading image: "+info.srcUrl);
  let downloaded_image = await fetch(info.srcUrl);
  let imageBlob = await downloaded_image.blob();

  console.log("Removing background to: "+info.srcUrl);
  console.log(info);
  console.log(tab);
  console.log(downloaded_image);

  console.log("Connecting to API...");
  const client = await Client.connect("lu2000luk/NoBgCopy");

  console.log("Removing background...");
  const result = await client.predict("/predict", { 
    image: imageBlob, 
  });

  console.log("Result:");
  console.log(result.data[0].url);

  // Remove GUI
  document.getElementById('no-bg-copy-gui').remove();

  // Open image in new tab
  console.log("Opening image in new tab...");
  window.open(result.data[0].url);

  // Checkout
  console.log("Task ended.");
}