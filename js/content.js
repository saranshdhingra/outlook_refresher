var timeInterval,
	selectedDomains = [],
	refresh_every = 10 * 60 * 1000; //10 minutes

//before anything we fetch the domains from localstorage
fetchDomains(startTheMagic);

//some call me the main() function, but they are WRONG!
function startTheMagic(){
	let domain=window.location.href;

	if(selectedDomains.indexOf(domain)!=-1){

		timeInterval=setInterval(function(){
			var request = new XMLHttpRequest();

			request.open("POST", domain+"keepalive.owa", true);
			request.send();
		},refresh_every);	//call every 10 minutes

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