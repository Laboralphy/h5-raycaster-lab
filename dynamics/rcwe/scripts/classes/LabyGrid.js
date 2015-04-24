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
	
	oLastRedrawBox: null,
	
	aUndo: null, // tableau d'undo
	aClipBoard: null,
	
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
		
		this.oLastRedrawBox = {
			xf: -1,
			yf: -1,
			xt: -1,
			xt: -1
		};
		
		var c = this.getContainer();

		var $oScrollZone = $('<div></div>');
		$oScrollZone.css({
			'overflow': 'scroll',
			'width': '720px',
			'height': '512px'
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

	
	getSize: function() {
		return this.aGrid.length;
	},
	
	setSelect: function(x1, y1, x2, y2) {
		var s = this.oSelect;
		var n = this.getSize() - 1;
		s.x1 = Math.max(0, Math.min(n, x1));
		s.y1 = Math.max(0, Math.min(n, y1));
		s.x2 = Math.max(0, Math.min(n, x2));
		s.y2 = Math.max(0, Math.min(n, y2));
	},
	
	setCellSize: function(w) {
		this.wCell = w;
		this.oCanvas.height = this.oCanvas.width = w * this.wCell;
	},

	/**
	 * Redimensionne la grille sans toucher aux anciennes valeurs
	 * les nouvelle valeur sont mises à 0
	 */
	setSize: function(w) {
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
	 * redessine la grille à l'écran
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
	
	setCell: function(x, y, c) {
		var g = this.aGrid;
		if (y >= 0 && y < g.length && x >= 0 && x < g[y].length) {
			g[y][x] = c;
		} 
	},

	getCell: function(x, y) {
		var g = this.aGrid;
		if (y >= 0 && y < g.length && x >= 0 && x < g[y].length) {
			return g[y][x];
		} 
	},
	
	/**
	 * Renvoie true si il y a un second étage
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
	 * Renvoie les codes composant la carte (étage inférieur)
	 * Utilise les métacodes spécifié pour traduire les code logique en code physique
	 * @param mc objet associatif code logique -> code physique
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
	
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////
	////// EVENEMENT SOURIS ////// EVENEMENT SOURIS ////// EVENEMENT SOURIS //////

	/**
	 * Déclenché lorsque l'on appuie sur un bouton de la souris
	 */
	cmd_mouseDown: function(oEvent) {
		var $target = $(oEvent.target);
		var oTargetPos = $target.position();
		var x = oEvent.pageX - oTargetPos.left;
		var y = oEvent.pageY - oTargetPos.top;
		this.xLastClick = x;
		this.yLastClick = y;
		switch (oEvent.which) {
			case 1:
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
	 * Déclenché lorsque la souris se déplace sur le canvas
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
	 * Déclenché lorsque l'on relache un bouton de la souris
	 */
	cmd_mouseUp: function(oEvent) {
		this.cmd_mouseMove(oEvent);
		this.bStartDrag = false;
		this.redraw();
	},
	
	/**
	 * Augmentation de la taille de la grille.
	 */
	cmd_sizeInc: function() {
		this.setSize(this.aGrid.length + 1);
		this.redraw();
	},

	/**
	 * Diminution de la taille de la grille.
	 */
	cmd_sizeDec: function() {
		this.setSize(this.aGrid.length - 1);
		this.redraw();
	},

	
	cmd_copy: function(oEvent) {
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
	
	cmd_paste: function(oEvent) {
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
	
	iterateSelectedBlock: function(pCallBack) {
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
					this.setCell(x, y, pCallBack(x, y, this.getCell(x, y)));
				}
			}
		}
		this.redraw();
	},
	
	/**
	 * Supprime tous les block compris dans al zone rectangulaire spécifiée
	 */
	clearFullBox: function() {
		this.undoPush();
		this.iterateSelectedBlock(function(x, y, n) { return 0; });
	},
	
	/**
	 * Dessine une box pleine avec le code spécifié
	 * Seul l'étage inférieur est affecté 
	 * voir drawUpperFullBox pour affecter l'étage supérieur
	 */
	drawFullBox: function(nCode) {
		nCode = nCode | 0;
		this.undoPush();
		this.iterateSelectedBlock(function(x, y, n) { return n & 0xFF00 | nCode; });
	},
	
	/**
	 * Dessine une box pleine avec le code spécifié
	 * Seul l'étage supérieur est affecté 
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
	 * Ajoute un historique à l'undo
	 */
	undoPush: function() {
		var a = [];
		this.iterateSelectedBlock(function(x, y, n) { a.push({x: x, y: y, c: n || 0}); return n; });
		this.aUndo.push(a);
	},

	/**
	 * dépile le dernier historique d'undo et l'applique dans la grille
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
	
	serialize: function() {
		return this.aGrid;
	},
	
	unserialize: function(a) {
		this.aGrid = a;
		this.setSize(this.aGrid.length);
	}

});
