/**
 * @class O876.Random
 * a FALSE random very false...
 * generated random numbers, with seed
 * used for predictable landscape generation
 */

O2.createClass('O876.Random', {

	_seed: 1,

	__construct: function() {
		this._seed = Math.random();
	},

	seed: function(x) {
    	return this.prop('_seed', x);
	},


	_rand: function() {
		return this._seed = Math.abs(((Math.sin(this._seed) * 1e12) % 1e6) / 1e6);
	},

	rand: function(a, b) {
		var r = this._rand();
		switch (typeof a) {
			case "undefined":
				return r;
				
			case "number":
				if (b === undefined) {
					b = a - 1;
					a = 0;
				}
				return Math.max(a, Math.min(b, (b - a + 1) * r + a | 0));
			
			case "object":
				if (Array.isArray(a)) {
					if (a.length > 0) {
						return a[r * a.length | 0];
					} else {
						return undefined;
					}
				} else {
					return this.rand(Object.keys(a));
				}
				
			default:
				return r;
		}
	}
});

O2.mixin(O876.Random, O876.Mixin.Prop);
