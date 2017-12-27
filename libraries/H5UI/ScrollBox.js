/**
 * Ce composant est une surface qui peut afficher une partie d'une surface plus
 * grande que lui. On appellera "conteneur interne" le composant de grande
 * taille dont on affiche une partie. On utilise des methode de scroll pour
 * déplacer la fenetre d'affichage afin de voir d'autre parties du container
 * interne. Le conteneur interne se redimensionne en fonction de la taille et de
 * la position des objets qu'il contient.
 */
O2.extendClass('H5UI.ScrollBox', 'H5UI.WinControl', {
	_sClass : 'ScrollBox',
	_oContainer : null,
	_xScroll : 0,
	_yScroll : 0,
	_bgColor: '',

	/**
	 * Methode modifiée qui linke le controle transmis en paramètre directement
	 * dans le conteneur interne
	 * 
	 * @param o
	 *            control à linker
	 * @param bParent, -
	 *            true: on link le controle sur la scrollbox (ce control ne se
	 *            déplacera donc pas par scrolling puisse qu'il ne fera pas
	 *            partie du conteneur inter. - false: on link le controle dans
	 *            le conteneur interne, le controle sera sujet au scrolling le
	 *            conteneur interne s'agrrandi en cas de besoin
	 */
	linkControl : function(o, bParent) {
		if (bParent === undefined) {
			bParent = false;
		}
		if (bParent) {
			__inherited(o);
		} else {
			this.getContainer().linkControl(o);
			o.invalidate();
		}
		return o;
	},

	clear: function() {
		this.getContainer().clear();
	},

	/**
	 * Renvoie l'instance du controleur interne Construit le conteneur interne
	 * on the fly en cas de besoin
	 * 
	 * @return ScrollBoxContainer
	 */
	getContainer : function() {
		if (this._oContainer === null) {
			this._oContainer = this.linkControl(new H5UI.ScrollBoxContainer(), true);
		}
		return this._oContainer;
	},

	/**
	 * Déplace la position de scrolling
	 * 
	 * @param x nouvelle position de scroll
	 * @param y nouvelle position de scroll
	 */
	scrollTo : function(x, y) {
		if (x != this._xScroll || y != this._yScroll) {
			var yContSize = this.getContainer().height();
			var yThisSize = this.height();
			var yMax = Math.max(0, yContSize - yThisSize);
			var xContSize = this.getContainer().width();
			var xThisSize = this.width();
			var xMax = Math.max(0, xContSize - xThisSize);
			this._xScroll = x = Math.max(0, Math.min(x, xMax));
			this._yScroll = y = Math.max(0, Math.min(y, yMax));
			this.getContainer().moveTo(-x, -y);
			if (this.getContainer()._bInvalid) {
				this.invalidate();
			}
		}
	},

	/**
	 * Renvoie la position X de la fenetre d'affichage
	 * 
	 * @return int (pixels)
	 */
	getScrollX : function() {
		return this._xScroll;
	},

	/**
	 * Renvoie la position Y de la fenetre d'affichage
	 * 
	 * @return int (pixels)
	 */
	getScrollY : function() {
		return this._yScroll;
	},

	/**
	 * Couleur de fond
	 */
	setColor: function(sColor) {
		this._set('_bgColor', sColor);
	},

	// la première errer de non transmission d'évènement souris était du a une
	// Height mal calculée
	// cette deuxième erreur est également du au fait d'une mauvaise redimension
	// de controle

	renderSelf : function() {
		// Le container doit être assez grand pour tout contenir
		var w = 0, h = 0, o;
		var c = this.getContainer();
		for ( var i = 0; i < c._aControls.length; i++) {
			o = c.getControl(i);
			w = Math.max(w, o._x + o.width());
			h = Math.max(h, o._y + o.height());
		}
		c.setSize(w, h);
		if (this._bgColor) {
			var s = this.getSurface();
			var sColor = s.fillStyle;
			s.fillStyle = this._bgColor;
			s.fillRect(0, 0, this.width(), this.height());
			s.fillStyle = sColor;
		} else {
			this.getSurface().clearRect(0, 0, this.width(), this.height());
		}
	}
});
