/**
 * L'UI System regroupe les interfaces graphiques exclusives Il ne peut y en
 * avoir qu'une seule à l'écran à la fois. Ces interfaces peuvent réagir à
 * certaines touches du clavier
 */
O2.createClass('UI.System', {
	oScreen : null, // Ecran principal des fenêtre
	oRenderContext : null,
	oRenderCanvas : null,

	oWidgets : null,
	oWidget : null,

	bEventsDefined : false,
	bVisible: false,

	__construct : function() {
		this.oScreen = new UI.Screen();
		this.oScreen.hide();
	},

	show: function() {
		this.oScreen.show();
		this.listenToMouseEvents(this.oRenderCanvas);
	},

	hide: function() {
		this.oScreen.hide();
		this.deafToMouseEvents(this.oRenderCanvas);
	},

	isVisible: function() {
		return this.oScreen.isVisible();
	},

	/**
	 * Destruction de tous les widgets
	 */
	clear : function() {
		while (this.oScreen.getControlCount()) {
			this.oScreen.unlinkControl(0);
		}
		this.oWidget = null;
	},

	/**
	 * Positionne un widget au centre de l'écran
	 * 
	 * @param w
	 *            Widget
	 */
	centerWidget : function(w) {
		w.moveTo((this.oScreen._nWidth - w._nWidth) >> 1, (this.oScreen._nHeight - w._nHeight) >> 1);
	},

	cornerWidget : function(w, nCorner, nMargin) {
		var xLeft = nMargin;
		var yTop = nMargin;
		var xCenter = (this.oScreen._nWidth - w._nWidth) >> 1;
		var yCenter = (this.oScreen._nHeight - w._nHeight) >> 1;
		var xRight = this.oScreen._nWidth - w._nWidth - nMargin;
		var yBottom = this.oScreen._nHeight - w._nHeight - nMargin;
		switch (nCorner) {
		case 1:
			w.moveTo(xLeft, yBottom);
			break;
		case 2:
			w.moveTo(xCenter, yBottom);
			break;
		case 3:
			w.moveTo(xRight, yBottom);
			break;
		case 4:
			w.moveTo(xLeft, yCenter);
			break;
		case 5:
			w.moveTo(xCenter, yCenter);
			break;
		case 6:
			w.moveTo(xRight, yCenter);
			break;
		case 7:
			w.moveTo(xLeft, yTop);
			break;
		case 8:
			w.moveTo(xCenter, yTop);
			break;
		case 9:
			w.moveTo(xRight, yTop);
			break;
		}
	},

	/**
	 * définition du widget principal suuppression d'un eventuel precedent
	 * widget
	 * 
	 * @param w
	 *            widget UI.Window
	 */
	declareWidget : function(w) {
		if (this.oWidget) {
			this.clear();
		}
		this.oWidget = w;
		this.oScreen.linkControl(w);
		this.oScreen.show();
		this.oScreen.invalidate();
		return w;
	},

	getWidget : function() {
		return this.oWidget;
	},

	/**
	 * Défini le canvas de rendu
	 * @param oCanvas HTMLCAnvasElement
	 */
	setRenderCanvas : function(oCanvas) {
		this.oRenderCanvas = oCanvas;
		this.oRenderContext = oCanvas.getContext('2d');
		if (!('__ratio' in this.oRenderCanvas)) {
			this.oRenderCanvas.__ratio = 1;
		}
		this.oScreen.setSize(oCanvas.width, oCanvas.height);
		if (this.oWidget) {
			this.centerWidget(this.oWidget);
		}
	},

	getRenderCanvas: function() {
		return this.oRenderCanvas;
	},

	eventScreenClick : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('click', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenDblClick : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('dblclick', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseMove : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('mousemove', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseDown : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('mousedown', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseUp : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('mouseup', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenDOMMouseScroll : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		var nDelta = 0;
		if ('wheelDelta' in e) {
			nDelta = e.wheelDelta;
		} else if ('detail' in e) {
			nDelta = -40 * e.detail;
		} else {
			throw new Error('WTF cant read wheel movement data !!!');
		}
		if (nDelta > 0) {
			oThis.doMouseEvent('mousewheelup', x - oThis._x, y - oThis._y, nDelta);
		} else if (nDelta < 0){
			oThis.doMouseEvent('mousewheeldown', x - oThis._x, y - oThis._y, nDelta);
		}
	},

	/**
	 * Calcule la position d'un élément par rapport au coin superieur gauche de
	 * la fenêtre du navigateur Cette fonction n'existe pas sur firefox.
	 * 
	 * @param oElement
	 *            élément dont on cherche la position
	 * @return array of int
	 */
	getElementPos : function(oElement) {
		var x = 0;
		var y = 0;
		if (oElement.offsetParent) {
			do {
				x += oElement.offsetLeft;
				y += oElement.offsetTop;
			} while (oElement = oElement.offsetParent);
		}
		return [ x, y ];
	},

	listenToMouseEvents : function(oCanvas) {
		if (this.bEventsDefined) {
			return;
		}
		oCanvas.__this = this.oScreen;
		document.oncontextmenu = function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};

		// On considère que le canvas principal contient deux propriétés __x et
		// __y permettant de connaitre sa position
		// Ces propriétés sont mise à jour dans le window.onresize defini dans
		// main.js
		// Cette technique permet sur firefox d'obtenir le point cliqué par
		// rapport au debut du canvas

		var xy = this.getElementPos(oCanvas);
		oCanvas.__x = xy[0];
		oCanvas.__y = xy[1];

		oCanvas.addEventListener('click', this.eventScreenClick, false);
		oCanvas.addEventListener('dblclick', this.eventScreenDblClick, false);
		oCanvas.addEventListener('mousemove', this.eventScreenMouseMove, false);
		oCanvas.addEventListener('mousedown', this.eventScreenMouseDown, false);
		oCanvas.addEventListener('mouseup', this.eventScreenMouseUp, false);
		oCanvas.addEventListener('DOMMouseScroll', this.eventScreenDOMMouseScroll, false);
		oCanvas.addEventListener('mousewheel', this.eventScreenDOMMouseScroll, false);
		this.bEventsDefined = true;
	},

	deafToMouseEvents : function(oCanvas) {
		if (!this.bEventsDefined) {
			return;
		}
		oCanvas.removeEventListener('click', this.eventScreenClick, false);
		oCanvas.removeEventListener('dblclick', this.eventScreenDblClick, false);
		oCanvas.removeEventListener('mousemove', this.eventScreenMouseMove, false);
		oCanvas.removeEventListener('mousedown', this.eventScreenMouseDown, false);
		oCanvas.removeEventListener('mouseup', this.eventScreenMouseUp, false);
		oCanvas.removeEventListener('DOMMouseScroll', this.eventScreenDOMMouseScroll, false);
		oCanvas.removeEventListener('mousewheel', this.eventScreenDOMMouseScroll, false);
		oCanvas.oncontextmenu = null;
		delete oCanvas.__this;
		this.bEventsDefined = false;
	},

	render : function() {
		if (!this.isVisible()) {
			return;
		}
		// check moz maximize / minimize bug
		var c = this.oRenderCanvas;
		if (c.__mozMaximizeCheck) {
			var xy = this.getElementPos(c);
			c.__x = xy[0];
			c.__y = xy[1];
			c.__mozMaximizeCheck = false;
		}
		this.oScreen.render();
		this.oRenderContext.drawImage(this.oScreen._oCanvas, 0, 0);
	}
});
