/** L'UI System regroupe les interfaces graphiques exclusives
 * Il ne peut y en avoir qu'une seule à l'écran à la fois.
 * Ces interfaces peuvent réagir à certaines touches du clavier
 */
O2.createClass('UI.System', {
	oScreen: null,    // Ecran principal des fenêtre
	oRenderContext: null,
	oRenderCanvas: null,
	
	oWidgets: null,
	oWidget: null,
	
	sScreen: 0,
	
	oPlugins: null,
	
	bEventsDefined: false,
	
	
	__construct: function() {
		this.oScreen = new UI.Screen();
		this.oPlugins = UI.oPlugins;
	},
	
	/** Destruction de tous les widgets
	 * 
	 */
	clear: function() {
		while (this.oScreen.getControlCount()) {
			this.oScreen.unlinkControl(0);
		}
		this.oWidget = null;
	},
	
	
	/** Positionne un widget au centre de l'écran
	 * @param w Widget
	 */
	centerWidget: function(w) {
		w.moveTo((this.oScreen._nWidth - w._nWidth) >> 1, (this.oScreen._nHeight - w._nHeight) >> 1);
	},
	
	cornerWidget: function(w, nCorner, nMargin) {
		var xLeft = nMargin;
		var yTop = nMargin;
		var xCenter = (this.oScreen._nWidth - w._nWidth) >> 1;
		var yCenter = (this.oScreen._nHeight - w._nHeight) >> 1;
		var xRight =  this.oScreen._nWidth - w._nWidth - nMargin;
		var yBottom = this.oScreen._nHeight - w._nHeight - nMargin;
		switch (nCorner) {
			case 1: w.moveTo(xLeft, yBottom); break;
			case 2:	w.moveTo(xCenter, yBottom); break;
			case 3:	w.moveTo(xRight, yBottom); break;
			case 4: w.moveTo(xLeft, yCenter); break;
			case 5:	w.moveTo(xCenter, yCenter); break;
			case 6:	w.moveTo(xRight, yCenter); break;
			case 7: w.moveTo(xLeft, yTop); break;
			case 8:	w.moveTo(xCenter, yTop); break;
			case 9:	w.moveTo(xRight, yTop); break;
		}
	},
	
	
	declareWidget: function(w) {
		if (this.oWidget) {
			this.clear();
		}
		this.oWidget = w;
		this.oScreen.linkControl(w);
		this.oScreen.show();
		return w;
	},
	
	getWidget: function() {
		return this.oWidget;
	},
	
	setRenderCanvas: function(oCanvas) {
		this.oRenderCanvas = oCanvas;
		this.oRenderContext = oCanvas.getContext('2d');
		if (!('__ratio' in this.oRenderCanvas)) {
			this.oRenderCanvas.__ratio = 1;
		}
		this.oScreen.setSize(oCanvas.width, oCanvas.height);
		this.oScreen.hide();
	},
	
	eventScreenClick: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('Click', x - oThis._x, y - oThis._y,
				e.which);
	},
	
	eventScreenDblClick: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('Dblclick', x - oThis._x, y - oThis._y,
				e.which);
	},
	
	eventScreenMouseMove: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseMove', x - oThis._x, y - oThis._y,
				e.which);
	},
	
	eventScreenMouseDown: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseDown', x - oThis._x, y - oThis._y,
				e.which);
	},
	
	eventScreenMouseUp: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseUp', x - oThis._x, y - oThis._y,
				e.which);
	},
	
	eventScreenDOMMouseScroll: function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		var nDelta = 0;
		if (e.wheelDelta) {
			nDelta = e.wheelDelta; 
		} else {
			nDelta = -40 * e.detail;
		}
		if (nDelta > 0) {
			oThis.doMouseEvent('MouseWheelUp', x - oThis._x, y - oThis._y,
				e.which);
		} else {
			oThis.doMouseEvent('MouseWheelDown', x - oThis._x, y - oThis._y,
					e.which);
		}
	},

	listenToMouseEvents: function(oCanvas) {
		if (this.bEventsDefined) {
			return;
		}
		oCanvas.__this = this.oScreen;
		oCanvas.oncontextmenu = function(e) {
			return false;
		};
		
		// On considère que le canvas principal contient deux propriétés __x et __y permettant de connaitre sa position
		// Ces propriétés sont mise à jour dans le window.onresize defini dans main.js
		// Cette technique permet sur firefox d'obtenir le point cliqué par rapport au debut du canvas
		
		oCanvas.addEventListener('click', this.eventScreenClick, false);
		oCanvas.addEventListener('dblclick', this.eventScreenDblClick, false);
		oCanvas.addEventListener('mousemove', this.eventScreenMouseMove, false);
		oCanvas.addEventListener('mousedown', this.eventScreenMouseDown, false);
		oCanvas.addEventListener('mouseup', this.eventScreenMouseUp, false);
		oCanvas.addEventListener('DOMMouseScroll', this.eventScreenDOMMouseScroll, false);
		oCanvas.addEventListener('mousewheel', this.eventScreenDOMMouseScroll, false);
		this.bEventsDefined = true;
	},
	
	deafToMouseEvents: function(oCanvas) {
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
	
	
	
	render: function() {
		// Ecrans fenêtré
		if (this.oScreen.needRender()) {
			this.oScreen.render();
			this.oRenderContext.drawImage(this.oScreen._oCanvas, 0, 0);
		}
	},
	
	setScreen: function(sScreen) {
		this.sScreen = sScreen;
		var sCmdProc = 'cmd' + sScreen;
		if (sCmdProc in this) {
			this.commandProc = this[sCmdProc];
		} else {
			throw new Error('Unknown UI Command');
		}
	},
	
	/** Donne des ordres à l'interface graphique
	 * @param sCommand commande
	 * @param oParam paramètre de la commande
	 * 
	 * command('Loading', 'set', {max: 100, caption: 'patientez', n: 33});
	 * -> donne l'ordre à l'UI d'afficher la barre de progression de chargement
	 * avec un caption 'patientez', un maximum de 100 unité et une barre de 33 unité de longueur
	 * pour traduire ici par exemple, la progression d'un chargement à 33%
	 * 
	 * 
	 */
	command: function(sScreen, sCommand, oParams) {
		if (sScreen !== '' && sScreen != this.sScreen) {
			this.setScreen(sScreen);
		}
		if (this.commandProc) {
			return this.commandProc(sCommand, oParams);
		}
	},
	
	
	commandProc: null,

	
	/** L'interface affiche une progression de chargement
	 * @param sCommand
	 *   "max" + int       : défini l'échelle max de la barre de progression
	 *   "caption" + str   : défini le caption affiché dans la barre de progression
	 *   "n" + int         : défini la proportion de la barre de progression par rapport à l'échelle max
	 *   "set" + obj       : défini les 3 paramètres en mêem temps dans un objet de paramétrage
	 */
	cmdLoading: function(sCommand, xParams) {
		if (this.getWidget() === null) {
			this.centerWidget(this.declareWidget(new UI.LoadingWindow()));
		}
		this.oScreen.fAlpha = 0.2;
		var w = this.getWidget().getProgressBar();
		switch (sCommand) {
			case 'set': // définir les 3 paramètre d'un coup
				w.setMax(xParams.max);
				w.setCaption(xParams.caption);
				w.setProgress(xParams.n);
				break;
		}
	},
	
	cmdMainmenu: function(sCommand, xParams) {
		var i;
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre
				this.clear();
				this.cornerWidget(this.declareWidget(new UI.MainMenuWindow(xParams)), 2, 32);
				this.oScreen.fAlpha = 0;
				this.oScreen.show();
				break;

			case 'select': // Sélection de l'option
				i = this.getWidget().iSelect;
				this.getWidget().iSelect = -1; // reinit apres lecture
				return i;
		}
	},
	
	cmdConfig: function(sCommand, xParams) {
		switch (sCommand) {
			case 'on': // Ouverture de la fenetre
				this.clear();
				this.cornerWidget(this.declareWidget(new UI.ConfigWindow(xParams)), 2, 16);
				this.oScreen.fAlpha = 0;
				this.oScreen.show();
				break;
		}
	}
});
