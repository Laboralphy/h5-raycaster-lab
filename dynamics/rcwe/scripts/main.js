var W;

function main() {
	if (browserIsHTML5()) {
		W = new RCWE.Application();
		$(window).on('resize', W.resizeWindow.bind(W));
	}
}

function browserIsHTML5() {
	var oHTML5 = O876.Browser.isHTML5();
	if (!oHTML5.all) {
		document.body.innerHTML = '<h1>O876 Raycaster Level Editor</h1><p>The program won\'t run because some HTML 5 features are not supported by this browser. You should install the latest version of Firefox, Chrome or Chromium.</p>' + oHTML5.html;
		return false;
	}
	return oHTML5.all;
}


$(window).on('load', main); 
