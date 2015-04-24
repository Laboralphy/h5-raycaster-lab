O2.extendClass('MW.HUDTarget', UI.HUDElement, {
	
	nFontSize: 16,
	sName: '',
	aFGColor: null,
	aSGColor: null,
	bOver: false,
	
	__construct: function() {
		this.aFGColor = {r: 255, g: 255, b: 255, a: 1};
		this.aSGColor = {r: 0, g: 0, b: 0, a: 1};
	},
	
	setAlpha: function(fAlpha) {
		this.fAlpha = Math.min(1, Math.max(0, fAlpha));
		// var f = Math.min(1, Math.max(0, fAlpha));
		//this.aFGColor.a = f;
		//this.aSGColor.a = f;
	},
	
	getAlpha: function() {
		return this.fAlpha;		
	},
	
	fadeOut: function(f) {
		this.setAlpha(this.getAlpha() - f);
		return this.getAlpha() > 0;
	},
	
	setName: function(sName) {
		this.sName = sName;
		this.write();
	},
	
	write: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var sName = this.sName;
		c.clearRect(0, 0, w, h);
		c.font = 'bold ' + this.nFontSize + 'px courier';
		c.fillStyle = GfxTools.buildRGBA(this.aFGColor);
		c.strokStyle = GfxTools.buildRGBA(this.aSGColor);
		var nWidth = c.measureText(sName).width;
		c.textBaseLine = 'middle';
		var x = (w - nWidth) >> 1;
		var y = h >> 1;
		c.strokeText(sName, x, y);
		c.fillText(sName, x, y);
	},
	
	update: function(sName) {
		if (sName == this.sName) {
			// régénérer alpha au besoin
			if (this.getAlpha() < 1) {
				this.setAlpha(1);
				//this.write();
			}
		} else {
			// pas le même nom : mettre à jour
			if (sName == '') {
				// nouveau nom vide : faire fade out sur l'ancien
				this.fadeOut(0.1);
				this.write();
				if (this.getAlpha() === 0) {
					this.setName(sName);
				}
			} else {
				// nouveau nom
				this.setName(sName);
				this.setAlpha(1);
				this.write();
			}
		}
	}
});
