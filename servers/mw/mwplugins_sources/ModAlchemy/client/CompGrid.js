O2.extendClass('MW.CompGrid', H5UI.TileGrid, {
	
	_aSelectedComp: null,
	_aCounters: null,
	_xCursor: -1,
	
	__construct: function() {
		__inherited();
		this._oTexture = G.oRaycaster.oHorde.oTiles.alchemy_icons.oImage;
		this._nCellWidth = this._nCellHeight = 32;
		this.setGridSize(4, 1, 8);

		this.setCell(0, 0, 0);
		this.setCell(1, 0, 1);
		this.setCell(2, 0, 2);
		this.setCell(3, 0, 3);
		this._aSelectedComp = [0, 0, 0, 0];
	},
	
	redrawEverything: function() {
		this._aInvalidCells = [];
		for (var i = 0; i < this._aCells[0].length; ++i) {
			this._aInvalidCells.push([i, 0]);
		}
		this.invalidate();
	},
	
	onMouseMove: function(x, y, b) {
		var tx = x < 0 ? -1 : x / (this._nCellWidth + this._nCellPadding) | 0;
		if (this._xCursor >= 0) {
			this._aSelectedComp[this._xCursor] &= 0xFE;
		}
		this._xCursor = tx;
		if (this._xCursor >= 0) {
			this._aSelectedComp[this._xCursor] |= 0x01;
		}
		this.redrawEverything();
	},
	
	onMouseOut: function(x, y, b) {
		this.onMouseMove(-1, y, b);
	},

	
	onClick: function(x, y, b) {
		var tx = x / (this._nCellWidth + this._nCellPadding) | 0;
		if (this._aCounters[tx]) { 
			this._aSelectedComp[tx] = this._aSelectedComp[tx] ^ 2;
			this.redrawEverything();
		}
	},
	
	
	renderCell: function(x, y, n) {
		var s = this.getSurface();
		var xCell = x * (this._nCellWidth + this._nCellPadding);
		var yCell = y * (this._nCellHeight + this._nCellPadding);
		switch (this._aSelectedComp[x]) {
			case 1: // highlight
				s.strokeStyle = this._aCounters[x] ? '#06F' : '#800';
				s.strokeRect(xCell, yCell, this._nCellWidth, this._nCellHeight);
				break;
				
			case 2: // selected
				s.fillStyle = '#00A';
				s.fillRect(xCell, yCell, this._nCellWidth, this._nCellHeight);
				break;
				
			case 3:
				s.strokeStyle = '#06F';
				s.fillStyle = '#00A';
				s.fillRect(xCell, yCell, this._nCellWidth, this._nCellHeight);
				s.strokeRect(xCell, yCell, this._nCellWidth, this._nCellHeight);
		}
		__inherited(x, y, n);
		s.font = 'bold 12px monospace';
		s.strokeStyle = '#000';
		var nNum = this._aCounters[x];
		var sNum = nNum.toString();
		var nNumWidth = s.measureText(sNum).width;
		s.fillStyle = nNum ? 'white' : '#F00';
		s.strokeText(sNum, xCell + this._nCellWidth - nNumWidth, this._nCellWidth);
		s.fillText(sNum, xCell + this._nCellWidth - nNumWidth, this._nCellWidth);
	},
});
