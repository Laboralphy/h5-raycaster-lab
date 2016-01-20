// GX Phone
// Effets visuels associés au smartphone
// Orientation landscape

O2.extendClass('MANSION.GX.PhoneLand', MANSION.GX.PhoneAbstract, {
	sClass: 'PhoneLand',
	sTile: 'l_smart0',

	oApplication: null,
	
	SCREEN_W: 335,
	SCREEN_H: 190,
	SCREEN_X: 42,
	SCREEN_Y: 12,
	
	RATIO: 0.85,
	
	__construct: function(r) {
		__inherited(r);
		var c = r.getRenderCanvas();
		// phone screen
		this.oScreen = O876.CanvasFactory.getCanvas();
		this.oScreen.width = this.SCREEN_W;
		this.oScreen.height = this.SCREEN_H;
		
		this.oScreenContext = this.oScreen.getContext('2d');
		O876.CanvasFactory.setImageSmoothing(this.oScreenContext, true);
	},

	drawPhone: function() {
		if (this.nRaise === 0) {
			return;
		}
		var rcc = this.oCanvas;
		var rccc = this.oContext;
		this.renderApplication();
		this.blur();
		
		var p = this.oPhone.oImage;
		var rw = rcc.width;
		var rh = rcc.height;
		var pw = p.width;
		var ph = p.height;
		
		var xPhone = (rw -pw) >> 1;
		var yPhone = ((rh - ph) >> 1) + ((1 - this.nRaise) * rh);
		
		var oScreen = this.oScreen;
		var cw = oScreen.width;
		var ch = oScreen.height;
		var xim = xPhone + this.SCREEN_X;
		var yim = yPhone + this.SCREEN_Y;

		
		var f = rccc.globalAlpha;

		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(p, xPhone, yPhone);
		
		rccc.drawImage(oScreen, xim, yim);
		rccc.globalAlpha = f;
	},
	
	isVisible: function() {
		return this.nRaise === 1;
	}
});
