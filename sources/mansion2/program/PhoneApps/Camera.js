O2.createClass('MANSION.PhoneApp.Camera', {

	oEasing: null,
	
	bFlash: false,
	nFlash: 0,
	
	__construct: function() {
		this.oEasing = new O876.Easing();
	},

	render: function(oPhone) {
		var oScreen = oPhone.oScreen;
		var oScreenCtx = oScreen.getContext('2d');
		var cw = oScreen.width;
		var ch = oScreen.height;

		//oScreenCtx.fillStyle = 'rgb(0, 120, 0)';
		//oScreenCtx.fillRect(0, 0, cw, ch);
		
		// Photo
		var rcc = oPhone.oCanvas;
		var wNew = ch * rcc.width / rcc.height | 0;
		var xNew = (cw - wNew) >> 1;
		
		oScreenCtx.drawImage(rcc, 0, 0, rcc.width, rcc.height, xNew, 0, wNew, ch);

		// HUD
		oScreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.333)';
		oScreenCtx.beginPath();
		oScreenCtx.arc(cw >> 1, ch >> 1, 32, 0, 2 * PI);
		oScreenCtx.stroke();
		
		// flash
		if (this.bFlash) {
			if (this.oEasing.move(++this.nFlash)) {
				this.bFlash = false;
			} else {
				oScreenCtx.fillStyle = 'rgba(255, 255, 255, ' + this.oEasing.x + ')';
				oScreenCtx.fillRect(xNew, 0, wNew, ch);					
			}
		}
	},
	
	flash: function() {
		this.nFlash = 0;
		this.bFlash = true;
		this.oEasing.setFunction('smoothstepX2');
		this.oEasing.setMove(1, 0, 0, 0, 20);
	}
});
