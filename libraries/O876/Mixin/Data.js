/**
 * good to GIT
 */
(function(O2) {

	var DCName = '_DataContainer';

	O2.createClass('O876.Mixin.Data', {
		_DataContainer: null,

		setData: function(s, v) {
			return this.data(s, v);
		},

		getData: function(s) {
			return this.data(s);
		},
		
		data: function(s, v) {
			if (this[DCName] === null) {
				this[DCName] = {};
			}
			var D = this[DCName];
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

	O876.Mixin.Data.prototype[DCName] = null;
})(O2);
