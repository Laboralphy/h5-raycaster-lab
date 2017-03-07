/**
 * @class O876.Mixin.Data
 * This is a mixin.
 * It adds custom "data" management functions to an existing prototype
 * it adds "getData", "setData", and "data" methods
 */
O2.createClass('O876.Mixin.Data', {
	
	mixin: function(p) {
		p.extendPrototype({
		
			_DataContainer: null,

            /**
			 * Sets a custom variable
             * @param s variable name
             * @param v new value
             * @returns {*}
             */
			setData: function(s, v) {
				return this.data(s, v);
			},

            /**
			 * Get a previously set value
             * @param s variable name
             * @returns {*}
             */
			getData: function(s) {
				return this.data(s);
			},

            /**
			 * This method is a synthesis between getData and setData
			 * with 2 parameters the setData method will be called
			 * with 1 parameter the getData method will be called
             * @param s variable name
             * @param v (optional) value
             * @returns {*}
             */
			data: function(s, v) {
				if (this._DataContainer === null) {
					this._DataContainer = {};
				}
				var D = this._DataContainer;
				if (v === undefined) { // get data
					if (s === undefined) {
						return D; // getting all data
					} else if (typeof s === 'object') {
						for (var x in s) { // setting many pairs of key values
							D[x] = s[x];
						}
					} else if (s in D) { // getting one key
						return D[s]; // found !
					} else {
						return null; // not found
					}
				} else { // set data
					// setting one pair on key value
					D[s] = v;
				}
				return this;
			}
		});
	}
});
