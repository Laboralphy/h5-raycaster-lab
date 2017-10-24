/**
 * Makes ghost screeam
 */
 
O2.extendClass('MANSION.GX.GhostScreamer', O876_Raycaster.GXEffect, {
	_aGhosts: null,
	TIME_OUT: 25,
	
	
	__construct: function(r) {
		__inherited(r);
		this._aGhosts = [];
	},
	
	addGhost: function(oGhost) {
		var g = {
			time: 0,
			sprite: oGhost.oSprite.aLastRender, 
			x: 0,
			y: 0,
			w: 0,
			h: 0
		};
		this._aGhosts.push(g);
	},
	
	process: function() {
		var timeout = this.TIME_OUT;
		if (this._aGhosts.length) {
			this._aGhosts = this._aGhosts.filter(function(g) {
				var x =  g.time / timeout;
				var x1 = 1 + x;
				var r = g.sprite;
				
				g.w = r[7] * x1 | 0;
				g.h = r[8] * x1 | 0;
				g.x = r[5] - ((g.w - r[7]) >> 1);
				g.y = r[6] - ((g.h - r[8]) >> 1);
				/*g.w = r[7];
				g.h = r[8];
				g.x = r[5];
				g.y = r[6];*/
				return (++g.time) < timeout;
			});
		}
	},
	
	render: function() {
		var ghosts = this._aGhosts;
		if (ghosts.length >= 0) {
			var oCanvas = this.oRaycaster.getRenderCanvas();
			var oContext = oCanvas.getContext('2d');
			var x, x1, g, r, fAlpha = oContext.globalAlpha, gco = oContext.globalCompositeOperation;
			oContext.globalCompositeOperation = 'lighter';
			for (var i = 0, l = ghosts.length; i < l; ++i) {
				g = ghosts[i];
				r = g.sprite;
				x =  g.time / this.TIME_OUT;
				oContext.globalAlpha = 1 - (x * x);
				//oContext.fillStyle = '#F0F';
				//oContext.fillRect(r[5], r[6], r[7], r[8]);
				oContext.drawImage(r[0], r[1], r[2], r[3], r[4], g.x, g.y, g.w, g.h);
			}
			oContext.globalCompositeOperation = gco;
			oContext.globalAlpha = fAlpha;
		}
	},

	done: function() {
	},
	
	isOver: function() {
		return this.bOver;
	},
		
	terminate: function() {
		this.bOver = true;
	},
});
