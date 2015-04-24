O2.createObject('O876_Raycaster.FullScreen', {
	enter: function(oElement) {
		oElement.requestFullScreen = oElement.requestFullScreen || oElement.webkitRequestFullScreen || oElement.mozRequestFullScreen;
		oElement.onfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.onwebkitfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.onmozfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.requestFullScreen(oElement.ALLOW_KEYBOARD_INPUT);
	},
	
	isFullScreen: function() {
		return document.webkitIsFullScreen || document.mozFullScreen;
	},
	
	changeEvent: function(oEvent) {
		
	}
	
});