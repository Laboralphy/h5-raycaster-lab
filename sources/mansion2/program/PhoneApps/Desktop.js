O2.extendClass('MANSION.PhoneApp.Desktop', MANSION.PhoneApp.Abstract, {

	sOrientation: 'port',
	name: 'Desktop',
	
	oStatusBar: null,
	
	oNoteCvs: null,
	oMetrics: null,
	aNotes: null,
	nIndexNote: -1,

	oBG: null,

	nScreenWidth: 0,
	nScreenHeight: 0,
	
	oRasterize: null,
	sNoteURL: '',
	
	
	__construct: function() {
		this.oStatusBar = new MANSION.PhoneApp.StatusBar();
		this.aNotes = [];
		this.oRasterize = new O876.Rasterize();
		this.oRasterize.on('render', this.desktopRendered.bind(this));
	},
	
	update: function(oLogic) {
		this.oStatusBar.update(oLogic);
	},
	
	/**
	 * This event occurs when a screen is loaded
	 * We must adapt the metrics (status bar height)
	 * And we must keep track of the rendered canvas obviously
	 */
	desktopRendered: function(data) {
		this.oNoteCvs = data.canvas;
		this.oMetrics = data.metrics;
		var n = this.oStatusBar.getHeight();
		for (var i in this.oMetrics) {
			this.oMetrics[i].top += n;
		}
	},
	
	renderNote: function(sURL) {
		var nWidth = this.nScreenWidth;
		var nMaxHeight = this.nScreenHeight - this.oStatusBar.getHeight();
		var nPadding = 4;
		var oCvs = O876.CanvasFactory.getCanvas();
		oCvs.width = nWidth;		
		oCvs.height = nMaxHeight;
		this.oRasterize.render('data/pages/' + sURL + '.xml', oCvs);
	},
	
	loadNote: function(sURL) {
		this.oNoteCvs = null;
		this.oMetrics = null;
		this.sNoteURL = sURL;
	},

	getMetrics: function() {
		return this.oMetrics;
	},

	/**
	 * Will return the identifer of the element pointed by
	 * the specified position
	 * @param x cursor position
	 * @param y
	 * @return string
	 */
	peek: function(x, y) {
		if (this.oMetrics) {
			var mi, m = this.oMetrics;
			for (var i in m) {
				mi = m[i];
				if (x >= mi.left && x < (mi.left + mi.width)
					&& y >= mi.top && y < (mi.top + mi.height)) {
					return i;
				}
			}
		}
		return null;
	},
	
	render: function(oPhone) {
		var oScreen = oPhone.oScreen;
		var oScreenCtx = oScreen.getContext('2d');
		var cw = oScreen.width;
		var ch = oScreen.height;
		if (this.oBG === null) {
			var bg = this.oBG = O876.CanvasFactory.getCanvas();
			var bgx = bg.getContext("2d");
			bg.width = cw;
			bg.height = ch;
			var g = bgx.createRadialGradient(
				cw >> 1, ch >> 1, cw >> 2, 
				cw >> 1, ch >> 1, ch
			);
			g.addColorStop(0, '#CCC');
			g.addColorStop(1, '#000');
			bgx.fillStyle = g;
			bgx.fillRect(0, 0, cw, ch);
		}
		if (this.nScreenHeight === 0) {
			this.nScreenHeight = ch;
		}
		if (this.nScreenWidth === 0) {
			this.nScreenWidth = cw;
		}
		oScreenCtx.drawImage(this.oBG, 0, 0);
		if (this.oNoteCvs) {
			oScreenCtx.drawImage(this.oNoteCvs, 0, this.oStatusBar.getHeight());
		} else if (this.sNoteURL && oPhone.isVisible()) {
			this.renderNote(this.sNoteURL);
			this.sNoteURL = '';
		}
		this.oStatusBar.render(oPhone);
	},
	
	/**
	 * Will be called by game when player clicks on an identified element
	 * of the application surface
	 * @param sCommand command
	 * @param oGame instance of the game
	 */
	execCommand: function(sCommand, oGame) {
		switch (sCommand) {
			case 'menu-camera':
				oGame.toggleCamera();
			break;
			
			case 'menu-gallery':
				oGame.oPhone.activate('Album');
			break;
			
			default:
				if (sCommand) {
					this.loadNote(sCommand);
				}
			break;
		}
	}
});
