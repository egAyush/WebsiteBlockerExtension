chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) { 
      chrome.storage.local.set({
        webUrl: tab.url,
        webHostName: new URL(tab.url).hostname
      });
    }
  });
  
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    chrome.storage.local.set({
      webUrl: tab.url,
      webHostName: new URL(tab.url).hostname
    });
  });

  chrome.runtime.onMessage.addListener((message,sender)=>{
    if(message.CloseMe){
      chrome.tabs.remove(sender.tab.id)
    }
  })
  
  