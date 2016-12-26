
/**
 * Scrollbar Barre de défilement horizontal ou vertical
 */
O2.extendClass('H5UI.ScrollBar', H5UI.WinControl, {
	_sClass : 'ScrollBar',
	_sColorBar : '#888',
	_sColorBarBorder : '#222',
	_sColorBackground : '#CCC',

	_nStepCount : 100, // zone couverte par la scrollbar
	_nPosition : 0, // Position de la scrollbar
	_nLength : 20, // Longueur de la scrollbar

	ySize : 0, // Taille en pixel du pad
	yRange : 0, // Zone dans laquelle le pad peut se déplacer
	yPos : 0, // Position du pad

	// Flags internes
	bDragging : false,
	yDragDock : 0,
	yDragging : 0,
	_bDragHandler: true,

	_bVertical : false,

	__construct: function() {
		__inherited();
		// marche plus :'(
		// pas le temps de réparer
		// 2016-12-17
		//this.registerMouseEventHandlers();
	},

	getAxisValue : function(x, y) {
		return this._bVertical ? y : x;
	},

	/**
	 * Définit l'orientation
	 * 
	 * @param n
	 *            1: Vertical, 0: Horizontal
	 */
	setOrientation : function(n) {
		this._bVertical = n != 0;
	},

	/**
	 * Modifie la taille logique de la barre
	 * 
	 * @param n
	 *            Nouvelle taille
	 */
	setStepCount : function(n) {
		this._set('_nStepCount', n);
	},

	/**
	 * Modifie la position logique de la scrollbar
	 * 
	 * @param n
	 *            Nouvelle position
	 */
	setPosition : function(n) {
		if (n < 0) {
			n = 0;
		}
		if ((n + this._nLength) > this._nStepCount) {
			n = this._nStepCount - this._nLength;
		}
		this._set('_nPosition', n);
	},

	/**
	 * Renvoie la position logique de la scrollbar
	 * 
	 * @return entier
	 */
	getPosition : function() {
		return this._nPosition;
	},

	/**
	 * Modifie la longueur logique de la scrollbar Par exemple si la scrollbar
	 * est associé à une zone de texte de 30 lignes affichable, et que cette
	 * zone contient un fichier texte de 500 lignes et qu'on souhaire voir les
	 * lignes 100 à 129. on fait : sb.setStepCount(500); sb.setLength(30);
	 * sb.setPosition(100);
	 */
	setLength : function(n) {
		this._set('_nLength', n);
	},

	/**
	 * Défini une nouvelle position en pixel
	 */
	setPixelPosition : function(y) {
		this.setPosition(y * this._nStepCount / this.getAxisValue(this.width(), this.height()) | 0);
	},

	registerMouseEventHandlers: function() {
		this.on('mousedown', this.onMouseDown.bind(this));
		this.on('mouseup', this.onMouseUp.bind(this));
	},

	// MD Déterminer la zone cliquée
	// Top : Page Up
	// Bottom Page Down
	// Mid : Initier drag du pad

	onMouseDown : function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		y = this.getAxisValue(x, y);
		if (y < this.yPos) {
			// Page Up
			this.setPixelPosition(this.yPos - this.ySize);
			this.doScroll();
		}
		if (y > (this.yPos + this.ySize)) {
			// Page Dn
			this.setPixelPosition(this.yPos + this.ySize);
			this.doScroll();
		}
		if (y >= this.yPos && y <= (this.yPos + this.ySize)) {
			// Start drag
			this.dragStart(x, y, b);
		}
		this.invalidate();
	},

	onMouseUp : function(oEvent) {
		var x = oEvent.x;
		var y = oEvent.y;
		var b = oEvent.button;
		if (this.bDragging) {
			this.bDragging = false;
			this.stopDrag();
		}
	},

	onStartDragging : function(x, y, b) {
		// Start drag
		y = this.getAxisValue(x, y);
		this.yDragging = y;
		this.yDragDock = this.yPos;
	},

	onDragging : function(x, y, b) {
		y = this.getAxisValue(x, y);
		this.setPixelPosition(y - this.yDragging + this.yDragDock);
		this.doScroll();
		this.invalidate();
	},

	onEndDragging : function(x, y, b) {
	},


	doScroll : function() {
		if ('onScroll' in this) {
			this.onScroll();
		}
	},

	renderSelf : function() {
		var s = this.getSurface();
		s.fillStyle = this._sColorBackground;
		s.fillRect(0, 0, this.width(), this.height());
		this.ySize = this._nLength *
				this.getAxisValue(this.width(), this.height()) /
				this._nStepCount | 0;
		this.yRange = this.getAxisValue(this.width(), this.height())
				- this.ySize;
		this.yPos = this._nPosition * this.yRange / (this._nStepCount - this._nLength) | 0;
		s.fillStyle = this._sColorBar;
		s.strokeStyle = this._sColorBarBorder;
		if (this._bVertical) {
			s.fillRect(0, this.yPos, this.width(), this.ySize);
			s.strokeRect(0, this.yPos, this.width(), this.ySize);
		} else {
			s.fillRect(this.yPos, 0, this.ySize, this.height());
			s.strokeRect(0, this.yPos, this.width(), this.ySize);
		}
	}
});
