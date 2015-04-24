O2.createObject('Marker', {
	
	iterate: function(o, f) {
		o.forEach(function(aRow, x) {
			if (aRow) {
				aRow.forEach(function(v, y) {
					if (v) {
						f(x, y, v);
					}
				});
			}
		});
	},
	
	create: function() {
		return [];
	},
	
	getMarkXY : function(o, x, y) {
		if (o[x]) {
			return o[x][y];
		} else {
			return false;
		}
	},

	markXY : function(o, x, y, v) {
		if (!o[x]) {
			o[x] = Marker.create();
		}
		if (v === undefined) {
			v = true;
		}
		o[x][y] = v;
	},
	
	clearXY : function(o, x, y) {
		if (!o[x]) {
			return;
		}
		o[x][y] = false;
	},


	markBlock : function(o, x1, y1, x2, y2, v) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.markXY(o, x, y, v);
			}
		}
	},
	
	clearBlock : function(o, x1, y1, x2, y2) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.clearXY(o, x, y);
			}
		}
	}
});