let domains = [];

window.onload=function(){

	if(domains.length){
		let list=document.createElement("ul");
		for (let i = 0; i < domains.length; i++) {
			let item=document.createElement("li");
			item.appendChild(document.createTextNode(domains[i]));
			list.appendChild(item);
		}
		document.getElementById("added_urls").appendChild(list);
	}
	else{
		document.getElementById("added_urls").appendChild(document.createTextNode("No URLs added!"));
	}

	document.addEventListener("click",function(){
		//this is supposed to add the current domain to be remembered in localstorage
	});

	checkCurrentUrlAdded();
}

//checks if the current URL is remembered or not
function checkCurrentUrlAdded(){
	console.log("checkcurrenturl");
	getCurrentUrl(function(currentUrl){
		console.log("getcurrenturl");
		if(domains.indexOf(currentUrl)==-1){
			console.log("index=-1",domains,currentUrl);
			document.getElementById("add_url_btn").classList.remove("disabled");
		}
		else{
			console.log("index=1");
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
		callback(tabs[0].url);
	})
}

//fetch all the domains remembered in localstorage
function fetchDomains(){

}