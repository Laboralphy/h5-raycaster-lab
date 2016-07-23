/**
 * This class will manage sound ambience events
 * It works well with O876.SoundSystem
 */
O2.createClass('O876.Ambience', {
	
	_nNextTime: 0,
	_bValid: false,

	period: 0,
	variation: 0,
	sounds: null,

	getRandomSound: function() {
		return this.sounds[Math.random() * this.sounds.length | 0];
	},

	load: function(c) {
		this._bValid = true;
		if (c.period <= 0) {
			this._bValid = false;
		}
		if ((!Array.isArray(c.sounds)) || (c.sounds.length == 0)) {
			this._bValid = false;
		}
		if (c.variation < 0) {
			this._bValid = false;
		}
		if (!this._bValid) {
			return false;
		}
		this.period = c.period;
		this.variation = c.variation;
		this.sounds = c.sounds;
		return true;
	},

	isValid: function() {
		return this._bValid;
	},

	nextTime: function() {
		this._nNextTime += this.period + Math.random() * this.variation;
	},

	process: function(nTime) {
		if (!this.isValid()) {
			return;
		}
		if (this.nNextTime === 0) {
			this.nNextTime = nTime;
			this.nextTime();
		}
		if (nTime >= this._nNextTime) {
			this.trigger('sound', { 
				sound: this.getRandomSound(),
				time: this._nNextTime
			});
			this._nNextTime += this.period + Math.random() * this.variation;
		}
	}
});

O2.mixin(O876.Ambience, O876.Mixin.Events);