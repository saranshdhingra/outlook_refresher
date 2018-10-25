
//used to update the icon of a specific tab reflecting the state of keeping-alive
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		let tabId=sender.tab.id;
		if (request.icon == "working"){
			chrome.browserAction.setIcon({
				"path": {
					"38": "images/38/refresh_color.png"
				},
				tabId: tabId
			});
		}
		else if(request.icon=="stopped"){
			chrome.browserAction.setIcon({
				"path": {
					"38": "images/38/refresh_gray.png"
				},
				tabId: tabId
			});
		}
});