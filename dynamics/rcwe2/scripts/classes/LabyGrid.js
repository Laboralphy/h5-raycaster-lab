O2.extendClass('RCWE.LabyGrid', RCWE.Window, {
	
	oCanvas: null,
	oContext: null,
	
	wCell: 32,
	bStartDrag: false,
	
	aGrid: null,
	oSelect: null,
	oLastDrawed: null,
	
	xLastClick: 0,
	yLastClick: 0,

	onDraw: null,
	onDrawOver: null,
	onclick: null,
	
	aUndo: null, // undo stack
	aClipBoard: null, // clipboard
	
	/**
	 * builds the DOM structure
	 */
	build: function() {
		this.aUndo = [];
		
		__inherited('World grid');
		
		
		var $oCanvas = $('<canvas></canvas>');
		
		this.oCanvas = $oCanvas.get(0);
		this.oContext = this.oCanvas.getContext('2d');
		
		
		this.oSelect = {
			x1: null,
			y1: null,
			x2: null,
			y2: null
		};
		this.oLastDrawed = {
			x1: null,
			y1: null,
			x2: null,
			y2: null
		};

		
		var c = this.getBody();

		var $oScrollZone = $('<div></div>');
		$oScrollZone.css({
			'height': '100%',
			'overflow': 'scroll'
		});
		this.oScrollZone = $oScrollZone;
		c.append($oScrollZone);
		$oScrollZone.append($oCanvas);
		this.aGrid = [];
		
		this.addCommand('◰+', 'increase the world size', this.cmd_sizeInc.bind(this));
		this.addCommand('◰-', 'decrease the world size', this.cmd_sizeDec.bind(this));
		
		$oCanvas.disableSelection();
		$oCanvas.bind('mousedown', this.cmd_mouseDown.bind(this));
		$oCanvas.bind('mousemove', this.cmd_mouseMove.bind(this));
		$oCanvas.bind('mouseup', this.cmd_mouseUp.bind(this));
	},

	/**
	 * Return the size of the grid
	 * Note : The grid is allways squared sized
	 * @return int
	 */
	getGridSize: function() {
		return this.aGrid.length;
	},
	
	/**
	 * Set the selected region
	 * @param x1 coordinates of the top-left corner of the selected region
	 * @param y1 coordinates of the top-left corner of the selected region
	 * @param x2 coordinates of the bottom-right corner of the selected region
	 * @param y2 coordinates of the bottom-right corner of the selected region
	 */
	setSelect: function(x1, y1, x2, y2) {
		var s = this.oSelect;
		var n = this.getGridSize() - 1;
		s.x1 = Math.max(0, Math.min(n, x1));
		s.y1 = Math.max(0, Math.min(n, y1));
		s.x2 = Math.max(0, Math.min(n, x2));
		s.y2 = Math.max(0, Math.min(n, y2));
	},
	
	/**
	 * Set the size of each cell (in pixels)
	 * @param w size
	 */
	setCellSize: function(w) {
		this.wCell = w;
		this.oCanvas.height = this.oCanvas.width = w * this.wCell;
	},

	/**
	 * set a new grid size (number of cells)
	 * if the grid is enlarged, the new cells will have a value of 0
	 * if the grid shrinks, the remaining cells won't lose their value
	 * @param w new size
	 */
	setGridSize: function(w) {
		if (w < 1 || w > 100) {
			return;
		}
		var aNewRow, aNew = [];
		var aOld = this.aGrid;
		var x, y;
		for (y = 0; y < w; ++y) {
			aNewRow = [];
			for (x = 0; x < w; ++x) {
				if (y < aOld.length && x < aOld[y].length) {
					aNewRow.push(aOld[y][x]);
				} else {
					aNewRow.push(0);
				}
			}
			aNew.push(aNewRow);
		}
		this.aGrid = aNew;
		this.oCanvas.height = this.oCanvas.width = w * this.wCell;
	},

	/**
	 * redraw the entire grid
	 * events onDraw and onDrawOver are triggered
	 */
	redraw: function(xf, yf, xt, yt) {
		var g = this.aGrid;
		var w = g.length;
		var s = this.oSelect;
		var x, y;
		var bRegion = xf !== undefined;
		var xmin, xmax, ymin, ymax;
		if (bRegion) {
			xmin = Math.min(xf, xt);
			xmax = Math.max(xf, xt);
			ymin = Math.min(yf, yt);
			ymax = Math.max(yf, yt);
		} else {
			xmin = 0;
			xmax = w - 1; 
			ymin = 0;
			ymax = w - 1; 
		}
		var wTile = this.wCell;
		if (this.onDraw) {
			for (y = ymin; y <= ymax; ++y) {
				for (x = xmin; x <= xmax; ++x) {
					this.onDraw(g[y][x], this.oContext, x * wTile , y * wTile, wTile, wTile);
				}
			}
		}
		if (s.x1 !== null) {
			var x1 = Math.min(s.x1, s.x2);
			var x2 = Math.max(s.x1, s.x2);
			var y1 = Math.min(s.y1, s.y2);
			var y2 = Math.max(s.y1, s.y2);
			this.oContext.fillStyle = 'rgba(0, 0, 192, 0.5)';
			this.oContext.fillRect(wTile * x1, wTile * y1, wTile * (x2 - x1 + 1) - 1, wTile * (y2 - y1 + 1) - 1);
		}
		if (!bRegion && this.onDrawOver) {
			this.onDrawOver(this.oContext);
		}
	},
	
	/**
	 * Set a cell's value
	 * if the given coordinates are out of bounds, nothing happens
	 * @param x cell coordinates
	 * @param y cell coordinates
	 * @param c new cell value
	 */
	setCell: function(x, y, c) {
		var g = this.aGrid;
		if (y >= 0 && y < g.length && x >= 0 && x < g[y].length) {
			g[y][x] = c;
		} 
	},

	/**
	 * Get a cell's value
	 * if the given coordinates are out of bounds, the function returns 0
	 * @param x cell coordinates
	 * @param y cell coordinates
	 * @return cell value
	 */
	getCell: function(x, y) {
		var g = this.aGrid;
		if (y >= 0 && y < g.length && x >= 0 && x < g[y].length) {
			return g[y][x];
		} else {
			return 0
		}
	},
	
	/**
	 * Returns true if a second floor is defined
	 * @return bool
	 */
	hasUpperFloor: function() {
		var x, y, g = this.aGrid;
		for (y = 0; y < g.length; ++y) {
			for (x = 0; x < g[y].length; ++x) {
				if ((g[y][x] & 0xFF00) > 0) {
					return true;
				}
			}
		}
		return false;
	},
	
	/**
	 * Returns a level map.
	 * Uses a given dictionary of meta codes to translate the grid cells codes
	 * into the corresponding code in the dictionary.
	 * @param mc dictionary of metacodes (a simple object)
	 * @return 2D array of whatever the dictionary contains
	 */
	getMap: function(mc, bUpper) {
		var x, y, g = this.aGrid;
		var a = [], aRow, nCode;
		for (y = 0; y < g.length; ++y) {
			aRow = [];
			for (x = 0; x < g[y].length; ++x) {
				nCode = bUpper ? (g[y][x] >> 8) & 0xFF: g[y][x] & 0xFF;
				if (nCode in mc) {
					aRow.push(mc[nCode]);
				} else {
					aRow.push(0);
				}
			}
			a.push(aRow);
		}
		return a;
	},
	
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////
	////// MOUSE EVENTS ////// MOUSE EVENTS ////// MOUSE EVENTS //////

	/**
	 * Triggered when the mouse bouton is pressed
	 * @param oEvent javascript event
	 */
	cmd_mouseDown: function(oEvent) {
		var $target = $(oEvent.target);
		var oTargetPos = $target.position();
		var x = oEvent.pageX - oTargetPos.left;
		var y = oEvent.pageY - oTargetPos.top;
		this.xLastClick = x;
		this.yLastClick = y;
		switch (oEvent.which) {
			case 1: // only left button is handled
				this.oSelect.x2 = this.oSelect.x1 = x / this.wCell | 0;
				this.oSelect.y2 = this.oSelect.y1 = y / this.wCell | 0;
				this.bStartDrag = true;
				this.redraw();
				if (this.onClick) {
					this.onClick(x, y);
				}
				break;
		}
	},
	
	/**
	 * Triggered when the mouse is moved over the canvas
	 * @param oEvent javascript event
	 */
	cmd_mouseMove: function(oEvent) {
		if (this.bStartDrag) {
			var $target = $(oEvent.target);
			var oTargetPos = $target.position();
			var x = oEvent.pageX - oTargetPos.left;
			var y = oEvent.pageY - oTargetPos.top;
			var xc = x / this.wCell | 0;
			var yc = y / this.wCell | 0;
			var s = this.oSelect, ldr = this.oLastDrawed;
			if (xc != s.x2 || yc != s.y2) {
				var oRegion = new RCWE.Region(ldr.x1, ldr.y1, ldr.x2, ldr.y2);
				oRegion.extend(xc, yc);
				s.x2 = xc;
				s.y2 = yc;
				this.redraw(oRegion.xmin, oRegion.ymin, oRegion.xmax, oRegion.ymax);
				ldr.x1 = s.x1;
				ldr.y1 = s.y1;
				ldr.x2 = s.x2;
				ldr.y2 = s.y2;
			}
		}
	},

	/**
	 * Triggered when the mouse bouton is released
	 * @param oEvent javascript event
	 */
	cmd_mouseUp: function(oEvent) {
		this.cmd_mouseMove(oEvent);
		this.bStartDrag = false;
		this.redraw();
	},
	
	/**
	 * Increase the grid size by one row and one column
	 */
	cmd_sizeInc: function() {
		this.setGridSize(this.aGrid.length + 1);
		this.redraw();
	},

	/**
	 * Decrease the grid size by one row and one column
	 */
	cmd_sizeDec: function() {
		this.setGridSize(this.aGrid.length - 1);
		this.redraw();
	},

	
	/**
	 * Copy the selected region into the clipboard
	 * undoable operation
	 */
	cmd_copy: function() {
		this.undoPush();
		var a = this.aUndo.pop();
		var x1 = Math.min(this.oSelect.x1, this.oSelect.x2);
		var y1 = Math.min(this.oSelect.y1, this.oSelect.y2);
		a.forEach(function(i, n, a) {
			i.x -= x1;
			i.y -= y1;
		});
		this.aClipBoard = a;
	},
	
	/**
	 * Paste the clipboard content on the grid, from the selected region top-left corner
	 */
	cmd_paste: function() {
		var a = this.aClipBoard;
		var x1 = Math.min(this.oSelect.x1, this.oSelect.x2);
		var y1 = Math.min(this.oSelect.y1, this.oSelect.y2);
		var ai;
		if (a.length > 0) {
			var xMin = a[0].x + x1, 
				yMin = a[0].y + y1, 
				xMax = a[0].x + x1, 
				yMax = a[0].y + y1;
			for (var i = 0; i < a.length; ++i) {
				ai = a[i];
				xMin = Math.min(xMin, ai.x + x1);
				yMin = Math.min(yMin, ai.y + y1);
				xMax = Math.max(xMax, ai.x + x1);
				yMax = Math.max(yMax, ai.y + y1);
			}
			var oSave = this.oSelect;
			this.oSelect = {
				x1: xMin, 
				y1: yMin,
				x2: xMax,
				y2: yMax
			};
			this.undoPush();
			for (var i = 0; i < a.length; ++i) {
				ai = a[i];
				this.setCell(ai.x + x1, ai.y + y1, ai.c);
			}
			this.oSelect = oSave;
			this.redraw();
		}
	},


	
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	////// DRAW FUNCTIONS ////// DRAW FUNCTIONS ////// DRAW FUNCTIONS //////
	
	/**
	 * For each cells inside the selected region,
	 * a callback function is called.
	 * The grid is redrawn after.
	 * @param pCallback callback function called for each cells
	 * parameters are : x, y, code
	 */
	iterateSelectedBlock: function(pCallback) {
		if (!pCallBack) {
			return;
		}
		var x, y;
		var s = this.oSelect;
		if (s !== null) {
			var x1 = Math.min(s.x1, s.x2);
			var x2 = Math.max(s.x1, s.x2);
			var y1 = Math.min(s.y1, s.y2);
			var y2 = Math.max(s.y1, s.y2);
		
			for (y = y1; y <= y2; ++y) {
				for (x = x1; x <= x2; ++x) {
					this.setCell(x, y, pCallback(x, y, this.getCell(x, y)));
				}
			}
		}
		this.redraw();
	},
	
	/**
	 * Clears the selected cells.
	 * Means that values of the cells are set to 0.
	 * undoable operation
	 */
	clearFullBox: function() {
		this.undoPush();
		this.iterateSelectedBlock(function(x, y, n) { return 0; });
	},
	
	/**
	 * Fill the selected region with the specified code
	 * Only the first floor is affected (see drawUpperFullBox for second floor)
	 * undoable operation
	 * @param nCode new value for selected cells
	 */
	drawFullBox: function(nCode) {
		nCode = nCode | 0;
		this.undoPush();
		this.iterateSelectedBlock(function(x, y, n) { return n & 0xFF00 | nCode; });
	},
	
	/**
	 * Fill the selected region with the specified code
	 * Only the second floor is affected (see drawFullBox for first floor)
	 * undoable operation
	 * @param nCode new value for selected cells
	 */
	drawUpperFullBox: function(nCode) {
		nCode = (nCode | 0) << 8;
		this.undoPush();
		this.iterateSelectedBlock(function(x, y, n) { return n & 0xFF | nCode; });
	},
	
	
	
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////
	////// UNDO FUNCTIONS ////// UNDO FUNCTIONS ////// UNDO FUNCTIONS //////

	/**
	 * Pushes a new grid state onto the undo stack
	 */
	undoPush: function() {
		var a = [];
		this.iterateSelectedBlock(function(x, y, n) { a.push({x: x, y: y, c: n || 0}); return n; });
		this.aUndo.push(a);
	},

	/**
	 * Pop the topmost grid state from the undo stack, and update the grid
	 */
	undoPop: function() {
		var a = this.aUndo.pop();
		var s;
		for (var i in a) {
			s = a[i];
			this.aGrid[s.y][s.x] = s.c;
		}
		this.redraw();
	},
	
	/**
	 * Returns data meant to be serialized
	 */
	serialize: function() {
		return this.aGrid;
	},
	
	/**
	 * get data from serialized stream, and update the grid
	 */
	unserialize: function(a) {
		this.aGrid = a;
		this.setGridSize(this.aGrid.length);
	}
});
