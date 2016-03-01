// GX Phone
// Effets visuels associés au smartphone
// Orientation landscape

O2.extendClass('MANSION.GX.PhonePort', MANSION.GX.PhoneAbstract, {
	sClass: 'PhonePort',
	sTile: 'l_smart1',

	drawPhone: function() {
		if (this.nRaise === 0) {
			return;
		}
		var rcc = this.oCanvas;
		var rccc = this.oContext;
		this.blur();
		
		var p = this.oPhone.oImage;
		var rw = this.oCanvas.width;
		var rh = this.oCanvas.height;
		var pw = p.width;
		var ph = p.height;
		
		var xPhone = (rw -pw) >> 1;
		var yPhone = ((rh - ph) >> 1) + ((1 - this.nRaise) * rh);
		var f = rccc.globalAlpha;
		rccc.globalAlpha = this.nRaise;
		rccc.drawImage(p, 0, 0, pw, ph, xPhone, yPhone, pw, ph);
		rccc.globalAlpha = f;
	}
});
