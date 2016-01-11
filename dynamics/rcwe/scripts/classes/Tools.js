O2.createObject('RCWE.Tools', {
	/**
	 * Renvoie le upper code spcifié
	 */
	getUpperCode: function(c) {
		return (c >> 8) & 0xFF; // code12: (c >> 12) & 0xFFF
	},

	/**
	 * Renvoie le lower code spcifié
	 */
	getLowerCode: function(c) {
		return c & 0xFF; // code12: c & 0xFFF
	},
	
	/**
	 * Modifie le upper code spcifié
	 */
	modifyUpperCode: function(c, n) {
		c |= 0;
		n &= 0xFF; // code12: n &= 0xFFF
		return (c & 0x00FF) | n << 8; // code12: (c & 0x000FFF) | ((n & 0xFFF) << 12)
	},

	/**
	 * Modifie le lower code spcifié
	 */
	modifyLowerCode: function(c, n) {
		c |= 0;
		n &= 0xFF; // code12: n &= 0xFFF
		return (c & 0xFF00) | n; // code12: (c & 0xFFF000) | (n & 0xFFF)
	}
	
});
