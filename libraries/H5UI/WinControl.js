/**
 * Controle fenètré graphique de base. Cette classe-souche possède les
 * propriétés et les méthodes de base permettant la représentation graphique
 * d'une zone rectangulaire de l'interface.
 */
O2.createClass('H5UI.WinControl', {
	_sClass : 'WinControl', // Nom indicatif de la classe
	_sName : '', // Nom indicatif du composant
	_nHandle : 0, // Numero de l'instance du controle
	_nIndex : 0, // Rang du controle parmis ses frères (autres enfants de son
	// parent)

	_oParent : null, // Control parent

	// Etat graphique
	_oCanvas : null, // Canvas privé du controle
	_oContext : null, // Contexte 2D du canvas
	_nWidth : 0, // Taille du controle
	_nHeight : 0, // Taille du controle
	_x : 0, // Position du controle
	_y : 0, // Position du controle
	_bInvalid : true, // Flag d'invalidation graphique

	// switches
	_bVisible : true, // Flag de visibilité

	// Controles enfants
	_aControls : null, // Tableau contenant les controles enfants
	_aInvalidControls : null, // Tableau indexant les controles devenus
	// invalides
	_aAlignedControls : null, // Tableau indexant les controles alignés
	// (position/taille change en fonction du
	// parent)
	_aHideControls : null, // Tableau indexant les controles qui passent de
	// l'état visible à invisible

	// évenements
	_oPointedControl : null, // Référence du controle sujet à un drag and
	// drop
	_oDraggedControl : null, // Référence au controle actuellement en cour de
	// drag
	_bDragHandler : false, // Le controle actuel est un gestionnaire de drag
	// and drop

	// CONSTRUCTEUR
	__construct : function() {
		this._nHandle = ++H5UI.handle;
		this._aControls = [];
		this._aInvalidControls = [];
		this._aAlignedControls = {
			center : []
		};
		this._aHideControls = [];
		this.buildSurface();
		this.invalidate();
	},

	// DESTRUCTEUR
	__destruct : function() {
		H5UI.recycleCanvas(this._oCanvas);
		this.clear();
		var aProps = [];
		for ( var i in this) {
			this[i] = null;
			aProps.push(i);
		}
		for (i = 0; i < aProps.length; i++) {
			delete this[aProps[i]];
		}
		aProps = null;
		H5UI.data.destroyedCanvases++;
	},

	/**
	 *  Détruit tous les controles enfant
	 */
	clear : function() {
		while (this.hasControls()) {
			this.unlinkControl(0);
		}
	},

	/**
	 * Methode de construction du canvas
	 * 
	 */
	buildSurface : function() {
		this._oCanvas = H5UI.getCanvas();
		H5UI.data.buildCanvases++;
		this._oContext = this._oCanvas.getContext('2d');
	},

	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */
	/** ************ Métodes privées ************** */

	/**
	 * Fonction protégée de modification de propriété conduisant à une
	 * invalidation
	 * 
	 * @param sProperty
	 *            propritété à modifier
	 * @param xValue
	 *            nouvelle valeur
	 */
	_set : function(sProperty, xValue) {
		if (sProperty in this && this[sProperty] != xValue) {
			this[sProperty] = xValue;
			this.invalidate();
		}
	},

	/**
	 * Réaligne les controles alignés. Un contrôle aligné est un contrôle
	 * fenêtré dont la position dépent de la taille de son parent Pour chaque
	 * controle aligné, lance la méthode de placement correspondant à
	 * l'alignement. Cete méthode à pour préfixe "moveTo" Un réalignement
	 * intervient lorsque le controle parent change de place ou de taille.
	 */
	realignControls : function() {
		var n, a, sDokoMethod;
		for ( var sDoko in this._aAlignedControls) {
			sDokoMethod = 'moveTo' + sDoko.substr(0, 1).toUpperCase() + sDoko.substr(1).toLowerCase();
			a = this._aAlignedControls[sDoko];
			for (n = 0; n < a.length; n++) {
				a[n][sDokoMethod]();
			}
		}
	},

	/**
	 * Permet de définir un control aligné * Utiliser plutôt align() la position
	 * et la taille des les controles alignés sont en fonction de la position et
	 * la taille de leur parent
	 * 
	 * @param oControl
	 *            controle à aligner
	 * @param nDoko
	 *            Où doit etre aligner le controle ('center')
	 */
	registerAlignedControl : function(oControl, sDoko) {
		oControl.render();
		this.unregisterAlignedControl(oControl);
		this.pushArrayItem(this._aAlignedControls[sDoko], oControl);
		this.realignControls();
	},

	/**
	 * Supprime l'alignement forcé du controle
	 * 
	 * @param oControl
	 *            control, dont il faut supprimer l'alignement
	 */
	unregisterAlignedControl : function(oControl) {
		for ( var sDoko in this._aAlignedControls) {
			this.removeArrayItem(this._aAlignedControls[sDoko], oControl);
		}
	},

	/**
	 * Supprime un élément d'un tableau à indice numérique séquentiel la
	 * fonction accepte un indice ou une instance si l'instance se trouve dans
	 * le tableau, on la vire et on décale les objet de manière à combler le
	 * trou
	 * 
	 * @param oArray
	 *            tableau
	 * @param xItem
	 *            indice ou instance de l'élément à virer
	 * @param sIndex
	 *            optionnel, clé de l'index à mettre à jour
	 */
	removeArrayItem : function(oArray, xItem, sIndex) {
		var nItem;
		if (typeof xItem == 'object') {
			nItem = oArray.indexOf(xItem);
			if (nItem < 0) {
				return;
			}
		} else {
			nItem = xItem;
		}
		if (nItem == (oArray.length - 1)) {
			oArray.pop();
		} else {
			oArray[nItem] = oArray.pop();
			if (sIndex !== undefined) {
				oArray[nItem][sIndex] = nItem;
			}
		}
	},

	/**
	 * Méthode utilitaire de stockage d'un élément dans un tableau Permet de
	 * mettre à jour la propriété d'index de l'élément.
	 * 
	 * @param oArray
	 *            tableau
	 * @param oItem
	 *            instance de l'élément à ajouter au tableau
	 * @param sIndex
	 *            optionnel, clé de l'index à mettre à jour
	 * @return item
	 */
	pushArrayItem : function(oArray, oItem, sIndex) {
		var nLen, nItem = oArray.indexOf(oItem);
		if (nItem < 0) {
			nLen = oArray.length;
			if (sIndex !== undefined) {
				oItem[sIndex] = nLen;
			}
			oArray.push(oItem);
			return nLen;
		} else {
			return nItem;
		}
	},

	/**
	 * Place un controle dans la liste des controle à cacher, suite à l'appel
	 * d'un hide()
	 * 
	 * @param oControl
	 *            control qui se cache
	 */
	hideControl : function(oControl) {
		this.pushArrayItem(this._aHideControls, oControl);
	},

	/**
	 * Rend visible un control qui a été caché
	 * 
	 * @param oControl
	 *            controle à rendre visible
	 */
	showControl : function(oControl) {
		this.removeArrayItem(this._aHideControls, oControl);
	},

	/**
	 * Gestion des évènement souris (click, mousein, mouseout, mousemove,
	 * mousedown, mouseup) La méthode exécute une methode déléguée "on....."
	 * puis transmet l'évènement à l'élément pointé par la souris
	 * 
	 * @param sEvent
	 *            nom de l'évènement (Click, MouseIn, MouseOut, MouseMove,
	 *            MouseDown, MouseUp)
	 * @param x,
	 *            y coordonnée de la souris lors de l'évènement
	 * @param nButton
	 *            bouton appuyé
	 */
	doMouseEvent : function(sEvent, x, y, nButton, oClicked) {
		if (this._oDraggedControl !== null) {
			this.doDragDropEvent(sEvent, x, y, nButton);
			return;
		}
		if (oClicked === undefined) {
			oClicked = this.getControlAt(x, y);
		}
		if (oClicked != this._oPointedControl) {
			if (this._oPointedControl !== null) {
				this.doMouseEvent('mouseout', x, y, nButton,
						this._oPointedControl);
			}
			this._oPointedControl = oClicked;
			this.doMouseEvent('mousein', x, y, nButton, oClicked);
		}
		var oEvent;
		if (oClicked) {
			oEvent = {type: sEvent, target: oClicked, x: x - oClicked._x, y: y - oClicked._y, button: nButton, stop: false};
			oClicked.trigger(sEvent, oEvent);
			if (!oEvent.stop) {
				oClicked.doMouseEvent(sEvent, x - oClicked._x, y - oClicked._y,
					nButton);
			}
		} else {
			oEvent = {type: sEvent, target: this, x: x, y: y, button: nButton, stop: false};
			this.trigger(sEvent, this, x, y, nButton);
		}
	},
	
	/**
	 * Renvoie la position relative du controle spécifié Intervien lors du drag
	 * n drop
	 */
	getControlRelativePosition : function(oControl) {
		var oPos = {
			x : 0,
			y : 0
		};
		while (oControl != this && oControl !== null) {
			oPos.x += oControl._x;
			oPos.y += oControl._y;
			oControl = oControl._oParent;
		}
		return oPos;
	},

	doDragDropEvent : function(sEvent, x, y, nButton) {
		var oPos = this.getControlRelativePosition(this._oDraggedControl);
		switch (sEvent) {
		case 'MouseMove':
			this._oDraggedControl.callEvent('onDragging', x - oPos.x, y - oPos.y, nButton);
			break;

		case 'MouseUp': // fin du drag n drop
			this._oDraggedControl.callEvent('onEndDragging', x - oPos.x, y - oPos.y, nButton);
			this._oDraggedControl = null;
			break;
		}
	},

	/**
	 * Initialise le drag n drop appelle le gestionnaire de DragDrop, s'il n'y
	 * en a pas, appelle le parent
	 */
	startDragObject : function(oTarget, x, y, b) {
		if (this._bDragHandler) {
			this._oDraggedControl = oTarget;
			oTarget.callEvent('onStartDragging', x, y, b);
		} else {
			this.callParentMethod('startDragObject', oTarget, x, y, b);
		}
	},

	/**
	 * Transforme un objet d'arguments en tableau (spécificité webkit)
	 * 
	 * @param a
	 *            args
	 * @return array
	 */
	argObjectToArray : function(a) {
		var i = '';
		var aArgs = [];
		if ('length' in a) {
			for (i = 0; i < a.length; i++) {
				aArgs.push(a[i]);
			}
			return aArgs;
		}
		for (i in a) {
			aArgs.push(a[i]);
		}
		return aArgs;
	},

	/**
	 * Appelle un method du parent
	 * 
	 * @param sMethod
	 *            nom de la methode à appeler
	 * @param autre
	 *            method
	 * @return retourn de la methode
	 */
	callParentMethod : function() {
		if (this._oParent === null) {
			return null;
		}
		var aArgs = this.argObjectToArray(arguments);
		var sMethod = aArgs.shift();
		if (sMethod in this._oParent) {
			return this._oParent[sMethod].apply(this._oParent, aArgs);
		}
	},

	/**
	 * Appelle une methode si celle ci existe Utilisé lors d'appel d'évènement
	 * facultativement défini
	 */
	callEvent : function() {
		var aArgs = this.argObjectToArray(arguments);
		var sMethod = aArgs.shift();
		if (sMethod in this) {
			return this[sMethod].apply(this, aArgs);
		}
	},

	/**
	 * Ajoute le control à la liste des controle invalide pour une optimisation
	 * du rendu
	 * 
	 * @param o
	 *            Controle à invalider
	 */
	invalidateControl : function(o) {
		if (this._aInvalidControls.indexOf(o) < 0) {
			this._aInvalidControls.push(o);
		}
	},

	/**
	 * Dessine les controle enfant
	 */
	renderControls : function() {
		var o;
		while (this._aInvalidControls.length) {
			o = this._aInvalidControls.shift();
			if (o._nHandle) {
				o.render();
			}
		}
	},

	/**
	 * Efface les controles caché de la surface
	 */
	hideControls : function() {
		var o;
		while (this._aHideControls.length) {
			o = this._aHideControls.shift();
			this._oContext.clearRect(o._x, o._y, o.getWidth(), o.getHeight());
		}
	},

	renderSelf : function() {
	},

	needRender : function() {
		return this._bVisible && (this._nWidth * this._nHeight) !== 0;
	},

	/**
	 * Redessine le contenu graphique du controle fenêtré l'extérieur de ce
	 * rectangle est normalment invisible et n'a aps besoin d'etre traité
	 */
	render : function() {
		var o;
		if (this._bInvalid) {
			this.hideControls();
			this.renderSelf();
			// repeindre les controle enfant
			this.renderControls();
			for (var i = 0; i < this._aControls.length; i++) {
				o = this._aControls[i];
				if (o.needRender()) {
					this._oContext.drawImage(o._oCanvas, o._x, o._y);
				}
			}
			this._bInvalid = false;
		}
	},

	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */
	/** ************* Méthodes publiques ************* */

	/**
	 * Renvoie la classe de widget. la "classe" est une simple variable.
	 * 
	 * @return string
	 */
	getClass : function() {
		return this._sClass;
	},

	/**
	 * Renvoie la loongeur du controle en pixels pour changer la longeur
	 * utiliser setSize()
	 * 
	 * @return int
	 */
	getWidth : function() {
		return this._nWidth;
	},

	/**
	 * Renvoie la hauteur du controle en pixels pour changer la hauteur utiliser
	 * setSize()
	 * 
	 * @return int
	 */
	getHeight : function() {
		return this._nHeight;
	},

	/**
	 * Renvoie l'instance du controle parent
	 * 
	 * @return H5UI.WinControl
	 */
	getParent : function() {
		return this._oParent;
	},

	/**
	 * Ajoute un controle enfant et renvoie l'instance de ce control
	 * nouvellement linké
	 * 
	 * @param o
	 *            Controle enfant à ajouter
	 * @return H5UI.WinControl
	 */
	linkControl : function(o) {
		o._nIndex = this._aControls.length;
		this._aControls.push(o);
		o._oParent = this;
		o.invalidate();
		return o;
	},

	/**
	 * Défini quel controle sera au sommet de la pile des autre contrôles
	 * il apparaitra par dessus tous les autres
	 * @param o Objet controle
	 */
	setTopControl : function(o) {
		var nIndex = this._aControls.indexOf(o);
		var nCount = this.getControlCount();
		if (nIndex >= 0) {
			for (var i = nIndex; i < (nCount - 1); i++) {
				this._aControls[i] = this._aControls[i + 1];
				this._aControls[i]._set('_nIndex', i);
			}
			this._aControls[nCount - 1] = o;
			o._set('_nIndex', i);
		}
	},

	/** 
	 * se placer au dessus des autres controles
	 * fait appel au top du client
	 */
	top : function() {
		this.callParentMethod('setTopControl', this);
	},

	/**
	 * Supprime un controle et appelle le destructeur de ce controle
	 * 
	 * @param n
	 *            controle à virer
	 */
	unlinkControl : function(n) {
		var oControl;
		if (n >= this._aControls.length) {
			throw new Error('out of bounds: ' + n.toString() + ' - range is 0 to ' + this._aControls.length);
		}
		oControl = this._aControls[n];
		this.removeArrayItem(this._aControls, n, '_nIndex');
		this.removeArrayItem(this._aInvalidControls, oControl);
		for ( var sAlign in this._aAlignedControls) {
			this.removeArrayItem(this._aAlignedControls[sAlign], oControl);
		}
		this.removeArrayItem(this._aHideControls, oControl);
		/*
		 * if (n == (this._aControls.length - 1)) { oControl =
		 * this._aControls.pop(); } else { oControl = this._aControls[n];
		 * this._aControls[n] = this._aControls.pop();
		 * this._aControls[n]._nIndex = n; }
		 */
		oControl.__destruct();
		this.invalidate();
	},

	/**
	 * Autodestruction d'un objet
	 */
	free : function() {
		this.callParentMethod('unlinkControl', this._nIndex);
	},

	/**
	 * Renvoie le controle de rang n
	 * 
	 * @param n
	 * @exception "out
	 *                of bounds"
	 * @return controle au rang n
	 */
	getControl : function(n) {
		if (n >= this._aControls.length) {
			throw new Error('out of bounds: ' + n.toString() + ' - range is 0 to ' + this._aControls.length);
		}
		return this._aControls[n];
	},

	/**
	 * Renvoie le nombre de controles
	 * 
	 * @return int
	 */
	getControlCount : function() {
		if (this._aControls) {
			return this._aControls.length;
		} else {
			return 0;
		}
	},

	/**
	 * Alignement d'un controle fenetré
	 * 
	 * @param sDoko
	 *            position du controle à maintenir (pour l'instant uniquement
	 *            'center') si le paramètre est omis, l'alignement du controle
	 *            est supprimé
	 */
	align : function(sDoko) {
		if (sDoko === undefined) {
			this.callParentMethod('unregisterAlignedControl', this);
		} else {
			this.callParentMethod('registerAlignedControl', this, sDoko);
		}
	},

	/**
	 * Changement de taille du controle
	 * 
	 * @param w
	 *            taille x
	 * @param h
	 *            taille y
	 */
	setSize : function(w, h) {
		if (w != this.getWidth() || h != this.getHeight()) {
			this._nWidth = this._oCanvas.width = w;
			this._nHeight = this._oCanvas.height = h;
			this.realignControls();
			this.invalidate();
		}
	},

	/**
	 * Positionne le controle à la position spécifiée
	 * 
	 * @param x
	 * @param y
	 */
	moveTo : function(x, y) {
		if (x != this._x || y != this._y) {
			this._x = x;
			this._y = y;
			this.realignControls();
			this.invalidate();
		}
	},

	/**
	 * Déplace le control au centre de son parent Le controle conserve sa
	 * taille, seule sa position change Cette methode est exploitée par le
	 * système d'alignement des control mais peut etre utilisé ponctuellement
	 * pour centrer un controle.
	 */
	moveToCenter : function() {
		var p = this.getParent();
		if (p) {
			this.moveTo(((p.getWidth() - this.getWidth()) >> 1), ((p.getHeight() - this.getHeight()) >> 1));
		}
	},

	/**
	 * Cache le controle
	 */
	hide : function() {
		if (this._bVisible) {
			this._bVisible = false;
			this.callParentMethod('hideControl', this);
			this.invalidate();
		}
	},

	/**
	 * Affiche le controle
	 */
	show : function() {
		if (!this._bVisible) {
			this._bVisible = true;
			this.invalidate();
		}
	},

	isVisible: function() {
		return this._bVisible;
	},

	/**
	 * Renvoie la référence au context du canvas
	 * 
	 * @return Object HTMLCanvasContext2d
	 */
	getSurface : function() {
		if (this._oContext === null) {
			this._oContext = this._oCanvas.getContext('2d');
		}
		return this._oContext;
	},

	/**
	 * Renvoie la surface du parent
	 * 
	 * @return Object HTMLCanvasContext2d
	 */
	getParentSurface : function() {
		return this.callParentMethod('getSurface');
	},

	/**
	 * Renvoie la référence du controle pointé par les coordonées spécifiées
	 * 
	 * @param x,
	 *            y coordonnées
	 */
	getControlAt : function(x, y) {
		var o, ox, oy, w, h;
		if (this._aControls) {
			for (var i = this._aControls.length - 1; i >= 0; i--) {
				o = this._aControls[i];
				ox = o._x;
				oy = o._y;
				w = o.getWidth();
				h = o.getHeight();
				if (x >= ox && y >= oy && x < (ox + w) && y < (oy + h) && o._bVisible) {
					return o;
				}
			}
		}
		return null;
	},

	/**
	 * Démarre le processus de drag and drop
	 * 
	 * @param x,
	 *            y position de la souris
	 * @param b
	 *            bouttons de la souris enfoncé
	 */
	dragStart : function(x, y, b) {
		this.callParentMethod('startDragObject', this, x, y, b);
	},

	/**
	 * Invalide l'état graphique, forcant le controle à se redessiner
	 */
	invalidate : function() {
		this._bInvalid = true;
		this.callParentMethod('invalidate');
		this.callParentMethod('invalidateControl', this);
	},

	/**
	 * Renvoie true si le controle possède des enfants
	 * 
	 * @return bool
	 */
	hasControls : function() {
		return this._aControls !== null && this._aControls.length > 0;
	} 
});


O2.mixin(H5UI.WinControl, O876.Mixin.Events);
O2.mixin(H5UI.WinControl, O876.Mixin.Data);
