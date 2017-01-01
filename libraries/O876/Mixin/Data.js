/**
 * good to GIT
 */
O2.createClass('O876.Mixin.Data', {
	
	mixin: function(p) {
		p.extendPrototype({
		
			_DataContainer: null,

			setData: function(s, v) {
				return this.data(s, v);
			},

			getData: function(s) {
				return this.data(s);
			},
			
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
