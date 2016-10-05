/**
 * The MAIN object
 */
O2.createClass('O876_Raycaster.Main', {
	
	game: null,
	screen: null,
	
	/**
	 * Will start a game
	 */
	run: function() {
		var oConfig = MAIN.CONFIG;
		this.screen = document.getElementById(oConfig.raycaster.canvas);
		this.screenResize();
		window.addEventListener('resize', this.screenResize.bind(this));
		var sNamespace = oConfig.game.namespace;
		var P = window[sNamespace];
		this.game = new P.Game();
		this.game.setConfig(oConfig);
		if (oConfig.game.fpscontrol && O876_Raycaster.PointerLock.init()) {
			this.screen.addEventListener('click', (function(oEvent) {
				this.game.lockPointer();
			}).bind(this));
		}
	},

	screenResize: function(oEvent) {
		var nPadding = 24;
		var h = innerHeight;
		var w = innerWidth;
		var r = (h - nPadding) / w;
		var oCanvas = this.screen;
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

O2.mixin(O876_Raycaster.Main, O876.Mixin.Events);

window.addEventListener('load', function() {
	var m = new O876_Raycaster.Main();
	m.run();
});
