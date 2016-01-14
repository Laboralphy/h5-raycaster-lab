O2.createObject('RCWE.Tools', {
	/**
	 * Renvoie le upper code spcifié
	 */
	getUpperCode: function(c) {
		return (c >> 12) & 0xFFF; // **code12** storey
	},

	/**
	 * Renvoie le lower code spcifié
	 */
	getLowerCode: function(c) {
		return c & 0xFFF; // **code12** storey
	},
	
	/**
	 * Modifie le upper code spcifié
	 */
	modifyUpperCode: function(c, n) {
		c |= 0;
		return (c & 0x000FFF) | ((n & 0xFFF) << 12); // **code12** storey
	},

	/**
	 * Modifie le lower code spcifié
	 */
	modifyLowerCode: function(c, n) {
		c |= 0;
		return (c & 0xFFF000) | (n & 0xFFF); // **code12** storey
	}
	
});
