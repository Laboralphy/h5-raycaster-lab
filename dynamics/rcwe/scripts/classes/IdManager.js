/**
 * An object in charge of ID management
 * Provide IDs upon request
 * Recylce IDs of discarded objects
 */
O2.createClass('RCWE.IdManager', {
	_aAvailable: null,
	_nMin: null,
	_nMax: null,
	
	__construct: function() {
		this.reset();
	},
	
	reset: function() {
		this._aAvailable = [];
		if (this._nMin !== null && this._nMax !== null) {
			this.fill(this._nMin, this._nMax);
		}
	},
	
	fill: function(nMin, nMax) {
		this._nMin = nMin;
		this._nMax = nMax;
		for (var i = nMin; i <= nMax; ++i) {
			this._aAvailable.push(i);
		}
	},

	/**
	 * Provide the next available ID
	 */
	pick: function() {
		if (this._aAvailable.length) {
			return this._aAvailable.shift();
		} else {
			throw new Error('no more available ids');
		}
	},
	
	/**
	 * Remove an ID from available id list, making it unavailable
	 */
	remove: function(id) {
		var n = this._aAvailable.indexOf(id);
		if (n < 0) {
			throw new Error('this id is not available for remove : ' + id);
		} else {
			this._aAvailable.splice(n, 1);
		}
	},
	
	/**
	 * Discard an ID making it available for a next pickId call
	 */
	discard: function(id) {
		this._aAvailable.unshift(id);
	}
});

