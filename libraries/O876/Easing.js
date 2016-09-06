/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 * good to GIT
 */
O2.createClass('O876.Easing', {	
	xStart: 0,
	xEnd: 0,
	x: 0,
	nTime: 0,
	iTime: 0,
	fWeight: 1,
	pFunction: null,
	
	from: function(x) {
		this.xStart = this.x = x;
		return this;
	},

	to: function(x) {
		this.xEnd = x;
		return this;
	},

	during: function(t) {
		this.nTime = t;
		this.iTime = 0;
		return this;
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
	use: function(xFunction) {
		switch (typeof xFunction) {
			case 'string':
				this.pFunction = this['_' + xFunction].bind(this);
			break;

			case 'function':
				this.pFunction = xFunction;
			break;

			default:
				throw new Error('unknown function type');
		}
		return this;
	},
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param int t temps
	 * si "t" est indéfini, utilise le timer interne 
	 */
	f: function(t) {
		if (t === undefined) {
			t = ++this.iTime;
		} else {
			this.iTime = t;
		}
		var p = this.pFunction;
		if (typeof p != 'function') {
			throw new Error('easing function is invalid : ' + p);
		}
		var v = p(t / this.nTime);
		this.x = this.xEnd * v + (this.xStart * (1 - v));
		return t >= this.nTime;
	},

	_linear: function(v) {
		return v;
	},
	
	_smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	_squareAccel: function(v) {
		return v * v;
	},
	
	_squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	_cubeAccel: function(v) {
		return v * v * v;
	},
	
	_cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	_cubeInOut: function(v) {
		if (v < 0.5) {
			v = 2 * v;
			return v * v * v;
		} else {
			v = (1 - v) * 2;
			return v * v * v;
		}
	},
	
	_sine: function(v) {
		return Math.sin(v * Math.PI / 2);
	},
	
	_cosine: function(v) {
		return 0.5 - Math.cos(-v * Math.PI) * 0.5;
	},
	
	_weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	_quinticBezier: function(v) {
		var ts = v * this.nTime;
		var tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
});
