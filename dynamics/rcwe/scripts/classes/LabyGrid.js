O2.extendClass('RCWE.LabyGrid', RCWE.Window, {
	
	_id: 'labygrid',

	SELECT_STYLE: '',
	sSelectFillStyle: '',
	sSelectStrokeStyle: '',

	oCanvas: null,
	oContext: null,
	
	oTagFactory: null,
	
	wCell: 32,
	bStartDrag: false,
	
	aGrid: null,
	oSelect: null,
	oLastDrawed: null,
	
	xLastClick: 0,
	yLastClick: 0,
	xMouse: 0,
	yMouse: 0,
	xPage: 0,
	yPage: 0,
	// mouse cursor resting system
	// an event triggered once when the mouse cursor rests for about 1/2 second 
	// on the same position on the grid
	xMouseLast: 0,
	yMouseLast: 0,
	bHasRest: false,

	onDraw: null,
	onDrawOver: null,
	onClick: null,
	
	aUndo: null, // undo stack
	aClipBoard: null, // clipboard
	
	oStartingPoint: null,
	aTags: null,
	
	bSelectFlag: true, // true = you can select / false = you cannot select regions
	
	/**
	 * builds the DOM structure
	 */
	build: function() {
		this.aUndo = [];
		this.aTags = Marker.create();
		this.oTagFactory = new RCWE.TagFactory();
		
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
		$oCanvas.css('position', 'relative');
		var $oScrollZone = $('<div></div>');
		$oScrollZone.css({
			'box-sizing': 'border-box',
			'height': '100%',
			'overflow': 'scroll'
		});
		this.oScrollZone = $oScrollZone;
		c.append($oScrollZone);
		$oScrollZone.append($oCanvas);
		this.aGrid = [];
		
		var pCommand = this.cmd_command.bind(this);
		
		this.addCommand('↻', 'Reload the editor and start a new level', this.cmd_new.bind(this));
		this.addCommand('', 'Open a file', this.cmd_load.bind(this));
		this.addCommand('', 'Save current level file', this.cmd_save.bind(this));
		this.addCommandSeparator();
		this.addCommand('▦+', 'Bigger level : increase the grid size', this.cmd_sizeInc.bind(this)); // ◰
		this.addCommand('▦-', 'Smaller level : decrease the grid size', this.cmd_sizeDec.bind(this));
		this.addCommand('◰+', 'Zoom in : increase the cells size', this.cmd_cellSizeInc.bind(this)); // ◰
		this.addCommand('◰-', 'Zoom out : decrease the cells size', this.cmd_cellSizeDec.bind(this));
		this.addCommandSeparator();
		this.addCommand('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="12"><rect x="4" y="4" width="8" height="8" fill="#AAA" stroke="black"/><rect x="0" y="0" width="8" height="8" fill="#CCC" stroke="black"/></svg>', 'Copy the selected region into the clipboard (both floors)', this.cmd_copy.bind(this));
		this.addCommand('<svg xmlns="http://www.w3.org/2000/svg" width="14" height="12"><rect x="0" y="2" width="10" height="12" fill="#888" stroke="black"/><rect x="2" y="0" width="6" height="4" fill="#CCC" stroke="black"/><rect x="2" y="6" width="10" height="6" fill="#FFF" stroke="black"/></svg>', 'Paste the clipboard data on the grid (both floors)', this.cmd_paste.bind(this));
		this.addCommand('↶', 'Undo the last drawing operation on the grid', this.cmd_undo.bind(this));
		this.addCommandSeparator();
		
		// selectable tools
		var $default = this.addCommand('⬚', 'Region selector tool', pCommand, 'mapgrid_cmd_select').addClass('tool selected').data({'command': 'select', 'fill': 'rgba(0, 64, 192, 0.4)', 'stroke': 'rgb(0, 64, 192)'});
		this.addCommand('✎', 'Drawing tool - Paint on the grid (on the selected floor) with the selected block', pCommand, 'mapgrid_cmd_draw').addClass('tool').data({'command': 'draw', 'fill': 'rgba(0, 0, 192, 0.4)', 'stroke': 'rgb(0, 0, 192)'});
		this.addCommandSeparator();
		
		
		this.sSelectFillStyle = $default.data('fill');
		this.sSelectStrokeStyle = $default.data('stroke');

		// selectable floors
		this.addCommand('Lower', 'Draw on the lower floor', pCommand).addClass('floor selected').data('command', 'f1');
		this.addCommand('Upper', 'Draw on the upper floor', pCommand).addClass('floor').data('command', 'f2');
		//this.addCommand('Both', 'Draw on both floors', pCommand).addClass('floor').data('command', 'f12');
		this.addCommandSeparator();

		this.addCommand('⌧', 'Eraser tool - Erase blocks on the selected floor', this.cmd_clear.bind(this));
		this.addCommand('⚑', 'Set tag', this.cmd_setTag.bind(this));
		this.addCommandSeparator();

		// view selector
		this.addCommand('◫', 'Create/Modify Blocks', this.cmd_viewBlock.bind(this)).addClass('view blockbrowser selected');
		this.addCommand('♜', 'Add/Remove Things', this.cmd_viewThing.bind(this)).addClass('view');
		this.addCommand('✜', 'Place the Starting point', this.cmd_viewStartPoint.bind(this)).addClass('view');
		this.addCommand('☀', 'Change Sky and background', this.cmd_viewSky.bind(this)).addClass('view');
		this.addCommand('▶', '3D render', this.cmd_view3D.bind(this)).addClass('view');
		this.addCommandSeparator();
		this.addCommand('⇄', 'Level import/export', this.cmd_viewImpexp.bind(this)).addClass('view');
		this.addCommand('⚠', 'Advanced commands', this.cmd_viewAdvanced.bind(this)).addClass('view');
		// ⚙ options
		// ⚒ build
		// ⚠ admin
		
		

		$oCanvas.disableSelection();
		$oCanvas.bind('mousedown', this.cmd_mouseDown.bind(this));
		$oCanvas.bind('mousemove', this.cmd_mouseMove.bind(this));
		$oCanvas.bind('mouseup', this.cmd_mouseUp.bind(this));
		//$oCanvas.bind('mouseout', this.cmd_mouseOut.bind(this));
		
		window.setInterval(this.cmd_interval.bind(this), 250);
	},
	
	cmd_interval: function() {
		if (this.xMouse == this.xMouseLast && this.yMouse == this.yMouseLast) {
			if (!this.bHasRest) {
				this.doAction('mouserest', this.xMouse, this.yMouse);
				this.bHasRest = true;
			}
		} else {
			if (this.bHasRest) {
				this.bHasRest = false;
				this.doAction('mouseunrest', this.xMouse, this.yMouse);
			}
			this.xMouseLast = this.xMouse;
			this.yMouseLast = this.yMouse;
		}
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
	 * Unselect
	 */
	unselect: function() {
		var a = this.oSelect;
		this.oSelect = {
			x1: null,
			y1: null,
			x2: null,
			y2: null
		};
		if (a.x1 !== null) {
			this.redraw(a.x1, a.y1, a.x2, a.y2);
		}
	},
	
	/**
	 * Set the selected region
	 * @param x1 coordinates of the top-left corner of the selected region
	 * @param y1 coordinates of the top-left corner of the selected region
	 * @param x2 coordinates of the bottom-right corner of the selected region
	 * @param y2 coordinates of the bottom-right corner of the selected region
	 */
	setSelect: function(x1, y1, x2, y2) {
		if (!this.bSelectFlag) {
			return;
		}
		var s = this.oSelect;
		var n = this.getGridSize() - 1;
		s.x1 = Math.max(0, Math.min(n, x1));
		s.y1 = Math.max(0, Math.min(n, y1));
		s.x2 = Math.max(0, Math.min(n, x2));
		s.y2 = Math.max(0, Math.min(n, y2));
	},
	
	setSelectFlag: function(b) {
		this.bSelectFlag = b;
		if (!b) {
			this.unselect();
		}
	},
	
	/**
	 * Set the size of each cell (in pixels)
	 * @param w size
	 */
	setCellSize: function(w) {
		this.wCell = w;
		this.oCanvas.height = this.oCanvas.width = w * this.getGridSize();
		this.oTagFactory.setItemSize(w, w);
	},
	
	/**
	 * Reset the grid content to 0
	 */
	resetGridContent: function() {
		this.aGrid = this.aGrid.map(function(row, y) {
			return row.map(function(cell, x) {
				return 0;
			});
		});
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
		var cx = this.oContext;
		var g = this.aGrid;
		var w = g.length;
		var s = this.oSelect;
		var x, y;
		var bRegion = xf !== undefined;
		var xmin, xmax, ymin, ymax;
		if (bRegion) {
			//console.log('labygrid : redraw region', xf, yf, xt, yt);
			xmin = Math.min(xf, xt);
			xmax = Math.max(xf, xt);
			ymin = Math.min(yf, yt);
			ymax = Math.max(yf, yt);
		} else {
			//console.log('labygrid : redraw all');
			xmin = 0;
			xmax = w - 1; 
			ymin = 0;
			ymax = w - 1; 
		}
		var wTile = this.wCell;
		var pDraw = this.onDraw;
		cx.fillStyle = '#FFFF00';
		cx.strokeStyle = '#000000';
		var sTag, aTags = this.aTags;
		if (pDraw) {
			for (y = ymin; y <= ymax; ++y) {
				if (g[y]) {
					for (x = xmin; x <= xmax; ++x) {
						pDraw(g[y][x], cx, x * wTile , y * wTile, wTile, wTile);
						sTag = Marker.getMarkXY(aTags, x, y);
						if (sTag) {
							cx.drawImage(this.oTagFactory.getFactorizedItem(sTag), x * wTile , y * wTile);
						}
					}
				}
			}
		}
		// drawing starting point
		var sp = this.oStartingPoint;
		if (sp && sp.x !== null && sp.x >= xmin && sp.x <= xmax && sp.y >= ymin && sp.y <= ymax) {
			var w2 = wTile >> 1;
			var w4 = wTile >> 2;
			var w8 = wTile >> 4;
			var spx = sp.x * wTile + w2;
			var spy = sp.y * wTile + w2;
			cx.save();
			cx.beginPath();
			cx.translate(spx, spy);
			cx.rotate(sp.angle);
			cx.strokeStyle = 'red';
			cx.arc(0, 0, w4, 0, Math.PI * 2);
			cx.moveTo(- w2 + 1, 0);
			cx.lineTo(w2 - 2, 0);
			cx.lineTo(w2 - 2 - w8, -w8);
			cx.lineTo(w2 - 2 - w8, w8);
			cx.lineTo(w2 - 2, 0);
			cx.stroke();
			cx.restore();
		}
		// drawing selected region
		if (s.x1 !== null) {
			var x1 = Math.min(s.x1, s.x2);
			var x2 = Math.max(s.x1, s.x2);
			var y1 = Math.min(s.y1, s.y2);
			var y2 = Math.max(s.y1, s.y2);
			cx.lineWidth = 2;
			cx.fillStyle = this.sSelectFillStyle;
			cx.strokeStyle = this.sSelectStrokeStyle;
			cx.fillRect(wTile * x1 + 2, wTile * y1 + 2, wTile * (x2 - x1 + 1) - 4, wTile * (y2 - y1 + 1) - 4);
			cx.strokeRect(wTile * x1 + 2, wTile * y1 + 2, wTile * (x2 - x1 + 1) - 4, wTile * (y2 - y1 + 1) - 4);
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
			return 0;
		}
	},
	
	/**
	 * Return the current selected floor (for drawing operations)
	 * the return values are :
	 * 1 : lower floor
	 * 2 : upper floor
	 * 3 : both floor
	 * @return int
	 */
	getSelectedFloor: function() {
		var sFloor = $('button.floor.selected', this.getToolBar()).data('command');
		switch (sFloor) {
			case 'f1': return 1;
			case 'f2': return 2;
			case 'f12': return 3;
			default: throw new Error('invalid selected floor');
		}
	},
	
	/**
	 * Returns true if a second floor is defined
	 * @return bool
	 */
	hasUpperFloor: function() {
		var x, y, g = this.aGrid;
		var guc = RCWE.Tools.getUpperCode;
		for (y = 0; y < g.length; ++y) {
			for (x = 0; x < g[y].length; ++x) {
				if (guc(g[y][x]) > 0) { 
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
				nCode = bUpper ? RCWE.Tools.getUpperCode(g[y][x]) : RCWE.Tools.getLowerCode(g[y][x]);
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
		var xCell = x / this.wCell | 0;
		var yCell = y / this.wCell | 0;
		switch (oEvent.which) {
			case 1: // only left button is handled
				if (this.bSelectFlag) {
					this.unselect();
					this.oSelect.x2 = this.oSelect.x1 = xCell;
					this.oSelect.y2 = this.oSelect.y1 = yCell;
					this.bStartDrag = true;
					this.redraw(xCell, yCell, xCell, yCell);
				}
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
		var $target = $(oEvent.target);
		var oTargetPos = $target.position();
		var x = oEvent.pageX - oTargetPos.left;
		var y = oEvent.pageY - oTargetPos.top;
		this.xPage = oEvent.pageX;
		this.yPage = oEvent.pageY;
		this.xMouse = x;
		this.yMouse = y;
		if (this.bStartDrag) {
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
		if (this.bSelectFlag) {
			this.bStartDrag = false;
			this.doAction($('button.tool.selected', this.getToolBar()).data('command'));
		}
	},
	
	/**
	 * Triggered when the mouse leave the canvas surface
	 * Selection / Drawing operation must be canceled
	 */
	cmd_mouseOut: function(oEvent) {
		if (this.bSelectFlag) {
			this.unselect();
			this.bStartDrag = false;
		}
	},
	
	/**
	 * Start a new level (by reloading the page)
	 */
	cmd_new: function() {
		if (confirm('Click on "OK" to reload the application and start a new level')) {
			location.reload();
		}
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
	 * Increase the cell grid size by 4 pixels
	 */
	cmd_cellSizeInc: function() {
		this.doAction('cellsize', this.wCell + 4);
	},

	/**
	 * Decrease the cell grid size by 4 pixels
	 */
	cmd_cellSizeDec: function() {
		this.doAction('cellsize', this.wCell - 4);
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
	
	cmd_load: function() {
		this.doAction('load');
	},
	
	cmd_save: function() {
		this.doAction('save');
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

	cmd_undo: function() {
		this.undoPop();
	},
	
	/**
	 * Clear the selected cell value (on the working floor)
	 */
	cmd_clear: function() {
		this.doAction('clear');
	},
	
	cmd_command: function(oEvent) {
		var $button = $(oEvent.target);
		var sCommand = $button.data('command');
		switch (sCommand) {
			case 'select':
			case 'draw':
				this.unselect();
				$('button.tool', this.getToolBar()).removeClass('selected');
				$button.addClass('selected');
				this.sSelectFillStyle = $button.data('fill');
				this.sSelectStrokeStyle = $button.data('stroke');
				break;

			case 'f1':
			case 'f2':
			case 'f12':
				$('button.floor', this.getToolBar()).removeClass('selected');
				$button.addClass('selected');
				this.redraw();
				break;
		}
	},
	
	cmd_selectViewButton: function(b) {
		$('button.view.selected').removeClass('selected');
		$(b).addClass('selected');
	},
	
	cmd_viewBlock: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewblock');
	},

	cmd_viewThing: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewthing');
	},
	
	cmd_viewStartPoint: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewstartpoint');
	},

	cmd_viewSky: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewsky');
	},

	cmd_view3D: function(oEvent) {
		this.doAction('view3d');
	},
	
	cmd_viewImpexp: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewimpexp');
	},

	cmd_viewAdvanced: function(oEvent) {
		this.cmd_selectViewButton(oEvent.target);
		this.doAction('viewadvanced');
	},

	cmd_setTag: function() {
		var s = this.oSelect;
		if (s.x1 === null) {
			W.error('Could not set region tag : no region selected');
			return;
		}
		var sTag = prompt('Enter tag new value for the selected region (empty string = erase tag).', Marker.getMarkXY(this.aTags, s.x1, s.y1));
		if (sTag === null) {
			return;
		}
		Marker.markBlock(this.aTags, s.x1, s.y1, s.x2, s.y2, sTag);
		this.redraw(s.x1, s.y1, s.x2, s.y2);
	},
	
	/**
	 * modify the starting point position to match the upper left corner
	 * of the selected region
	 */
	cmd_setStartPoint: function(x1, y1) {
		if (!this.oStartingPoint) {
			this.oStartingPoint = {
				x: null,
				y: null,
				angle: 0
			};
		} 
		var sp = this.oStartingPoint;		
		sp.x = x1;
		sp.y = y1;
		sp.angle = 0;
		this.doAction('setstart', sp.x, sp.y, sp.angle);
		this.redraw();
	},
	
	cmd_setStartPointAngle: function(fAngle) {
		if (!this.oStartingPoint) {
			return;
		} 
		var sp = this.oStartingPoint;
		sp.angle = sp.angle + fAngle;
		while (sp.angle < 0) {
			sp.angle += Math.PI * 2;
		}
		sp.angle = sp.angle % (Math.PI * 2);
		this.doAction('setstart', sp.x, sp.y, sp.angle);
		this.redraw();
	},
	


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
	iterateSelectedRegion: function(pCallback, bNoRedraw) {
		if (!pCallback) {
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
			if (!bNoRedraw) {
				this.redraw(x1, y1, x2, y2);
			}
		}
	},
	
	/**
	 * For each cells inside the entire grid a callback function is called.
	 * The grid is redrawn after.
	 * @param pCallback callback function called for each cells
	 * parameters are : x, y, code
	 */
	iterateGrid: function(pCallback) {
		if (!pCallback) {
			return;
		}
		var x, y, nSize = this.getGridSize();
		for (y = 0; y <= nSize; ++y) {
			for (x = 0; x <= nSize; ++x) {
				this.setCell(x, y, pCallback(x, y, this.getCell(x, y)));
			}
		}
		this.redraw();
	},
	
	/**
	 * Clears the selected cells.
	 * Means that values of the cells are set to 0.
	 * Affect lower floor only
	 * undoable operation
	 */
	clearFullBox: function() {
		this.undoPush();
		this.iterateSelectedRegion((function(x, y, n) { return RCWE.Tools.modifyLowerCode(n, 0); }).bind(this));
	},
	
	/**
	 * Clears the selected cells.
	 * Means that values of the cells are set to 0.
	 * Affect upper floor only
	 * undoable operation
	 */
	clearUpperFullBox: function() {
		this.undoPush();
		this.iterateSelectedRegion((function(x, y, n) { return RCWE.Tools.modifyUpperCode(n, 0); }).bind(this));
	},
	
	/**
	 * Fill the selected region with the specified code
	 * Only the first floor is affected (see drawUpperFullBox for second floor)
	 * undoable operation
	 * @param nCode new value for selected cells
	 */
	drawFullBox: function(nCode) {
		this.undoPush();
		this.iterateSelectedRegion((function(x, y, n) { return RCWE.Tools.modifyLowerCode(n, nCode); }).bind(this));
	},
	
	/**
	 * Fill the selected region with the specified code
	 * Only the second floor is affected (see drawFullBox for first floor)
	 * undoable operation
	 * @param nCode new value for selected cells
	 */
	drawUpperFullBox: function(nCode) {
		this.undoPush();
		this.iterateSelectedRegion((function(x, y, n) { return RCWE.Tools.modifyUpperCode(n, nCode); }).bind(this));
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
		this.iterateSelectedRegion(function(x, y, n) { a.push({x: x, y: y, c: n || 0}); return n; }, true);
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
		return {
			map: this.aGrid,
			start: this.oStartingPoint,
			tags: Marker.serialize(this.aTags)
		};
	},
	
	shiftGrid_down: function() {
		var nSize = this.getGridSize();
		if (this.aGrid[nSize - 1].some(function(c) {
			return c != 0;
		})) {
			throw new Error('shift error : non zero cell would be out of range');
		}
		var aNew = [];
		for (var i = 0; i < nSize; ++i) {
			aNew.push(0);
		}
		this.aGrid.pop();
		this.aGrid.unshift(aNew);
		var sp = this.oStartingPoint;
		if (sp) {
			++sp.y;
		}
	},

	shiftGrid_up: function() {
		var nSize = this.getGridSize();
		if (this.aGrid[0].some(function(c) {
			return c != 0;
		})) {
			throw new Error('shift error : non zero cell would be out of range');
		}
		var aNew = [];
		for (var i = 0; i < nSize; ++i) {
			aNew.push(0);
		}
		this.aGrid.shift();
		this.aGrid.push(aNew);
		var sp = this.oStartingPoint;
		if (sp) {
			--sp.y;
		}
	},

	shiftGrid_right: function() {
		var nSize = this.getGridSize();
		if (this.aGrid.some(function(r) {
			return r[nSize - 1] != 0;
		})) {
			throw new Error('shift error : non empty cell would be out of range');
		}
		this.aGrid.forEach(function(r) {
			r.pop();
			r.unshift(0);
		});
		var sp = this.oStartingPoint;
		if (sp) {
			++sp.x;
		}
	},

	shiftGrid_left: function() {
		if (this.aGrid.some(function(r) {
			return r[0] != 0;
		})) {
			throw new Error('shift error : non zero cell would be out of range');
		}
		this.aGrid.forEach(function(r) {
			r.shift();
			r.push(0);
		});
		var sp = this.oStartingPoint;
		if (sp) {
			--sp.x;
		}
	},
	
	shiftGrid: function(sDir, n) {
		for (var i = 0; i < n; ++i) {
			this['shiftGrid_' + sDir]();
		}
	},
	
	/**
	 * get data from serialized stream, and update the grid
	 */
	unserialize: function(a) {
		this.aGrid = a.map;
		this.oStartingPoint = a.start;
		this.oCanvas.height = this.oCanvas.width = a.map.length * this.wCell;
		this.aTags = Marker.unserialize(a.tags);
	}
});
