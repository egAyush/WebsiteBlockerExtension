 function CloseTab(){
    alert("This url is blocked now. Click ok to close this tab.. ")
    chrome.runtime.sendMessage({CloseMe:true})
 }
 
 chrome.runtime.onMessage.addListener((message,sender)=>{
    if(message.from ==='popup' && message.subject ==='Block'){
        CloseTab();
    }
 })


 chrome.storage.local.get("BlockedUrls",(data)=>{
    if(data.BlockedUrls !== undefined){
        if(data.BlockedUrls.some((e)=>e.url === window.location.hostname && e.state === "BLOCKED")){
            CloseTab();
        }
    }

 })