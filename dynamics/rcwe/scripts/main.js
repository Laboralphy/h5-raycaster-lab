var WIDGETS = {};
var W;
var S;

function resizeWindow(oEvent) {
	W.resize();
}

function main() {
	W = new RCWE.Application();
	W.build($('body'));
	S = new RCWE.SlideShows();
}


window.addEventListener('load', main, false);
window.addEventListener('resize', resizeWindow, false);
