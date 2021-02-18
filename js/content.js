var timeInterval,
	selectedDomains = [],
	refresh_every =10 * 60 * 1000; //10 minutes

//before anything we fetch the domains from localstorage
fetchDomains(startTheMagic);

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		//if our domains have been changed
		if(key=="selectedDomains" && namespace=="local"){

			//update the new domains on this page without reloading
			selectedDomains=changes[key].newValue;

			//and check if our page was removed to stop the keep-alive requests.
			if (selectedDomains.indexOf(window.location.href) == -1) {
				clearInterval(timeInterval);
				timeInterval=undefined;	//force this so that we can recognize the state later
				//update the icon to show it has stopped working
				chrome.runtime.sendMessage({
					icon: "stopped"
				}, function (response) {});
			}

			//if our page was just now added and was not there previously, we start the magic
			if (selectedDomains.indexOf(window.location.href) !== -1 && timeInterval===undefined) {
				startTheMagic();
			}
		}
	}
});

//some call me the main() function, but they are WRONG!
function startTheMagic(){
	let domain=extractHostname(window.location.href);

	if(selectedDomains.indexOf(domain)!=-1){

		timeInterval=setInterval(function(){
			var request = new XMLHttpRequest();

			request.open("POST", domain + "/owa/keepalive.owa", true);
			request.send();
		},refresh_every);	//call every 10 minutes

		//update the icon to reflect the extension is doing its thing on this tab
		chrome.runtime.sendMessage({
			icon: "working"
		}, function (response) {});

	}
}

//fetch all the domains remembered in localstorage
function fetchDomains(callback) {
	chrome.storage.local.get(['selectedDomains'], function (result) {

		if (result.selectedDomains === undefined)
			selectedDomains = [];
		else
			selectedDomains = result.selectedDomains;

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
