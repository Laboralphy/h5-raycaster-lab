O2.createClass('O876.Perlin', {

	_rand: null,	// pseudo random generator
	_width: 0,		// tile width
	_height: 0,		// tile height
	_octaves: 0,	// octave counts
	_interpolate: null,	// string : interpolation function. Allowed values are 'cosine', 'linear', defualt is 'cosine'


	__construct: function() {
		this._rand = new O876.Random();
		this.interpolation('cosine');
	},

	/**
	 * Generate white noise on a matrix
	 * @param w matrix width
	 * @param h matrix height
	 * @return matrix
	 */
	generateWhiteNoise: function(w, h) {
		var r, a = [];
		for (var x, y = 0; y < h; ++y) {
			r = []; 
			for (x = 0; x < w; ++x) {
				r.push(this._rand.rand());
			}
			a.push(r);
		}
		return a;
	},

	/**
	 * Linear interpolation
	 * @param x1 minimum
	 * @param x2 maximum
	 * @param alpha value between 0 and 1
	 * @return float, interpolation result
	 */
	linearInterpolate: function(x0, x1, alpha) {
		return x0 * (1 - alpha) + alpha * x1;
	},

	/**
	 * Cosine Interpolation
	 */
	cosineInterpolate: function(x0, x1, mu) {
		var mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
   		return x0 * (1 - mu2) + x1 * mu2;
	},

	/**
	 * selects an interpolation
	 * @param f string | function the new interpolation function
	 * f can be either a string ('cosine', 'linear') or a custom function
	 */
	interpolation: function(f) {
		switch (typeof f) {
			case 'string':
				if ((f + 'Interpolate') in this) {
					this._interpolate = this[f + 'Interpolate'];
				} else {
					throw new Error('only "linear" or "cosine" interpolation');
				}
				return this;
				
			case 'function':
				this._interpolate = f;
				return this;
				
			case 'undefined':
				return this._interpolate;
		}
		return this;
	},

	generateSmoothNoise: function(aBaseNoise, nOctave) {
		var w = aBaseNoise.length;
		var h = aBaseNoise[0].length;
		var aSmoothNoise = [];
		var r;
		var nSamplePeriod = 1 << nOctave;
		var fSampleFreq = 1 / nSamplePeriod;
		var xs = [], ys = []
		var hBlend, vBlend, fTop, fBottom;
		for (var x, y = 0; y < h; ++y) {
      		ys[0] = (y / nSamplePeriod | 0) * nSamplePeriod;
      		ys[1] = (ys[0] + nSamplePeriod) % h;
      		hBlend = (y - ys[0]) * fSampleFreq;
      		r = [];
      		for (x = 0; x < w; ++ x) {
       			xs[0] = (x / nSamplePeriod | 0) * nSamplePeriod;
      			xs[1] = (xs[0] + nSamplePeriod) % w;
      			vBlend = (x - xs[0]) * fSampleFreq;

      			fTop = this._interpolate(aBaseNoise[ys[0]][xs[0]], aBaseNoise[ys[1]][xs[0]], hBlend)
      			fBottom = this._interpolate(aBaseNoise[ys[0]][xs[1]], aBaseNoise[ys[1]][xs[1]], hBlend)
     			
     			r.push(this._interpolate(fTop, fBottom, vBlend));
      		}

      		aSmoothNoise.push(r);
		}
		return aSmoothNoise;
	},

	generatePerlinNoise: function(aBaseNoise, nOctaveCount) {
		var w = aBaseNoise.length;
		var h = aBaseNoise[0].length;
		var aSmoothNoise = [];
		var fPersist = 0.5;

		for (var i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise.push(this.generateSmoothNoise(aBaseNoise, i));
		}

		var aPerlinNoise = [];
		var fAmplitude = 1;
		var fTotalAmp = 0;
		var x, y, r;

		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				r.push(0);
			}
			aPerlinNoise.push(r);
		}

		for (var iOctave = nOctaveCount - 1; iOctave >= 0; --iOctave) {
			fAmplitude *= fPersist;
			fTotalAmp += fAmplitude;

			for (y = 0; y < h; ++y) {
				r = [];
				for (x = 0; x < w; ++x) {
					aPerlinNoise[y][x] += aSmoothNoise[iOctave][y][x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			r = [];
			for (x = 0; x < w; ++x) {
				aPerlinNoise[y][x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	},


	hash: function (a) {
	    a = (a ^ 61) ^ (a >> 16);
	    a = a + (a << 3);
	    a = a ^ (a >> 4);
	    a = a * 0x27d4eb2d;
	    a = a ^ (a >> 15);
    	return a;
    },

	/** 
	 * Calcule le hash d'une région
	 * Permet de choisir une graine aléatoire
	 * et de raccorder seamlessly les région adjacente
	 */
	getPointHash: function(x, y) {
		var xh = this.hash(x).toString().split('');
		var yh = this.hash(y).toString().split('');
		var s = xh.shift() + yh.shift() + '.';
		while (xh.length || yh.length) {
			if (xh.length) {
				s += xh.shift();
			}
			if (yh.length) {
				s += yh.shift();
			}
		}
		return parseFloat(s);
	},

	generate: function(x, y) {
		var _self = this;

		function gwn(xg, yg) {
			var nSeed = _self.getPointHash(xg, yg);
			_self.rand().seed(nSeed);
			return _self.generateWhiteNoise(_self.width(), _self.height());
		}

		function merge33(a33) {
			var h = _self.height();
			var a = [];
			for (var y, ya = 0; ya < 3; ++ya) {
				for (y = 0; y < h; ++y) {
					a.push(a33[ya][0][y].concat(a33[ya][1][y], a33[ya][2][y]));
				}
			}
			return a;
		}

		function extract33(a) {
			var w = _self.width();
			var h = _self.height();
			return a.slice(h, h * 2).map(r => r.slice(w, w * 2));
		}

		var a0 = [
			[gwn(x - 1, y - 1), gwn(x, y - 1), gwn(x + 1, y - 1)],
			[gwn(x - 1, y), gwn(x, y), gwn(x + 1, y)],
			[gwn(x - 1, y + 1), gwn(x, y + 1), gwn(x + 1, y + 1)]
		];

		var a1 = merge33(a0);
		var a2 = this.generatePerlinNoise(a1, this.octaves());
		var a3 = extract33(a2);
		return a3;
	},


	render: function(aNoise, oContext, aPalette) {
		var oRainbow = new O876.Rainbow();
		var aPalette = aPalette || oRainbow.gradient({
			0: '#008',
			49: '#00F',
			50: '#840',
			84: '#0A0',
			85: '#888',
			99: '#FFF'
		});
		var h = aNoise.length, w = aNoise[0].length, pl = aPalette.length;
		var oImageData = oContext.createImageData(w, h);
		var data = oImageData.data;
		var oRainbow = new O876.Rainbow();
		aNoise.forEach(function(r, y) {
			r.forEach(function(p, x) {
				var nOfs = (y * w + x) << 2;
				var rgb = oRainbow.parse(aPalette[p * pl | 0]);
				data[nOfs] = rgb.r;
				data[nOfs + 1] = rgb.g;
				data[nOfs + 2] = rgb.b;
				data[nOfs + 3] = 255;
			});
		});
		oContext.putImageData(oImageData, 0, 0);
	}

});


O2.mixin(O876.Perlin, O876.Mixin.Prop);
