/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière lineaire, à l'aide d'indication de vitesse
 * Utile lorsqu'on a une indication de vitesse, mais pas de point de destination précis
 */
O2.extendClass('O876_Raycaster.LinearThinker', O876_Raycaster.Thinker, {
	nTime : 0,
	nCurrentTime: 0,
	
	xStart: 0,
	yStart: 0,
	aStart: 0,

	xDelta : 0,
	yDelta : 0,
	
	__construct : function() {
		this.nTime = 0;
	},

	think : function() {
		this.think = this.thinkInit;
	},
	
	setMove: function(x, y, a, dx, dy, t) {
		if (x !== null && x !== undefined) {
			this.xStart = x;
		} else {
			this.xStart = this.oMobile.x;
		}
		if (y !== null && y !== undefined) {
			this.yStart = y;
		} else {
			this.yStart = this.oMobile.y;
		}
		if (a !== null && a !== undefined) {
			this.aStart = a;
		} else {
			this.aStart = this.oMobile.fTheta;
		}
		if (dx !== null && dx !== undefined) {
			this.xDelta = dx;
		}
		if (dy !== null && dy !== undefined) {
			this.yDelta = dy;
		}
		if (t !== null && t !== undefined) {
			this.nTime = t;
		}
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.oMobile.setXY(this.xStart, this.yStart);
		this.oMobile.setAngle(this.aStart);
		this.nCurrentTime = 0;
		this.think = this.thinkDeltaMove;
	},

	thinkDeltaMove : function() {
		this.oMobile.slide(this.xDelta, this.yDelta);
		this.nCurrentTime++;
		if (this.nCurrentTime > this.nTime) {
			this.think = this.thinkStop;
		}
	},
	
	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});
