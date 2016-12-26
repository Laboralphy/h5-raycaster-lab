O2.createClass('Snail', {
	DATA : [
		[80, 49, 50, 51,52,	53,	54,	55,	56],
		[79, 48, 25, 26,27,	28,	29,	30,	57],
		[78, 47, 24, 9,	10,	11,	12,	31,	58],
		[77, 46, 23, 8,	1,	2,	13,	32,	59],
		[76, 45, 22, 7,	0,	3,	14,	33,	60],
		[75, 44, 21, 6,	5,	4,	15,	34,	61],
		[74, 43, 20, 19,18,	17,	16,	35,	62],
		[73, 42, 41, 40,39,	38,	37,	36,	63],
		[72, 71, 70, 69,68,	67,	66,	65,	64]
	];

	SNAIL: null,

	__construct() {
		var x, y;
		var r = [];
		for (y = 0; y < DATA.length; ++y) {
			for (x = 0; x < DATA[y].length; ++x) {
				r[DATA[y][x]] = [x - 4, y - 4];
			}
		}
		this.SNAIL = r;
	},

	function getSnail(n) {
		var SNAIL = this.SNAIL;
		if (n < SNAIL.length) {
			return SNAIL[n];
		} else {
			throw new Error('snail out');
		}
	}
});
