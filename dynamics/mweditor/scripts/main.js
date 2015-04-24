var WIDGETS = {};
var W;
var S;

function resizeWindow(oEvent) {
	W.resize();
}

function main() {
	var oOptions = {};
	location.search.substr(1).split('&').forEach(function(s) {
		var n = s.indexOf('=');
		if (n) {
			oOptions[s.substr(0, n)] = s.substr(n + 1);
		}
	});
	W = new MWE.Application();
	W.build($('body'), oOptions);
	S = new RCWE.SlideShows();
}


window.addEventListener('load', main, false);
window.addEventListener('resize', resizeWindow, false);
