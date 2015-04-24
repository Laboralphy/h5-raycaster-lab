/** Chargement de classe à partir du nom
 * Gère les Namespace.
 */
O2.createClass('O876.ClassLoader', {
	oClasses: null,
	
	__construct: function() {
		this.oClasses = {};
	},
	
	loadClass: function(s) {
		if (s in this.oClasses) {
			return this.oClasses[s];
		}
		var aClass = s.split('.');
		var pBase = window;
		while (aClass.length > 1) {
			pBase = pBase[aClass.shift()];
		}
		var sClass = aClass[0];
		if (sClass in pBase) {
			this.oClasses[s] = pBase[sClass];
			return this.oClasses[s];
		} else {
			return null;
		}
	}
});
