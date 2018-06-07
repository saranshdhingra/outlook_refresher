var time_interval,
	domain,
	started_for=[],
	refresh_every=10*60*1000;	//10 minutes

//the start and stop of the Extension's work
chrome.browserAction.onClicked.addListener(function (tab) {
	// var cookie_string="";
	domain=tab.url;

	//if the interval for this hasn't yet started!
	if(started_for.indexOf(domain)==-1){
		// console.log("pushing");
		// console.log(started_for);
		started_for.push(domain);
		chrome.browserAction.setIcon({
			"path":{
				"38":"images/refresh_color.png"
			},
			tabId:tab.id
		});
	}
	//this was already started, remove it from the list
	else{
		// console.log("removing");
		// console.log(started_for);
		started_for.splice(started_for.indexOf(domain),1);
		chrome.browserAction.setIcon({
			"path":{
				"38":"images/refresh_gray.png"
			},
			tabId:tab.id
		});
	}

	//we haven't started our thing
	if(started_for.length>0 && !time_interval){
		// console.log("starting interval");
		start_interval();
	}
	//our thing is started but there is nothing in the list now. So, clearInterval
	else if(started_for.length==0){
		// console.log("stoping interval");
		clearInterval(time_interval);
		time_interval=false;
	}

});

//if we close the tab, we shouldn't keep on calling the API
chrome.tabs.onRemoved.addListener(function(tab){
	if(started_for.indexOf(tab.url)!=-1){
		started_for.splice(started_for.indexOf(tab.url),1);
	}
});


function start_interval(){
	time_interval=setInterval(function(){
		started_for.forEach(function(domain){
			var request = new XMLHttpRequest();

			// request.open("POST", domain+"keepalive.owa", true);
			request.send();
			// console.log("calling keepalive for: "+domain);
		});
	},refresh_every);	//call every 10 minutes
}