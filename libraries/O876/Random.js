/**
 * a FALSE random very false...
 * generated random numbers, with seed
 * used for predictable landscape generation
 */

O2.createClass('O876.Random', {

	_seed: 1,


	_rand: function() {
		return this._seed = Math.abs(((Math.sin(this._seed) * 1e12) % 1e6) / 1e6);
	},

	rand: function(a, b) {
		var r = this._rand();
		return a === undefined ? r : Math.max(a, Math.min(b, (b - a + 1) * r + a | 0));
	}
});

O2.mixin(O876.Random, O876.Mixin.Prop);