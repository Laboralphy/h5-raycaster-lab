/**
 * Système de génération de fenètre-mini-site
 * Permettant de créer un petit applicatif fenétré.
 */
O2.createClass('O876.Microsyte', {
	
	_sBlockId: '',
	_oHome: null,
	_oXHR: null,
	_nWidth: 0,
	_nHeight: 0,
	_xOrientation: 'left',
	_yOrientation: 'top',
	
	/**
	 * Constructeur : définition de l'élément block qui accueillera le site
	 * @param sId identifiant du block qui contient le site
	 */
	__construct: function(sId) {
		if (sId) {
			this.setHome(sId);
		}
	},
	
	/**
	 * Définition de l'élément block qui accueillera le site
	 * @param sId identifiant du block qui contient le site
	 */
	setHome: function(xId) {
		if (typeof xId === 'string') {
			this.setHome(document.getElementById(this._sBlockId = xId));
		} else {
			this._oHome = xId;
		}
	},
	
	/**
	 * Renvoie l'élément Home
	 * @throws erreur en cas de non-définition du home
	 */
	getHome: function() {
		if (!this._oHome) {
			throw new Error('home not defined');
		}
		return this._oHome;
	},

	/**
	 * Modifie la taille du Home
	 */
	setSize: function(w, h) {
		var oHome = this.getHome();
		this._nWidth = w;
		this._nHeight = h;
		oHome.style.width = w.toString() + 'px';
		oHome.style.height = h.toString() + 'px';
	},
	
	getPxValue: function(s) {
		var r = s.match(/^([0-9]+)px$/i);
		if (r) {
			return r[1] | 0;
		} else {
			return 0;
		} 
	},
	
	center: function() {
		var oHome = this.getHome();
		var p = this.getPxValue(window.getComputedStyle(oHome).padding);
		var w = -((this._nWidth + p) >> 1);
		var h = -((this._nHeight + p) >> 1);
		oHome.style.left = '50%';
		oHome.style.top = '50%';
		oHome.style.marginTop = h.toString() + 'px';
		oHome.style.marginLeft = w.toString() + 'px';
	},
	
	getSubItem: function(sSubItem) {
		var oTarget = this.getHome();
		if (sSubItem !== undefined && sSubItem !== null && sSubItem !== '') {
			oTarget = document.getElementById(sSubItem);
		}
		if (!oTarget) {
			throw new Error('target item not defined');
		}
		return oTarget;
	},
	
	/**
	 * Modifie le contenu du Home
	 * @param sHtml string nouveau contenu
	 */
	setHtml: function(sHtml, sSubItem) {
		this.getSubItem(sSubItem).innerHTML = sHtml;
	},
	
	/**
	 * Charge un nouveau contenu
	 */
	load: function(sUrl, sSubItem) {
		XHR.get(sUrl, (function(data) {
			this.setHtml(data, sSubItem);
		}).bind(this));
	},
	
	/**
	 * Fermeture de la fenetre du site
	 */
	hide: function() {
		this.getHome().style.display = 'none';
	},

	/**
	 * Réouverture de la fenetre du site
	 */
	show: function() {
		this.getHome().style.display = 'block';
	},
	
	clear: function(sSubItem) {
		this.getSubItem(sSubItem).innerHTML = '';
	},
	
	setLinkOrientation: function(x, y) {
		if (x === 'left' || x === 'right') {
			this._xOrientation = x;
		}
		if (y === 'top' || y === 'bottom') {
			this._xOrientation = y;
		}
	},
	
	linkDiv: function(sHtml, x, y, w, h, sSubItem) {
		var oDiv = this.getSubItem(sSubItem).appendChild(document.createElement('div'));
		oDiv.style.position = 'absolute';
		oDiv.style[this._xOrientation] = x.toString() + 'px';
		oDiv.style[this._yOrientation] = y.toString() + 'px';
		if (w !== undefined && w!== null) {
			oDiv.style.width = w.toString() + 'px';
		}
		if (h !== undefined && h!== null) {
			oDiv.style.height = h.toString() + 'px';
		}
		oDiv.innerHTML = sHtml;
		return oDiv;
	}
});
