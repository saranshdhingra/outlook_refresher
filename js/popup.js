let domains = [];

window.onload=function(){

	//this is supposed to add the current domain to be remembered in localstorage
	document.getElementById("add_url_btn").addEventListener("click",function(){

		getCurrentUrl(function(url){
			
			//if the domain is not there, add it!
			if(domains.indexOf(url)==-1){
				domains.push(url);
				chrome.storage.local.set({
					'selectedDomains': domains,
				}, function () {
					showSavedDomains();
				});
			}


		});
	});

	document.addEventListener("click",function(e){
		
		if(e.target.classList.contains("remove_btn")){
			let url=e.target.previousSibling.nodeValue;

			//if the domain is already there, remove it!
			domains.splice(domains.indexOf(url), 1);
			chrome.storage.local.set({
				'selectedDomains': domains,
			}, function () {
				showSavedDomains();
			});
		}

	});

	//initialize the page by fetching currently stored domains
	fetchDomains(function(){
		//by now, the 'domains' global contains the remembered domains from localstorage
		showSavedDomains();
	});
	
}

//draw function? :P
function showSavedDomains(){

	//clear the div
	document.getElementById("added_urls").innerHTML='';

	if (domains.length) {
		let list = document.createElement("ul");
		for (let i = 0; i < domains.length; i++) {
			let item = document.createElement("li");
			let removeBtn=document.createElement("span");
			
			removeBtn.classList.add("remove_btn");
			removeBtn.innerHTML = "&#9747;"; //html entity for delete
			item.appendChild(document.createTextNode(domains[i]));
			item.appendChild(removeBtn);
			list.appendChild(item);
		}
		document.getElementById("added_urls").appendChild(list);
	} else {
		document.getElementById("added_urls").appendChild(document.createTextNode("No URLs added!"));
	}

	checkCurrentUrlAdded();
}

//checks if the current URL is remembered or not
function checkCurrentUrlAdded(){
	
	getCurrentUrl(function(currentUrl){
		if(domains.indexOf(currentUrl)==-1){
			document.getElementById("add_url_btn").classList.remove("disabled");
		}
		else{
			document.getElementById("add_url_btn").classList.add("disabled");
		}
	});
}

//nothing fancy here
function getCurrentUrl(callback){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		callback(extractHostname(tabs[0].url));
	})
}

//fetch all the domains remembered in localstorage
function fetchDomains(callback){
	chrome.storage.local.get(['selectedDomains'], function(result){
		
		if(result.selectedDomains===undefined)
			domains=[];
		else
			domains=result.selectedDomains;

		callback();
	});
}

function extractHostname(url) {
    var hostname;

    // remove everything after fqdn keep proto
    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[0] + "//" + url.split("/")[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove "?"
   hostname = hostname.split('?')[0];

    return hostname;
}
