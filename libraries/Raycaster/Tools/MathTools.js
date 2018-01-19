/** MathTools Boîte à outil mathématique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

var PI = Math.PI;
var MathTools = {
	aQuadrans : [ -PI / 2, -PI / 4, 0, PI / 4, PI / 2 ],
	fToDeg : 180 / PI,
	fToRad : PI / 180,
	
	pRndFunc: Math.random,

	sBASE64 : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	iRndTable : 0,
	nRndSeed: Date.now() % 2147483647,
	
	aRndTable : [ 0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16,
			66, 74, 21, 211, 47, 80, 242, 154, 27, 205, 128, 161, 89, 77, 36,
			95, 110, 85, 48, 212, 140, 211, 249, 22, 79, 200, 50, 28, 188, 52,
			140, 202, 120, 68, 145, 62, 70, 184, 190, 91, 197, 152, 224, 149,
			104, 25, 178, 252, 182, 202, 182, 141, 197, 4, 81, 181, 242, 145,
			42, 39, 227, 156, 198, 225, 193, 219, 93, 122, 175, 249, 0, 175,
			143, 70, 239, 46, 246, 163, 53, 163, 109, 168, 135, 2, 235, 25, 92,
			20, 145, 138, 77, 69, 166, 78, 176, 173, 212, 166, 113, 94, 161,
			41, 50, 239, 49, 111, 164, 70, 60, 2, 37, 171, 75, 136, 156, 11,
			56, 42, 146, 138, 229, 73, 146, 77, 61, 98, 196, 135, 106, 63, 197,
			195, 86, 96, 203, 113, 101, 170, 247, 181, 113, 80, 250, 108, 7,
			255, 237, 129, 226, 79, 107, 112, 166, 103, 241, 24, 223, 239, 120,
			198, 58, 60, 82, 128, 3, 184, 66, 143, 224, 145, 224, 81, 206, 163,
			45, 63, 90, 168, 114, 59, 33, 159, 95, 28, 139, 123, 98, 125, 196,
			15, 70, 194, 253, 54, 14, 109, 226, 71, 17, 161, 93, 186, 87, 244,
			138, 20, 52, 123, 251, 26, 36, 17, 46, 52, 231, 232, 76, 31, 221,
			84, 37, 216, 165, 212, 106, 197, 242, 98, 43, 39, 175, 254, 145,
			190, 84, 118, 222, 187, 136, 120, 163, 236, 249 ],

	/** Calcule le sign d'une valeur
	 * @param x valeur à tester
	 * @return -1 si x < 0, +1 si y > 0, 0 si x = 0
	 */
	sign : function(x) {
		if (x === 0) {
			return 0;
		}
		return x > 0 ? 1 : -1;
	},

	/** Calcul de la distance entre deux point séparés par dx, dy
	 * @param dx delta x
	 * @param dy delta y
	 * @return float
	 */
	distance : function(dx, dy) {
		return Math.sqrt((dx * dx) + (dy * dy));
	},

	/**
	 * Normalize le vecteur donnée
	 * @param dx  {number}
	 * @param dy  {number}
	 * @return {number}
	 */
	normalize: function(dx, dy) {
		var dist = MathTools.distance(dx, dy);
		return {
			x: dx / dist,
			y: dy / dist
		};
	},

    /**
	 * Limit le nombre aux deux bornes spécifiées
	 * @param n {number} nombre
     * @param nMin {number} min
     * @param nMax {number} max
     */
	bound: function(nMin, n, nMax) {
		return Math.min(nMax, Math.max(nMin, n));
	},
	
	/**
	 * Détermine si un point (xTarget, yTarget) se situe à l'intérieur de l'angle 
	 * formé par le sommet (xCenter, yCenter) et l'ouverture fAngle.
	 * @param float xCenter, yCenter sommet de l'angle
	 * @param float fAperture ouverture de l'angle
	 * @param float fBissect direction de la bissectrice de l'angle
	 * @param float xTarget, yTarget point à tester
	 * @return boolean
	 */
	isPointInsideAngle: function(xCenter, yCenter, fBissect, fAperture, xTarget, yTarget) {
		var xPoint = xTarget - xCenter;
		var yPoint = yTarget - yCenter;
		var dPoint = MathTools.distance(xPoint, yPoint);
		xPoint /= dPoint;
		yPoint /= dPoint;
		var xBissect = Math.cos(fBissect);
		var yBissect = Math.sin(fBissect);
		var fDot = xPoint * xBissect + yPoint * yBissect;
		return Math.acos(fDot) < (fAperture / 2);
	},

	/** Renvoie, pour un angle donnée, le code du cadran dans lequel il se trouve
	 *	-PI/2...cadran 0...-PI/4...cadran 1...0...cadran 2...PI/4...cadran 3...PI/2
	 * @return entier entre 0 et 4 : la valeur 4 indique que l'angle est hors cadran
	 */
	quadran : function(a) {
		var i = 0;
		while (i < (MathTools.aQuadrans.length - 1)) {
			if (a >= MathTools.aQuadrans[i] && a < MathTools.aQuadrans[i + 1]) {
				break;
			}
			i++;
		}
		return i;
	},

	// conversion radians degres
	toDeg : function(fRad) {
		return fRad * MathTools.fToDeg;
	},

	// Conversion degres radians
	toRad : function(fDeg) {
		return fDeg * MathTools.fToRad;
	},

	
	/**
	 * Défini la graine du générateur 8 bits
	 * @param int n nouvelle graine
	 */
	rndSeed8: function(n) {
		MathTools.iRndIndex = n % MathTools.aRndTable.length;
	},

	/**
	 * Générateur de nombre pseudo-aléatoire sur 8 bits.
	 * Générateur sur table très faible. A n'utiliser que pour des truc vraiment pas importants.
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd8 : function(nMin, nMax) {
		var r = MathTools.aRndTable[MathTools.iRndIndex];
		MathTools.iRndIndex = (MathTools.iRndIndex + 1) & 0xFF;
		var d = nMax - nMin + 1;
		return (r * d / 256 | 0) + nMin;
	},
	
	/**
	 * Défini la nouvelle graine du générateur de nombre pseudo aléatoire sur 31 bits;
	 * @param int n nouvelle graine
	 */
	rndSeed31: function(n) {
		var v = n % 2147483647;
		if (v == 0) {
			v = 1;
		}
		return this.nRndSeed = v;
	},

	/** 
	 * Générateur de nombre aléatoire sur 31 bits;
	 * Si les paramètre ne sont pas précisé on renvoie le nombre sur 31 bits;
	 * sinon on renvoie une valeur redimensionné selon les borne min et max définies
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */ 
	rnd31: function(nMin, nMax) {
		var nRnd = this.rndSeed31(16807 * this.nRndSeed);
		if (nMin === undefined) {
			return nRnd;
		} else {
			return nRnd * (nMax - nMin + 1) / 2147483647 + nMin | 0;
		}
	},
	
	
	/**
	 * Générateur aléatoire standar de JS
	 * Si aucun paramètre n'est spécifié, renvoie un nombre floatant entre 0 et 1
	 * si non renvoie un nombre entier entre les bornes spécifiées
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int / float
	 */
	rndJS: function(nMin, nMax) {
		var fRnd = Math.random();
		if (nMin === undefined) {
			return fRnd;
		} else {
			return (fRnd * (nMax - nMin + 1) | 0) + nMin;
		}
	},

	/**
	 * Fonction abstraite 
	 * nombre aléatoire entre deux bornes
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd : null,
	
	benchmarkRnd: function() {
		var x, i, a = [];
		console.time('rnd js');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd js');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);

		a = [];
		console.time('rnd 31');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd31(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd 31');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
	},

	// Relance plusieur fois un dé, aditionne et renvoie les résultats
	rollDice : function(nFaces, nCount) {
		if (nCount > 3) {
			return (nCount - 3) * ((1 + nFaces) / 2) + MathTools.rollDice(nFaces, 3) | 0;
		}
		var n = 0;
		for ( var i = 0; i < nCount; i++) {
			n += MathTools.rnd(1, nFaces);
		}
		return n;
	},

	// Choix d'un éléments dans un tableau
	rndChoose : function(a) {
		if (a.length) {
			return a[MathTools.rnd(0, a.length - 1)];
		} else {
			return null;
		}
	},

	// Converti n (decimal) en base 64 
	base64Encode : function(n, l) {
		var s = '';
		if (l === undefined) {
			l = 0;
		}
		while (n > 0) {
			s = MathTools.sBASE64.charAt(n & 63) + s;
			l--;
			n >>= 6;
		}
		while (l > 0) {
			s = 'A' + s;
			l--;
		}
		return s;
	},

	base64Decode : function(s64) {
		var n = 0, nLen = s64.length;
		for ( var i = 0; i < nLen; i++) {
			n = (n << 6) | MathTools.sBASE64.indexOf(s64.charAt(i));
		}
		return n;
	}
};


MathTools.rnd = MathTools.rndJS;