O2.createObject('MAIN', {
	
	G: null,
	screen: null,
	
	run: function() {
		MAIN.screen = document.getElementById(MAIN.CONFIG.raycaster.canvas);
		MAIN.screenResize();
		window.addEventListener('resize', MAIN.screenResize);
		var g = MAIN.G = new MANSION.Game();
		g.setConfig(MAIN.CONFIG);
		if (MAIN.CONFIG.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
			MAIN.screen.addEventListener('click', function(oEvent) {
				g.lockPointer();
			});
		}
	},

	screenResize: function(oEvent) {
		var nPadding = 24;
		var h = innerHeight;
		var w = innerWidth;
		var r = (h - nPadding) / w;
		var oCanvas = MAIN.screen;
		var ch = oCanvas.height;
		var cw = oCanvas.width;
		var rBase = ch / cw; 
		var wf, hf;
		if (r < rBase) { // utiliser height
			h -= nPadding;
			hf = h;
			wf = h * cw / ch;
		} else { // utiliser width
			wf = w;
			hf = w * ch / cw;
		}
		oCanvas.style.width = (wf | 0).toString() + 'px';
		oCanvas.style.height = (hf | 0).toString() + 'px';
	}
});

window.addEventListener('load', MAIN.run);
