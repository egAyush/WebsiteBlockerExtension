import React, { useEffect, useState } from 'react';
import AddNew from './AddNew';

function App() {
  const [webHostName, setWebHostName] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [blockedUrls, setBlockedUrls] = useState([]);



  const showError = (text) => {
    const div = document.createElement('div');
    div.setAttribute('id', 'ErrorContainer');

    div.innerHTML = `<div class="Error"><p>${text}</p></div>`;
    document.getElementsByClassName("bottom")[0].appendChild(div);

    setTimeout(()=>{
      document.getElementById('ErrorContainer').remove()
    },2000)
  };




  useEffect(() => {
    const fetchTabData = async () => {
      try {
        const result = await new Promise((resolve) => {
          chrome.storage.local.get(['webHostName', 'webUrl'], (data) => {
            console.log('Retrieved data:', data);
            resolve(data);
          });
        });

        setWebHostName(result.webHostName || '');
        setWebUrl(result.webUrl || '');

      } catch (error) {
        console.error('Error fetching tab data:', error);
      }
    };

    fetchTabData();


    const fetchBlockedUrls = async () => {
      chrome.storage.local.get("BlockedUrls", (data) => {
        const currentBlockedUrls = data.BlockedUrls ? (data.BlockedUrls) : [];
        setBlockedUrls(currentBlockedUrls);
        
      });
    };

    fetchBlockedUrls();
  }, []);


  const handleClick = () => {
    if (webUrl) {
      if (webUrl.toLowerCase().startsWith('chrome://')) {
        showError("You can't block a chrome URL")
      } else {
        
        chrome.storage.local.get("BlockedUrls",(data)=>{
          if(data.BlockedUrls === undefined){
            chrome.storage.local.set({BlockedUrls:[{state:"BLOCKED" ,url: webHostName}]})

            console.log("blocking a weburl:",webHostName )

            chrome.tabs.query({active:true, currentWindow:true}, tabs=>{
              chrome.tabs.sendMessage(
                tabs[0].id,
                {from : "popup", subject:"Block"}
              )
            })
          }
          else{
            if(data.BlockedUrls.some((ev)=> ev.url === webHostName && ev.state === "BLOCKED")){
              showError("This URL is Blocked Already");
            }else{
              chrome.storage.local.set({BlockedUrls:[...data.BlockedUrls,{state:"BLOCKED" ,url: webHostName}]})
              
              console.log("blocking a weburl:",webHostName )
              chrome.tabs.query({active:true, currentWindow:true}, tabs=>{
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  {from : "popup", subject:"Block"}
                )
              })
            }
          }
        })
      }

    } else {
      showError('Web URL is not set');
    }
  };

  const handleDelete = (url) => {
    chrome.storage.local.get("BlockedUrls", (data) => {
      const currentBlockedUrls = data.BlockedUrls ? data.BlockedUrls : [];

      const updatedBlockedUrls = currentBlockedUrls.filter(item => item.url !== url);
      
      chrome.storage.local.set({ BlockedUrls: updatedBlockedUrls });
      setBlockedUrls(updatedBlockedUrls);
    });
  };

  

  return (
    <div className="container">
      <div className="top">
        <h1 className="h1">My Extension</h1>
        <div className="topMain">
          <div className="info">
            <p className="p">You are currently on:</p>
            <h4 className="h4" id="url">{webHostName}</h4>
          </div>
          <button id="btn" onClick={handleClick}>BLOCK THIS URL</button>
        </div>
      </div>
      <div className="bottom"> </div>

      <div className="blocked" id="blocked">
        {blockedUrls.length > 0 ? (
          blockedUrls.map((blocked, index) => (
            <AddNew key={index} blocked={blocked} onDelete={handleDelete} />
          ))
        ) : (
          <i className="row">Nothing is blocked</i>
        )}
      </div>

    </div>
  );
}

export default App;












