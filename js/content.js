var timeInterval,
	selectedDomains = [""],
	refresh_every = 10 * 60 * 1000; //10 minutes

(function(){
	let domain=window.location.href;

	if(selectedDomains.indexOf(domain)!=-1){

		timeInterval=setInterval(function(){
			var request = new XMLHttpRequest();

			request.open("POST", domain+"keepalive.owa", true);
			request.send();
		},refresh_every);	//call every 10 minutes

	}
})();