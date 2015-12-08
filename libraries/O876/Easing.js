/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.createClass('O876.Easing', {	
	xStart: 0,
	yStart: 0,
	
	xEnd: 0,
	yEnd: 0,
	
	x: 0,
	y: 0,
	
	bXCompute: true,
	bYCompute: true,
	
	nTime: 0,
	iTime: 0,
	
	
	fWeight: 1,
	
	sFunction: 'smoothstep',
	
	__construct : function() {
		this.nTime = 0;
		this.iTime = 0;
	},
	
	/**
	 * Définition du mouvement qu'on souhaite calculer.
	 * @param float x position X de départ
	 * @param float y position Y de départ
	 * @param float dx position finale X
	 * @param float dy position finale Y
	 * @param int t temps qu'il faut au mouvement pour s'effectuer
	 */
	setMove: function(x, y, dx, dy, t) {
		if (t === undefined && dy === undefined) {
			t = dx;
			dy = 0;
			dx = y;
			y = 0;
		}
		this.xStart = this.x = x;
		this.yStart = this.y = y;
		this.xEnd = dx;
		this.yEnd = dy;
		this.bXCompute = x != dx;
		this.bYCompute = y != dy;
		this.nTime = t;
		this.iTime = 0;
	},
	
	/**
	 * Définition de la fonction d'Easing
	 * @param string sFunction fonction à choisir parmi :
	 * linear : mouvement lineaire uniforme
	 * smoothstep : accelération et déccelération douce
	 * smoothstepX2 : accelération et déccelération moyenne
	 * smoothstepX3 : accelération et déccelération brutale
	 * squareAccel : vitesse 0 à T-0 puis uniquement accelération 
	 * squareDeccel : vitesse max à T-0 puis uniquement deccelération
	 * cubeAccel : vitesse 0 à T-0 puis uniquement accelération brutale 
	 * cubeDeccel : vitesse max à T-0 puis uniquement deccelération brutale
	 * sine : accelération et deccelération brutal, vitesse nulle à mi chemin
	 * cosine : accelération et deccelération selon le cosinus, vitesse max à mi chemin
	 * weightAverage : ... me rapelle plus 
	 */
	setFunction: function(sFunction) {
		this.sFunction = sFunction;
	},
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param int t temps
	 */
	move: function(t) {
		if (t === undefined) {
			t = this.iTime++;
		}
		var v = this[this.sFunction](t / this.nTime);
		if (this.bXCompute) {
			this.x = this.xEnd * v + (this.xStart * (1 - v));
		}
		if (this.bYCompute) {
			this.y = this.yEnd * v + (this.yStart * (1 - v));
		}
		return t >= this.nTime;
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
	
	quinticBezier: function(v) {
		var ts = v * this.nTime;
		var tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
});
