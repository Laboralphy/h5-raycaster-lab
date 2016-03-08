var W;

function main() {
	if (O876.Browser.checkHTML5('O876 Raycaster Level Editor')) {
		W = new RCWE.Application();
		$(window).on('resize', W.resizeWindow.bind(W));
	}
}

$(window).on('load', main); 
