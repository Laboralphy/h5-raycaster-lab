O2.extendClass('MANSION.PhoneApp.Notepad', MANSION.PhoneApp.Abstract, {

	sOrientation: 'port',
	name: 'Notepad',
	
	oStatusBar: null,
	
	oNoteCvs: null,
	aNotes: null,
	nIndexNote: -1,

	oBG: null,

	nScreenWidth: 0,
	nScreenHeight: 0,
	
	oRasterizer: null,
	
	
	__construct: function() {
		this.oStatusBar = new MANSION.PhoneApp.StatusBar();
		this.aNotes = [];
		this.oRasterize = new O876.Rasterize();
	},
	
	update: function(oLogic) {
		this.oStatusBar.update(oLogic);
	},

	loadNote: function(sURL) {
		var nWidth = this.nScreenWidth;
		var nMaxHeight = this.nScreenHeight - this.oStatusBar.getHeight();
		var nPadding = 4;
		var oCvs = O876.CanvasFactory.getCanvas();
		oCvs.width = nWidth;		
		oCvs.height = nMaxHeight;
		this.oRasterize.render('data/pages/' + sURL + '.xml', oCvs, (function() {
			this.oNoteCvs = oCvs;
		}).bind(this));
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
		}
		this.oStatusBar.render(oPhone);
	},
	

});
