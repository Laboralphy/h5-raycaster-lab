var W;

function main() {
	W = new RCWE.Application();
	$(window).on('resize', W.resizeWindow.bind(W));
}

$(window).on('load', main); 
