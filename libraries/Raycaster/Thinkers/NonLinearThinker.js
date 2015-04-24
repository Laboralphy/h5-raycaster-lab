/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.extendClass('O876_Raycaster.NonLinearThinker', O876_Raycaster.Thinker, {
	nTime : 0,
	nCurrentTime: 0,
	
	xStart: 0,
	yStart: 0,
	aStart: 0,
	
	xEnd: 0,
	yEnd: 0,
	
	fWeight: 1,
	
	sFunction: 'smoothstepX2',
	
	__construct : function() {
		this.nTime = 0;
	},
	
	processTime: function() {
		this.nCurrentTime++;
		if (this.nCurrentTime > this.nTime) {
			this.think = this.thinkStop;
		}
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
			this.xEnd = dx;
		}
		if (dy !== null && dy !== undefined) {
			this.yEnd = dy;
		}
		if (t !== null && t !== undefined) {
			this.nTime = t;
		}
	},

	think : function() {
		this.think = this.thinkInit;
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.oMobile.setXY(this.xStart, this.yStart);
		this.oMobile.setAngle(this.aStart);
		this.nCurrentTime = 0;
		this.think = this.thinkMove;
	},
	
	thinkMove: function() {
		var x, y;
		
		var v = this[this.sFunction](this.nCurrentTime / this.nTime);
		
		x = this.xEnd * v + (this.xStart * (1 - v));
		y = this.yEnd * v + (this.yStart * (1 - v));
		
		this.oMobile.setXY(x, y);
		this.processTime();
	},
	
	linear: function(v) {
		return v;
	},
	
	smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	squareAccel: function(v) {
		return v * v;
	},
	
	squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	cubeAccel: function(v) {
		return v * v * v;
	},
	
	cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	sine: function(v) {
		return Math.sin(v * 3.14159265 / 2);
	},
	
	cosine: function(v) {
		return 0.5 - Math.cos(-v * 3.14159265) * 0.5;
	},
	
	weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});
