O2.extendClass('MANSION.PhoneApp.Camera', MANSION.PhoneApp.Abstract, {

	sOrientation: 'land',
	name: 'Camera',
	
	oEasing: null,
	bFlash: false,
	nFlash: 0,
	nEnergy: 0, // amount of energy
	nMaxEnergy: 100, // maximum amount of energy
	
	nCircleSize: 0,
	
	oRenderRect: null,
	
	
	__construct: function() {
		this.oEasing = new O876.Easing();
	},

	render: function(oPhone) {
		var oScreen = oPhone.oScreen;
		var oScreenCtx = oScreen.getContext('2d');
		var cw = oScreen.width;
		var ch = oScreen.height;
		
		// Photo
		var rcc = oPhone.oCanvas;
		var wNew = ch * rcc.width / rcc.height | 0;
		var xNew = (cw - wNew) >> 1;
		
		oScreenCtx.drawImage(rcc, 0, 0, rcc.width, rcc.height, xNew, 0, wNew, ch);

		// HUD
		var cs = this.nCircleSize;
		if (cs) {
			var sColor1, sColor2;
			var fEnergy = this.nEnergy / this.nMaxEnergy;
			var fEnergyAngle = PI * 2 * fEnergy;
			if (fEnergyAngle) {
				oScreenCtx.strokeStyle = 'rgba(64, 128, 255, ' + (fEnergy / 2) + ')';
				oScreenCtx.lineWidth = 5;
				oScreenCtx.beginPath();
				oScreenCtx.arc(cw >> 1, ch >> 1, cs, 0 - PI / 2, fEnergyAngle - PI / 2);
				oScreenCtx.stroke();
				oScreenCtx.strokeStyle = 'rgba(150, 200, 255, ' + (fEnergy / 2 + 0.5) + ')';
				oScreenCtx.lineWidth = 1;
				oScreenCtx.beginPath();
				oScreenCtx.arc(cw >> 1, ch >> 1, cs, 0 - PI / 2, fEnergyAngle - PI / 2);
				oScreenCtx.stroke();
			}
			oScreenCtx.strokeStyle = 'rgba(192, 192, 192, 0.333)';
			oScreenCtx.lineWidth = 1;
			oScreenCtx.beginPath();
			oScreenCtx.arc(cw >> 1, ch >> 1, cs, fEnergyAngle - PI / 2, 2 * PI - PI / 2);
			oScreenCtx.stroke();
		}
		
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
		this.oEasing.setFunction('cubeDeccel');
		this.oEasing.setMove(1, 0, 0, 0, 25);
	},	
	
	setEnergyGauges: function(nVal, nMax) {
		this.nEnergy = nVal;
		this.nMaxEnergy = nMax;
	}

});
