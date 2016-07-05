O2.extendClass('MANSION.PhoneApp.StatusBar', MANSION.PhoneApp.Abstract, {

	bInvalid: true,
	oSBScreen: null,
	
	SB_HEIGHT: 12,
	
	getHeight: function() {
		return this.oSBScreen.height;
	},
	
	
	update: function(oLogic) {
		var t = oLogic.getClockTime();
		this.setTime(t.h, t.m);
		this.setBattery(oLogic.getBatteryIndicator());
		this.setNetwork(oLogic.getNetworkIndicator());
	},
	
	invalidate: function() {
		this.bInvalid = true;
	},

	setTime: function(h, m) {
		var sTime = ((h | 0) + 100).toString().substr(1) + ':' + ((m | 0) + 100).toString().substr(1);
		if (sTime != this.getData('time')) {
			this.setData('time', sTime);
			this.invalidate();
		};
	},
	
	setBattery: function(n) {
		if (n != this.getData('battery')) {
			this.setData('battery', n);
			this.invalidate();
		}
	},
	
	setNetwork: function(n) {
		if (n != this.getData('network')) {
			this.setData('network', n);
			this.invalidate();
		}
	},
	
	
	repaint: function() {
		var s = this.oSBScreen;
		var c = s.getContext('2d');
		var w = s.width;
		var h = s.height;
		// background
		c.fillStyle = '#000';
		c.fillRect(0, 0, w, h);
		
		var x;
		var clGray = '#444';
		var clBlue = '#28F';
		
		c.font = 'bold 10px monospace';
		c.textBaseline = 'top';
		c.textAlign = 'right';
		
		// battery background
		x = w - 40;
		var nBat = this.getData('battery');
		c.fillStyle = clBlue;
		c.fillText(nBat + '%', w - 42, 1);
		c.fillRect(x, 1, 6, 9);
		c.fillStyle = clGray;
		c.fillRect(x, 1, 6, (99 - nBat) * 9 / 99);
		c.fillStyle = '#000';
		c.fillRect(x, 1, 2, 1);
		c.fillRect(x + 4, 1, 2, 1);


		// network background
		x = w - 64 - 9;
		var nNet = this.getData('network');
		c.fillStyle = clBlue;
		if (nNet < 20) {
			c.fillStyle = clGray;
		} 
		c.fillRect(x, 		8, 	2, 2);
		if (nNet < 40) {
			c.fillStyle = clGray;
		} 
		c.fillRect(x + 3, 	6, 	2, 4);
		if (nNet < 60) {
			c.fillStyle = clGray;
		} 
		c.fillRect(x + 6, 	4, 	2, 6);
		if (nNet < 80) {
			c.fillStyle = clGray;
		} 
		c.fillRect(x + 9, 	2, 	2, 8);
		
		// time
		c.fillStyle = clBlue;
		c.fillText(this.getData('time'), w - 2, 1);
	},

	render: function(oPhone) {
		if (this.bInvalid) {
			if (!this.oSBScreen) {
				this.oSBScreen = O876.CanvasFactory.getCanvas();
				this.oSBScreen.width = oPhone.oScreen.width;
				this.oSBScreen.height = this.SB_HEIGHT;
			}
			this.repaint();
			this.bInvalid = false;
		}
		if (this.oSBScreen) {
			oPhone.oScreen.getContext('2d').drawImage(this.oSBScreen, 0, 0);
		}
	}
});


O2.mixin(MANSION.PhoneApp.StatusBar, O876.Mixin.Data);
