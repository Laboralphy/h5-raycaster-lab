// Block fields manager
O2.createClass('O876_Raycaster.BF',  {
	getCode: function(n) {
		return n & 0xFF;
	},

	modifyCode: function(n, v) {
		return (n & 0xFFFFFF00) | v;
	},
	
	getPhys: function(n) {
		return (n >> 8) & 0xFF;
	},

	modifyPhys: function(n, v) {
		return (n & 0xFFFF00FF) | (v << 8);
	},
	
	getOffs: function(n) {
		return (n >> 16) & 0xFF;
	},

	modifyOffs: function(n) {
		return (n & 0xFF00FFFF) | (v << 16);
	},
});
