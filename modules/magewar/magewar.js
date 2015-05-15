/** O2: Fonctionalités Orientées Objets pour Javascript
 * 2010 Raphaël Marandet
 * ver 1.0 10.10.2010
 * ver 1.1 28.04.2013 : ajout d'un support namespace  
 */

var O2 = {};

/** Remplace dans une chaine "inherited(" par "inherited(this"
 * @param s Chaine à remplacer
 * @return nouvelle chaine remplacée
 */
function __inheritedThisMacroString(s) {
	return s.toString().replace(/__inherited\s*\(/mg,
			'__inheritedCaller(this, ').replace(
			/__inheritedCaller\s*\(\s*this,\s*\)/mg, '__inheritedCaller(this)');
}

/** Invoque la methode parente
 * @param This appelant, + Paramètres normaux de la methode parente.
 * @return Retour normal de la methode parente.
 */
function __inheritedCaller() {
	var fCaller = __inheritedCaller.caller;
	var oThis = arguments[0];
	var aParams;
	if ('__inherited' in fCaller) {
		aParams = Array.prototype.slice.call(arguments, 1);
		//for (iParam = 1; iParam < arguments.length; iParam++) {
		//	aParams.push(arguments[iParam]);
		//}
		return fCaller.__inherited.apply(oThis, aParams);
	} else {
		throw new Error('o2: no __inherited');
	}
}

/** Creation d'une nouvelle classe
 * @example NouvelleClasse = Function.createClass(function(param1) { this.data = param1; });
 * @param fConstructor prototype du constructeur
 * @return Function
 */
Function.prototype.createClass = function(pPrototype) {
	var f;
	f = function() {
		if ('__construct' in this) {
			this.__construct.apply(this, arguments);
		}
	};
	if (pPrototype === undefined) {
		return f;
	} else if (typeof pPrototype === 'object') {
		return f.extendPrototype(pPrototype);
	} else {
		return null;
	}
};

/** Mécanisme d'extention de classe.
 * Cette fonction accepte un ou deux paramètres
 * Appel avec 1 paramètre :
 * @param Définition de prototype à ajouter à la classe.
 * Appel avec 2 paramètres :
 * @param Classe parente
 * @param Définition de prototype à ajouter à la classe.
 * @return Instance de lui-même.
 */
Function.prototype.extendPrototype = function(aDefinition) {
	var iProp = '', f, fInherited;
	if (aDefinition instanceof Function) {
		aDefinition = aDefinition.prototype;
	}
	for (iProp in aDefinition) {
		f = aDefinition[iProp];
		if (iProp in this.prototype	&& (this.prototype[iProp] instanceof Function)) {
			// Sauvegarde de la méthode en cours : elle pourrait être héritée
			fInherited = this.prototype[iProp];
			// La méthode en cour est déja présente dans la super classe
			if (f instanceof Function) {
				// completion des __inherited
				eval('f = ' + __inheritedThisMacroString(f.toString()));
				this.prototype[iProp] = f;
				this.prototype[iProp].__inherited = fInherited;
			} else {
				// On écrase probablement une methode par une propriété : Erreur
				throw new Error(
						'o2: method ' + iProp + ' overridden by property.');
			}
		} else {
			// Ecrasement de la propriété
			this.prototype[iProp] = aDefinition[iProp];
		}
	}
	return this;
};

/** Mécanisme d'extension de classe
 * @param Parent Nom de la classe Parente
 * @param X prototype du constructeur (optionnel)
 * @param Y prototype de la classe étendue
 */
Function.prototype.extendClass = function(Parent, X) {
	var f = this.createClass().extendPrototype(Parent).extendPrototype(X);
	return f;
};

/**
 * Creation d'un objet
 * Le nom de l'objet peut contenir des "." dans ce cas de multiple objets sont créés
 * ex: O2.createObject("MonNamespace.MaBibliotheque.MaClasse", {...});
 * var créer un objet global "MonNamespace" contenant un objet "MaBibliotheque" contenant lui même l'objet "MaClasse"
 * ce dernier objet recois la définition du second paramètre.
 *  
 * 
 * @param sName nom de l'objet
 * @param oObject objet
 * @param object
 */
O2.createObject = function(sName, oObject) {
	var aName = sName.split('.');
	var sClass = aName.pop();
	var pIndex = window;
	var sNamespace;
	while (aName.length) {
		sNamespace = aName.shift();
		if (!(sNamespace in pIndex)) {
			pIndex[sNamespace] = {};
		}
		pIndex = pIndex[sNamespace];
	}
	if (!(sClass in pIndex)) {
		pIndex[sClass] = oObject;
	} else {
		for ( var sProp in oObject) {
			pIndex[sClass][sProp] = oObject[sProp];
		}
	}
};

/** 
 * Charger une classe à partir de son nom - le nom suit la syntaxe de la fonction O2.createObject() concernant les namespaces. 
 * @param s string, nom de la classe
 * @return pointer vers la Classe
 */
O2._loadObject = function(s) {
	var aClass = s.split('.');
	var pBase = window;
	while (aClass.length > 1) {
		pBase = pBase[aClass.shift()];
	}
	var sClass = aClass[0];
	return pBase[sClass];
};

/** Creation d'une classe avec support namespace
 * le nom de la classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la classe
 * @param pPrototype définition de la nouvelle classe
 */
O2.createClass = function(sName, pPrototype) {
	O2.createObject(sName, Function.createClass(pPrototype));
};

/** Extend d'un classe
 * le nom de la nouvelle classe suit la syntaxe de la fonction O2.createObject() concernant les namespaces.
 * @param sName string, nom de la nouvelle classe
 * @param pParent string|object Classe parente
 * @param pPrototype Définition de la classe fille  
 */
O2.extendClass = function(sName, pParent, pPrototype) {
	if (typeof pParent === 'string') {
		pParent = O2._loadObject(pParent);
	}
	O2.createObject(sName, Function.extendClass(pParent, pPrototype));
};

O2.createObject('CONST', {
	MISSILE_SIZE_NORMAL: 14,
	
	// general config
	MINIMUM_FPS: 20   // minimum number of frame per second in high detail mode
});

O2.createClass('SoundSystem',  {
	CHAN_MUSIC : 99,

	HAVE_NOTHING: 0,		// on n'a aucune information sur l'état du fichier audio ; mieux vaut ne pas lancer la lecture.
	HAVE_METADATA: 1,		// on a les méta données.
	HAVE_CURRENT_DATA: 2,	// on a assez de données pour jouer cette frames seulement.
	HAVE_FUTURE_DATA: 3,	// on a assez de données pour jouer les deux prochaines frames. 
	HAVE_ENOUGH_DATA: 4,	// on a assez de données.
	
	oBase : null,
	aChans : null,
	oMusicChan : null,
	nChanIndex : -1,

	nPlayed : 0,
	
	fMuteVolume: 0,
	bMute: false,
	bAllUsed: false,
	
	sCrossFadeTo: '',
	bCrossFading: false,

	sSndPlayedFile: '',
	fSndPlayedVolume: 0,
	nSndPlayedTime: 0,

	__construct : function() {
		this.oBase = document.getElementsByTagName('body')[0];
		this.aChans = [];
		this.aAmbient = [];
		this.oMusicChan = this.createChan();
		this.oMusicChan.loop = true;
		this.aChans = [];
	},
	
	worthPlaying: function(nTime, sFile, fVolume) {
		if (this.nSndPlayedTime != nTime || this.sSndPlayedFile != sFile || this.fSndPlayedVolume != fVolume) {
			this.sSndPlayedFile = sFile;
			this.fSndPlayedVolume = fVolume;
			this.nSndPlayedTime = nTime;
			return true;
		} else {
			return false;
		}
	},
	
	mute: function() {
		if (!this.bMute) {
			this.oMusicChan.pause();
			this.bMute = true;
		}
	},
	
	unmute: function() {
		if (this.bMute) {
			this.oMusicChan.play();
			this.bMute = false;
		}
	},

	
	destroyItem: function(o) {
		o.parentNode.removeChild(o);
	},

	free : function() {
		for ( var i = 0; i < this.aChans.length; i++) {
			this.destroyItem(this.aChans[i]);
		}
		this.destroyItem(this.oMusicChan);
		this.aChans = [];
	},
	
	createChan: function() {
		var oChan = document.createElement('audio');
		this.oBase.appendChild(oChan);
		return oChan;
	},

	addChan : function() {
		var oChan = this.createChan();
		oChan.setAttribute('preload', 'auto');
		oChan.setAttribute('autoplay', 'autoplay');
		oChan.__file = '';
		this.aChans.push(oChan);
		this.bAllUsed = false;
		return oChan;
	},

	addChans : function(n) {
		for (var i = 0; i < n; i++) {
			this.addChan();
		}
	},

	isChanPlaying : function(nChan, sFile) {
		if (nChan == this.CHAN_MUSIC) {
			return !this.oMusicChan.ended;
		}
		if (nChan < 0) {
			nChan = 0;
		}
		if (nChan >= this.aChans.length) {
			nChan = this.aChans.length - 1;
		}
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return !oChan.ended;
		} else {
			return !(oChan.ended && ((sFile == oChan.__file) || (oChan.__file !== '')));
		}
	},

	isChanFree : function(nChan, sFile) {
		if (nChan == this.CHAN_MUSIC) {
			return this.oMusicChan.ended;
		}
		if (nChan < 0) {
			nChan = 0;
		}
		if (nChan >= this.aChans.length) {
			nChan = this.aChans.length - 1;
		}
		var oChan = this.aChans[nChan];
		if (sFile === undefined) {
			return oChan.ended;
		} else {
			var bEmpty = oChan.__file === '';
			var bNotPlaying = oChan.ended;
			var bAlreadyLoaded = sFile == oChan.__file;
			return bEmpty || (bNotPlaying && bAlreadyLoaded);
		}
	},

	getFreeChan : function(sFile) {
		if (!this.hasChan()) {
			return -1;
		}
		var iChan;
		for (iChan = 0; iChan < this.aChans.length; iChan++) {
			if (this.isChanFree(iChan, sFile)) {
				return iChan;
			}
		}
		for (iChan = 0; iChan < this.aChans.length; iChan++) {
			if (this.isChanFree(iChan)) {
				return iChan;
			}
		}
		this.nChanIndex = (this.nChanIndex + 1) % this.aChans.length;
		return this.nChanIndex;
	},

	hasChan : function() {
		return this.aChans.length > 0;
	},

	play : function(sFile, nChan, fVolume) {
		if (this.bMute) {
			return -1;
		}
		var oChan = null;
		if (sFile === undefined) {
			return -1;
		}
		if (nChan == this.CHAN_MUSIC) {
			this.playMusic(sFile);
			return;
		} else if (this.hasChan()) {
			if (nChan === undefined) {
				nChan = this.getFreeChan(sFile);
			}
			oChan = this.aChans[nChan];
		} else {
			oChan = null;
		}
		if (oChan !== null) {
			if (oChan.__file != sFile) {
				oChan.src = sFile;
				oChan.__file = sFile;
				oChan.load();
			} else if (oChan.readyState > this.HAVE_NOTHING) {
				oChan.currentTime = 0;
				oChan.play();
			}
		}
		if (fVolume !== undefined) {
			oChan.volume = fVolume;
		}
		return nChan;
	},

	/**
	 * Joue le prochain fichier musical dans la liste
	 */
	playMusic : function(sFile) {
		var oChan = this.oMusicChan;
		oChan.src = sFile;
		oChan.load();
		oChan.play();
	},
	
	/**
	 * Diminue graduellement le volume sonore du canal musical
	 * puis change le fichier sonore
	 * puis remonte graduellement le volume
	 * le programme d'ambience est reseté par cette manip
	 */
	crossFadeMusic: function(sFile) {
		if (this.bCrossFading) {
			this.sCrossFadeTo = sFile;
			return;
		}
		var iVolume = 100;
		var nVolumeDelta = -10;
		this.bCrossFading = true;
		var oInterval = null;
		oInterval = setInterval((function() {
			iVolume += nVolumeDelta;
			this.oMusicChan.volume = iVolume / 100;
			if (iVolume <= 0) {
				this.playMusic(sFile);
				this.oMusicChan.volume = 1;
				clearInterval(oInterval);
				this.bCrossFading = false;
				if (this.sCrossFadeTo) {
					this.crossFadeMusic(this.sCrossFadeTo);
					this.sCrossFadeTo = '';
				}
			}
		}).bind(this), 100);
	}
});

O2.createClass('H5UI.Font', {
	_sStyle: '',
	_sFont : 'monospace',
	_nFontSize : 10,
	_sColor : 'rgb(255, 255, 255)',
	_oControl : null,
	_sOutlineColor: 'rgb(0, 0, 0)',
	_bOutline: false,

	__construct : function(oControl) {
		if (oControl === undefined) {
			throw new Error('h5ui.font: no specified control');
		}
		this.setControl(oControl);
	},

	/**
	 * Défini le controle propriétaire
	 * 
	 * @param oControl
	 *            nouveau control propriétaire
	 */
	setControl : function(oControl) {
		this._oControl = oControl;
		this.invalidate();
	},

	/**
	 * Invalide le controle propriétaire afin qu'il se redessineen tenant compte
	 * des changement apporté à l'aspect du texte.
	 */
	invalidate : function() {
		if (this._oControl) {
			this.update();
			this._oControl.invalidate();
		}
	},

	/**
	 * Modification de la police de caractère, on ne change que la variable et
	 * on invalide le controle
	 * 
	 * @param sFont
	 *            nouvelle police
	 */
	setFont : function(sFont) {
		if (this._sFont != sFont) {
			this._sFont = sFont;
			this.invalidate();
		}
	},
	
	setStyle: function(sStyle) {
		if (this._sStyle != sStyle) {
			this._sStyle = sStyle;
			this.invalidate();
		}
	},

	/**
	 * Modifie la taille de la police
	 * 
	 * @param nSize
	 *            nouvelle taille en pixel
	 */
	setSize : function(nSize) {
		if (this._nFontSize != nSize) {
			this._nFontSize = nSize;
			this.invalidate();
		}
	},

	/**
	 * Modification de la couleur
	 * 
	 * @param s
	 *            nouvelle couleur HTML5 (peut etre un gradient)
	 */
	setColor : function(sColor, sOutline) {
		var bInvalid = false;
		if (this._sColor != sColor) {
			this._sColor = sColor;
			bInvalid = true;
		}
		if (this._sOutlineColor != sOutline) {
			this._sOutlineColor = sOutline;
			bInvalid = true;
		}
		this._bOutline = this._sOutlineColor !== undefined;
		if (bInvalid) {
			this.invalidate();
		}
	},

	/**
	 * Calcule la chaine de définition de police de caractère Cette fonction
	 * génère une chaine de caractère utilisable pour définir la propriété Font
	 * d'une instance Canvas2DContext
	 * 
	 * @return string
	 */
	getFontString : function() {
		return (this._sStyle ? this._sStyle + ' ' : '') + this._nFontSize.toString() + 'px ' + this._sFont;
	},

	/**
	 * Applique les changements de taille, de couleur... Le context2D du
	 * controle propriété de cette instance est mis à jour quant au nouvel
	 * aspect de la Font.
	 */
	update : function() {
		var oContext = this._oControl.getSurface();
		oContext.font = this.getFontString();
		oContext.fillStyle = this._sColor;
		if (this._bOutline) {
			oContext.strokeStyle = this._sOutlineColor;
		}
	}
});


/* H5UI: Bibliothèque de composants visuels basé sur la technologie HTML 5
   2012 Raphaël Marandet
   ver 1.0 01.06.2012
 */

/*
 H5UI est un système de gestion de controles fenêtrés basé sur HTML 5, plus particulièrement son objet de rendu graphique Canvas.
 Ce système gère : 
 1) l'affichage d'une interface graphique (ensemble de fenêtres, boutons, texte, tableau, images, barres de défilement....).
 2) le traitement des évènements souris (déplacement, clic, drag and drop...)
 3) Le rafraichissement optimisé des composants graphiques dont l'état a changé.

 Principe
 --------

 Le système s'apparentant à un Document Object Model (DOM) est articulé autour d'une classe Composite : 
 Les instances de contrôles fenêtrés entretiennent chacune une collection d'instances de même classe.
 Ces contrôles sont organisé en arborescence. Chaque contrôle fenêtré possède un seul parent et 0-n enfants.

 Lorsqu'un contrôle s'invalide (sous l'effet d'une action externe comme une action utilisateur ou un timer écoulé), 
 il doit être redessiné. Sa chaîne hierarchique est invalidée à son tour,
 et lors du rafraichissement d'écran seul les composants invalides font appel à leur méthode de rendu graphique 
 et sont effectivement redessinés. 
 Les autres contrôles ne sont que replaqués sur la surface de leur parent en utilisant leur état graphique actuel inchangé.
 Les composants dont les parents n'ont pas été invalidés ne sont pas atteints par la procédure de rafraîchissement.


 +--------------------------------------------------+
 | Controle A                                       |
 |            +-----------------------------+       |
 |            | Controle B                  |       |
 |            |                             |       |
 |            |                             |       |
 |            +-----------------------------+       |
 |                                                  |
 |    +-----------------------------+               |
 |    | Controle C                  |               |
 |    |    +-----------------+      |               |
 |    |    | Controle D      |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    |                 |      |               |
 |    |    +-----------------+      |               |
 |    +-----------------------------+               |
 |                                                  |
 +--------------------------------------------------+

 Dans ce schémas le Controle A contient B et C, le Contrôle C contient quand à lui le Controle D
 Autrement l'arborescence se représente ainsi

 A
 |
 +--- B
 |
 +--- C
 |
 +--- D




 Vocabulaire
 -----------

 Contrôle fenêtré
 Elément de base d'une interface graphique.
 Le contrôle fenêtré est un objet visuel qui possède plusieurs propriétés de base et 
 Les propriété fondamentales pour tout objet graphique sont : 
 - la position (en pixels).
 - la taille (longueur et hauteur en pixels).
 - un indicateur d'invalidation (booléen) lorsque celui ci est a VRAI le contrôle doit être redessiné.
 - un contrôle fenêtré parent.
 - une collection de contrôles fenêtrés enfants.

 Composite
 Design pattern permettant de traiter un groupe d'objet de même instance de la même manière qu'un seul objet.
 Les objets sont organisés hierarchiquement.
 En pratique : chaque controle fenêtré comporte une collection d'autres controles fenetrés.
 Le rendu graphique d'un controle fenêtré fait intervenir la fonction qui gère le rendu graphique des sous-contrôles fenêtrés

 Etat graphique
 C'est l'ensemble des propriétés d'un contrôle fenêtré qui concourent à son aspect visuel.
 Si l'une de ces propriétés changent, c'est l'aspect visuel du contrôle fenêtré qui en est modifié, il doit donc être redessiné.
 La collection de contrôles fenêtrés font partit de l'état graphique de fait que la modification de l'état graphique d'un contrôle fenêtré
 provoque le changement de l'état graphique du contrôle parent.

 */

O2.createObject('H5UI', {
	data : {
		renderCount : 0,
		cdiCount : 0,
		pixelCount : 0,
		renderedList : {},
		buildCanvases : 0,
		destroyedCanvases : 0
	},
	canvasDispenser: [],
	handle : 0,
	
	
	root: null,

	initRoot: function() {
		UI.root = document.getElementsByTagName('body')[0];
	},

	setRoot: function(oDomElement) { H5UI.root = oDomElement; },

	getCanvas: function () {
		var oCanvas = H5UI.canvasDispenser.pop();
		if (oCanvas) {
			return oCanvas;
		} else {
			return O876.CanvasFactory.getCanvas();
		}
	},

	recycleCanvas: function (oCanvas) {
		H5UI.canvasDispenser.push(oCanvas);
	}
});

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
		while (this._aControls.length) {
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
				this.doMouseEvent('MouseOut', x, y, nButton,
						this._oPointedControl);
			}
			this._oPointedControl = oClicked;
			this.doMouseEvent('MouseIn', x, y, nButton, oClicked);
		}
		var sMouseEventMethod = 'on' + sEvent;
		var pMouseEventMethod;
		if (oClicked !== null) {
			if (sMouseEventMethod in oClicked) {
				pMouseEventMethod = oClicked[sMouseEventMethod];
				pMouseEventMethod.apply(oClicked, [ x - oClicked._x,
						y - oClicked._y, nButton ]);
			}
			oClicked.doMouseEvent(sEvent, x - oClicked._x, y - oClicked._y,
					nButton);
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

/** Classe de mesure de l'activité CPU
 * 
 */
O2.createClass('O876.CPUMonitor', {
	// Temps chronometrés par l'objet
	aTimes: null,
	sTimes: null,
	nTimes: 0,
	nIdleTime: 0,
	aColors: null,
	
	__construct: function() {
		this.aColors = ['#F00', '#0F0', '#FF0', '#00F', '#F0F', '#0FF', '#FFF'];
		this.aTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.sTimes = ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''];
	},
	
	
	/** Lance le début du chronometrage
	 * Calcule le temps d'inactivité (temps courant  - dernier chrono)
	 */
	start: function() {
		var d = Date.now();
		if (this.nTimes > 0) {
			this.nIdleTime = d - this.aTimes[this.nTimes - 1];
			this.nTimes = 0;
		}
		this.aTimes[this.nTimes++] = d;
	},
	
	/** Insertion d'un temps de chrono
	 * 
	 */
	trigger: function(s, d) {
		if (d === undefined) {
			d = Date.now();
		}
		this.sTimes[this.nTimes - 1] = s;
		this.aTimes[this.nTimes++] = d;
	},
	
	render: function(oContext, x, y) {
		var n;
		for (var i = 0; i < (this.nTimes - 1); i++) {
			n = this.aTimes[i + 1] - this.aTimes[i];
			// n = time !
			oContext.fillStyle = this.aColors[i % 7];
			oContext.fillRect(x, y, n, 8);
			x += n;
		}
		oContext.fillStyle = this.aColors[i % 7];
		oContext.fillRect(x, y, this.nIdleTime, 8);
	}
});

O2.createObject('O876.CanvasFactory', {
	getCanvas: function() {
		var oCanvas = document.createElement('canvas');
		var oContext = oCanvas.getContext('2d');
		oContext.webkitImageSmoothingEnabled = false;
		oContext.mozImageSmoothingEnabled = false;
		oContext.imageSmoothingEnabled = false;
		return oCanvas;
	}
});
/** Chargement de classe à partir du nom
 * Gère les Namespace.
 */
O2.createClass('O876.ClassLoader', {
	oClasses: null,
	
	__construct: function() {
		this.oClasses = {};
	},
	
	loadClass: function(s) {
		if (s in this.oClasses) {
			return this.oClasses[s];
		}
		var aClass = s.split('.');
		var pBase = window;
		while (aClass.length > 1) {
			pBase = pBase[aClass.shift()];
		}
		var sClass = aClass[0];
		if (sClass in pBase) {
			this.oClasses[s] = pBase[sClass];
			return this.oClasses[s];
		} else {
			return null;
		}
	}
});

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger un mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.createClass('O876.Easing', {	
	xStart: 0,
	yStart: 0,
	
	xEnd: 0,
	yEnd: 0,
	
	x: 0,
	y: 0,
	
	bXCompute: true,
	bYCompute: true,
	
	
	fWeight: 1,
	
	sFunction: 'smoothstep',
	
	__construct : function() {
		this.nTime = 0;
	},
	
	/**
	 * Définition du mouvement qu'on souhaite calculer.
	 * @param float x position X de départ
	 * @param float y position Y de départ
	 * @param float dx position finale X
	 * @param float dy position finale Y
	 * @param int t temps qu'il faut au mouvement pour s'effectuer
	 */
	setMove: function(x, y, dx, dy, t) {
		this.xStart = this.x = x;
		this.yStart = this.y = y;
		this.xEnd = dx;
		this.yEnd = dy;
		this.bXCompute = x != dx;
		this.bXCompute = y != dy;
		this.nTime = t;
	},
	
	/**
	 * Définition de la fonction d'Easing
	 * @param string sFunction fonction à choisir parmi :
	 * linear : mouvement lineaire uniforme
	 * smoothstep : accelération et déccelération douce
	 * smoothstepX2 : accelération et déccelération moyenne
	 * smoothstepX3 : accelération et déccelération brutale
	 * squareAccel : vitesse 0 à T-0 puis uniquement accelération 
	 * squareDeccel : vitesse max à T-0 puis uniquement deccelération
	 * cubeAccel : vitesse 0 à T-0 puis uniquement accelération brutale 
	 * cubeDeccel : vitesse max à T-0 puis uniquement deccelération brutale
	 * sine : accelération et deccelération brutal, vitesse nulle à mi chemin
	 * cosine : accelération et deccelération selon le cosinus, vitesse max à mi chemin
	 * weightAverage : ... me rapelle plus 
	 */
	setFunction: function(sFunction) {
		this.sFunction = sFunction;
	},
	
	/**
	 * Calcule les coordonnée pour le temps t
	 * mets à jour les coordonnée x et y de l'objets
	 * @param int t temps
	 */
	move: function(t) {
		var v = this[this.sFunction](t / this.nTime);
		if (this.bXCompute) {
			this.x = this.xEnd * v + (this.xStart * (1 - v));
		}
		if (this.bYCompute) {
			this.y = this.yEnd * v + (this.yStart * (1 - v));
		}
	},

	linear: function(v) {
		return v;
	},
	
	smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	squareAccel: function(v) {
		return v * v;
	},
	
	squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	cubeAccel: function(v) {
		return v * v * v;
	},
	
	cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	sine: function(v) {
		return Math.sin(v * 3.14159265 / 2);
	},
	
	cosine: function(v) {
		return 0.5 - Math.cos(-v * 3.14159265) * 0.5;
	},
	
	weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	quinticBezier: function(v) {
		var ts = v * this.nTime;
		var tc = ts * this.nTime;
		return 4 * tc - 9 * ts + 6 * v;
	}
});
O2.createClass('O876.Horde', {
	aItems: null,
	
	__construct: function() {
		this.aItems = [];
	},
	
	/** Ajoute un élément à la legion
	 * @param oItem élément à ajouter
	 * @return int : indice de l'élément
	 */
	link: function(oItem) {
		var nKey = this.aItems.length;
		this.aItems.push(oItem);
		return nKey;
	},
	
	/**
	 * Renvoie le rang d'un élément
	 * @return int ( -1 si non trouvé
	 */
	indexOf: function(oItem) {
		return this.aItems.indexOf(oItem);
	},
	
	/** 
	 * Renvoie l'élément de la horde dont le rang est spécifié en param
	 * @param int rand de l'élément recherché
	 * @return object
	 */
	getItem: function(nKey) {
		if (nKey < this.aItems.length) {
			return this.aItems[nKey];
		} else {
			return null;
		}
	},
	
	/**
	 * Renvoie tous les items
	 * @return array
	 */
	getItems: function() {
		return this.aItems;
	},
	
	/** 
	 * Nombre d'éléments dans la horde
	 * return int
	 */
	count: function() {
		return this.aItems.length;
	},
	
	
	/**
	 * Suppression d'un élément de la horde
	 * La horde ne conserve pas le rang des éléments :
	 * Lorsqu'un élément est supprimé les autres éléments
	 * sont tassé pour combler le vide
	 * 
	 * @param xKey int or object élément ou rang de l'élément
	 */ 
	unlink: function(xKey) {
		var nKey;
		if (typeof xKey == 'object') {
			nKey = this.indexOf(xKey);
		} else {
			nKey = xKey;
		}
		if (nKey < 0 || nKey >= this.aItems.length) {
			return;
		}
		if (nKey == this.aItems.length - 1) {
			this.aItems.pop();
		} else {
			this.aItems[nKey] = this.aItems.pop();
		}
	},
	
	/**
	 * supprime les éléments de la horde
	 */
	clear: function() {
		this.aItems = [];
	}
});

O2.createObject('O876.LZW', {
	DICT_SIZE: 4096,
	PACKET_SEPARATOR: ':',
	FILE_SIGN: 'O876' + String.fromCharCode(122) + ':',

	nLastRatio: 0,		
	nMystificator: 0,

	encode: function(sData) {
		var aPackets = O876.LZW._createEncodedPackets(sData);
		var sBin = O876.LZW._bundlePackets(aPackets);
		O876.LZW.nLastRatio = sBin.length * 100 / sData.length | 0;
		return O876.LZW.FILE_SIGN + sBin;
	},

	decode: function(sZData) {
		if (sZData.substr(0, O876.LZW.FILE_SIGN.length) !== O876.LZW.FILE_SIGN) {
			throw new Error('bad format');
		}
		var aPacketCount = O876.LZW._getPacketInt(sZData, O876.LZW.FILE_SIGN.length);
		var nCount = aPacketCount[0];
		var iOffset = aPacketCount[1];
		var aPackets = O876.LZW._parsePackets(sZData, nCount, iOffset); 
		return O876.LZW._decodePackets(aPackets);
	},

	_bundlePackets: function(aPackets) {
		var aOutput = [];
		var sSep = O876.LZW.PACKET_SEPARATOR;
		aOutput.push(aPackets.length.toString(16));
		aOutput.push(sSep);
		for (var i = 0; i < aPackets.length; i++) {
			aOutput.push(aPackets[i].length.toString(16));
			aOutput.push(sSep);
			aOutput.push(aPackets[i]);
		}
		return aOutput.join('');
	},

	_getPacketInt: function(sPacket, iFrom) {
		var i = iFrom;
		var sNumber = '0x';
		var sSep = O876.LZW.PACKET_SEPARATOR;
		while (sPacket.substr(i, 1) != sSep) {
			sNumber += sPacket.substr(i, 1);
			i++;
		}
		var nNumber = parseInt(sNumber);
		if (isNaN(nNumber)) {
			throw new Error('corrupted data ' + sNumber);
		}
		return [parseInt(sNumber), i + 1];
	},

	_parsePackets: function(sPackets, nCount, iFrom) {
		var aGPI, nLength, aOutput = [];
		for (var i = 0; i < nCount; i++) {
			aGPI = O876.LZW._getPacketInt(sPackets, iFrom);
			nLength = aGPI[0];
			iFrom = aGPI[1];
			aOutput.push(sPackets.substr(iFrom, nLength));
			iFrom += nLength;
		}
		return aOutput;
	},

	_createEncodedPackets: function(s) {
		var i = 0;
		var o = [];
		var aOutput = [];
		do {
			o = O876.LZW._encodeFragment(s, i);
			i = o[1];
			aOutput.push(o[2]);
		} while (!o[0]);
		return aOutput;
	},

	_decodePackets: function(a) {
		var o = [];
		for (var i = 0; i < a.length; i++) {
			o.push(O876.LZW._decodeFragment(a[i]));
		}
		return o.join('');
	},

	_encodeFragment: function(s, iFrom) {
		var d = {};
		var i, iCode = 256;
		for (i = 0; i < 256; i++) {
			d[String.fromCharCode(i)] = i;
		}
		var w = '';
		var c;
		var wc;
		var o = [];
		var iIndex;
		var nLen = s.length;
		var bEnd = true;
		for (iIndex = iFrom; iIndex < nLen; iIndex++) {
			c = s.charAt(iIndex);
			wc = w + c;
			if (wc in d) {
				w = wc;
			} else {
				d[wc] = iCode++;
				o.push(d[w]);
				w = c;
			}
			if (d.length >= O876.LZW.DICT_SIZE) {
				bEnd = false;
				iIndex++;
				break;
			}
		}
		o.push(d[w]);
		for (i = 0; i < o.length; i++) {
			o[i] = String.fromCharCode(o[i] ^ O876.LZW.nMystificator);
		}
		return [bEnd, iIndex, o.join('')];
	},
	
	_decodeFragment: function(s) {
		var a;
		if (typeof s === 'string') {
			a = s.split('');
		} else {
			a = s;
		}
		for (var i = 0; i < a.length; i++) {
			a[i] = a[i].charCodeAt(0) ^ O876.LZW.nMystificator;
		}
		var c, w, e = '', o = [], d = [];
		for (i = 0; i < 256; i++) {
			d.push(String.fromCharCode(i));
		}
		c = a[0];
		o.push(w = String.fromCharCode(c));
		for (i = 1; i < a.length; i++) {
			c = a[i];
			if (c > 255 && d[c] !== undefined) {
				e = d[c];
			} else if (c > 255 && d[c] === undefined) {
				e = w + e.charAt(0);
			} else {
				e = String.fromCharCode(c);
			}
			o.push(e);
			d.push(w + e.charAt(0));
			w = e;
		}
		return o.join('');
	}
});

/** Collection à clés recyclables
 * les éléments sont identifiés par leur clé
 * les clés sont des indice numériques
 * la suppression d'un élément ne provoque pas de décalage
 * Les clés supprimées sont réutilisées lors de l'ajout de nouveaux éléments
 * Les trous sont peu fréquents et rapidement comblés
 */
O2.createClass('O876.Legion', {
	aItems: null,
	aRecycler: null,
	
	__construct: function() {
		this.aItems = [];
		this.aRecycler = [];
	},
	
	/** Ajoute un élément à la legion
	 * @param oItem élément à ajouter
	 * @return indice de l'élément
	 */
	link: function(oItem) {
		var nKey;
		if (this.aRecycler.length) {
			nKey = this.aRecycler.shift();
			this.aItems[nKey] = oItem;
		} else {
			nKey = this.aItems.length;
			this.aItems.push(oItem);
		}
		return nKey;
	},
	
	indexOf: function(oItem) {
		return this.aItems.index(oItem);
	},
	
	getItem: function(nKey) {
		if (nKey < this.aItems.length) {
			return this.aItems[nKey];
		} else {
			return null;
		}
	},
	
	unlink: function(xKey) {
		var nKey;
		if (typeof xKey == 'object') {
			nKey = this.indexOf(xKey);
		} else {
			nKey = xKey;
		}
		this.aItems[nKey] = null;
		this.aRecycler.push(nKey);
	}
});
/**
 * Cette classe permet de définir des cartes 2D
 * ou plus généralement des tableau 2D d'entier.
 * On entre une description texturelle composé 
 * d'un tableau de chaines de caractères.
 * Chacun de ces caractère sera remplacé par un entier
 * pour donner un tableau de tableau d'entiers
 * @param aMap tableau deux dimension contenant la carte
 * @oDic dictionnaire faisan correspondre les symbole de la carte à la valeur numérique finale
 */
O2.createObject('O876.MapTranslater', {
	process: function(aMap, oDic) {
		var x, y, aRow;
		var aOutput = [];
		var aRowOutput;
		
		for (y = 0; y < aMap.length; ++y) {
			aRow = aMap[y].split('');
			aRowOutput = [];
			for (x = 0; x < aRow.length; ++x) {
				aRowOutput.push(oDic[aRow[x]]);
			}
			aOutput.push(aRowOutput);
		}
		return aOutput;
	}
});

O2.createClass('O876.Mediator.Mediator', {

	_oPlugins: null,
	_oRegister: null,
	_oApplication: null,
	
	/**
	 * Constructeur
	 */
	__construct: function() {
		this._oPlugins = {};
		this._oRegister = {};
	},
	
	
	setApplication: function(a) {
		return this._oApplication = a;		
	},
	
	getApplication: function() {
		return this._oApplication;		
	},
	
	
	
	/**
	 * Ajoute un plugin
	 * @param oPlugin instance du plugin ajouté
	 * @return instance du plugin ajouté
	 */
	addPlugin: function(oPlugin) {
		if (!('getName' in oPlugin)) {
			throw new Error('O876.Mediator : anonymous plugin');
		}
		var sName = oPlugin.getName();
		if (sName === '') {
			throw new Error('O876.Mediator : undefined plugin name');
		}
		if (!('setMediator' in oPlugin)) {
			throw new Error('O876.Mediator : no Mediator setter in plugin ' + sName);
		}
		if (sName in this._oPlugins) {
			throw new Error('O876.Mediator : duplicate plugin entry ' + sName);
		}
		this._oPlugins[sName] = oPlugin;
		oPlugin.setMediator(this);
		if ('init' in oPlugin) {
			oPlugin.init();
		}
		return oPlugin;
	},
	
	removePlugin: function(x) {
		if (typeof x != 'string') {
			x = x.getName();
		}
		this._oPlugins[x] = null;
	},
	
	/**
	 * Renvoie le plugin dont le nom est spécifié
	 * Renvoie undefined si pas trouvé
	 * @param sName string
	 * @return instance de plugin
	 */
	getPlugin: function(sName) {
		return this._oPlugins[sName];
	},
	
	/**
	 * Enregistrer un plugin pour qu'il réagisse aux signaux de type spécifié
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	registerPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			this._oRegister = {};
		}
		if (sSignal in oPlugin) {
			if (!(sSignal in this._oRegister)) {
				this._oRegister[sSignal] = [];
			}
			if (this._oRegister[sSignal].indexOf(oPlugin) < 0) {
				this._oRegister[sSignal].push(oPlugin);
			}
		} else {
			throw new Error('O876.Mediator : no ' + sSignal + ' function in plugin ' + oPlugin.getName());
		}
	},
	
	/** 
	 * Retire le plugin de la liste des plugin signalisés
	 * @param sSignal type de signal
	 * @param oPlugin plugin concerné
	 */
	unregisterPluginSignal: function(sSignal, oPlugin) {
		if (this._oRegister === null) {
			return;
		}
		if (!(sSignal in this._oRegister)) {
			return;
		}
		var n = this._oRegister[sSignal].indexOf(oPlugin);
		if (n >= 0) {
			ArrayTools.removeItem(this._oRegister[sSignal], n);
		}
	},
	
	
	
	/**
	 * Envoie un signal à tous les plugins enregistré pour ce signal
	 * signaux supportés
	 * 
	 * damage(oAggressor, oVictim, nAmount) : lorsqu'une créature en blesse une autre
	 * key(nKey) : lorsqu'une touche est enfoncée ou relachée
	 * time : lorsqu'une unité de temps s'est écoulée
	 * block(nBlockCode, oMobile, x, y) : lorsqu'un block a été activé
	 */
	sendPluginSignal: function(s) {
		var i, p, pi, n;
		if (this._oRegister && (s in this._oRegister)) {
			p = this._oRegister[s];
			n = p.length;
			if (n) {
				var aArgs;
				if (arguments.length > 1) {
					aArgs = Array.prototype.slice.call(arguments, 1);
				} else {
					aArgs = [];
				}
				for (i = 0; i < n; i++) {
					pi = p[i];
					pi[s].apply(pi, aArgs);
				}
			}
		}
	}
});

O2.createClass('O876.Mediator.Plugin', {
	_oMediator: null,
	
	getName: function() {
		return '';
	},
	
	register: function(sType) {
		this._oMediator.registerPluginSignal(sType, this);
	},
	
	unregister: function(sType) {
		this._oMediator.unregisterPluginSignal(sType, this);
	},

	setMediator: function(m) {
		this._oMediator = m;
	},
	
	getPlugin: function(s) {
		return this._oMediator.getPlugin(s);
	}
});

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

/** Animation : Classe chargée de calculer les frames d'animation
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Animation',  {
	nStart : 0, // frame de début
	nIndex : 0, // index de la frame en cours d'affichage
	nCount : 0, // nombre total de frames
	nDuration : 0, // durée de chaque frame, plus la valeur est grande plus l'animation est lente
	nTime : 0, // temps
	nLoop : 0, // type de boucle 1: boucle forward; 2: boucle yoyo
	nFrame: 0, // Frame actuellement affichée
	
	nDirLoop: 1,  // direction de la boucle (pour yoyo)
	
	assign: function(a) {
		if (a) {
			this.nStart = a.nStart;
			this.nCount = a.nCount;
			this.nDuration = a.nDuration;
			this.nLoop = a.nLoop;
			this.nIndex = a.nIndex % this.nCount;
			this.nTime = a.nTime % this.nDuration;
		} else {
			this.nCount = 0;
		}
	},
	
	animate : function(nInc) {
		if (this.nCount <= 1 || this.nDuration === 0) {
			return this.nIndex + this.nStart;
		}
		this.nTime += nInc;
		// Dépassement de duration (pour une seule fois)
		if (this.nTime >= this.nDuration) {
			this.nTime -= this.nDuration;
			this.nIndex += this.nDirLoop;
		}
		// pour les éventuels très gros dépassement de duration (pas de boucle)
		if (this.nTime >= this.nDuration) {
			this.nIndex += this.nDirLoop * (this.nTime / this.nDuration | 0);
			this.nTime %= this.nDuration;
		}
		/** older version
		while (this.nTime >= this.nDuration) {
			this.nTime -= this.nDuration;
			this.nIndex += this.nDirLoop;
		}*/
		
		switch (this.nLoop) {
			case 1:
				if (this.nIndex >= this.nCount) {
					this.nIndex = 0;
				}
			break;
				
			case 2:
				if (this.nIndex >= this.nCount) {
					this.nIndex = this.nCount - 2;
					this.nDirLoop = -1;
				}
				if (this.nIndex <= 0) {
					this.nDirLoop = 1;
					this.nIndex = 0;
				}
			break;
				
			default:
				if (this.nIndex >= this.nCount) {
					this.nIndex = this.nCount - 1;
				}
		}
		this.nFrame = this.nIndex + this.nStart;
		return this.nFrame;
	},

	reset : function() {
		this.nIndex = 0;
		this.nTime = 0;
		this.nDirLoop = 1;
	}
});

/** Un blueprint est un élément de la palette de propriétés
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Les blueprint servent de modèle et de référence pour alimenter les propriétés des sprites créé dynamiquement pendant le jeu
 */
O2.createClass('O876_Raycaster.Blueprint', {
  sId: '',
  nType: 0,
  // propriétés visuelles
  oTile: null,        // référence objet Tile

  // propriétés physiques
  nPhysWidth: 0,      // Largeur zone impactable
  nPhysHeight: 0,     // Hauteur zone impactable
  sThinker: '',       // Classe de Thinker
  nFx: 0,             // Gfx raster operation
  oXData: null,       // Additional data

  __construct: function(oData) {
    if (oData !== undefined) {
      this.nPhysWidth = oData.width;
      this.nPhysHeight = oData.height;
      this.sThinker = oData.thinker;
      this.nFx = oData.fx;
      this.nType = oData.type;
      if ('data' in oData) {
        this.oXData = oData.data;
      } else {
        this.oXData = {};
      }
    }
  },

  getData: function(sData) {
    if (sData in this.oXData) {
      return this.oXData[sData];
    } else {
      return null;
    }
  }
});



/** Entrée sortie clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Memorise les touches clavier enfoncées
 */
O2.createClass('O876_Raycaster.KeyboardDevice', {
	aKeys: null,	// Index inversée Code->Action
	aKeyBuffer: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	aAliases: null,

	__construct: function() {
		this.aKeys = [];
		this.aAliases = {};
		// Gros tableau pour capter plus rapidement les touches...
		// peu élégant et peu économe mais efficace.
		for (var i = 0; i < 256; i++) {
			this.aKeys.push(0);	 
		}
		this.aKeyBuffer = [];
	},
	
	setAliases: function(a) {
		this.aAliases = a;
	},

	keyAction: function(k, n) {
		this.aKeys[k] = n;
	},
	
	keyBufferPush: function(nKey) {
		if (this.bUseBuffer && nKey && this.aKeyBuffer.length < this.nKeyBufferSize) {
			this.aKeyBuffer.push(nKey);
		}
	},

	eventKeyUp: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		var oDev = window.__keyboardDevice;
		if (nCode in oDev.aAliases) {
			nCode = oDev.aAliases[nCode];
		}
		oDev.keyBufferPush(-nCode);
		oDev.keyAction(nCode, 2);
		return false;
	},

	eventKeyDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var nCode = oEvent.charCode ? oEvent.charCode : oEvent.keyCode;
		var oDev = window.__keyboardDevice;
		if (nCode in oDev.aAliases) {
			nCode = oDev.aAliases[nCode];
		}
		oDev.keyBufferPush(nCode);
		oDev.keyAction(nCode, 1);
		return false;
	},

	/** 
	 * renvoie le code clavier de la première touche enfoncée du buffer FIFO
	 * renvoie 0 si aucune touche n'a été enfoncée
	 * @return int
	 */
	inputKey: function() {
		if (this.aKeyBuffer.length) {
			return this.aKeyBuffer.shift();
		} else {
			return 0;
		}
	},

	plugEvents: function() {
		window.__keyboardDevice = this;
		document.onkeyup = this.eventKeyUp;
		document.onkeydown = this.eventKeyDown;
	},
	
	unplugEvents: function() {
		window.__keyboardDevice = null;
		document.onkeyup = undefined;
		document.onkeydown = undefined;
	}

});


/** Entrée de la souris
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Mémorise les coordonnée de la souris et les touche enfoncées
 */
O2.createClass('O876_Raycaster.MouseDevice', {
	nButtons: 0,
	aEvents: null,
	nKeyBufferSize: 16,
	bUseBuffer: true,
	nSecurityDelay: 0,
	oElement: null,
	
	__construct: function() {
		this.aEvents = [];
	},
	
	clearBuffer: function() {
		this.aEvents = [];
	},

	eventMouseUp: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		oDev.nButtons = oEvent.buttons;
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			oDev.aEvents.push([0, oEvent.clientX, oEvent.clientY, oEvent.button]);
		}
		return false;
	},

	eventMouseDown: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		oDev.nButtons = oEvent.buttons;
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			oDev.aEvents.push([1, oEvent.clientX, oEvent.clientY, oEvent.button]);
		}
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},
	
	eventMouseClick: function(e) {
		var oEvent = window.event ? window.event : e;
		if (oEvent.button === 2) {
			if (oEvent.stopPropagation) {
				oEvent.stopPropagation();
			}
			oEvent.cancelBubble = true;
		}
		return false;
	},
	
	
	/** 
	 * Renvoie le prochain message souris précédemment empilé
	 * ou renvoie "undefined" s'il n'y a pas de message
	 * un message prend ce format :
	 * [ nUpOrDown, X, Y, Button ]
	 * nUpOrDown vaut 0 quand le bouton de la souris est relaché et vaut 1 quand le bouton est enfoncé
	 * il vaut 3 quand la molette de la souris est roulée vers le haut, et -3 vers le bas 
	 */
	inputMouse: function() {
		if (this.nSecurityDelay > 0) {
			--this.nSecurityDelay;
			this.clearBuffer();
			return null;
		} else {
			return this.aEvents.shift();
		}
	},
	
	mouseWheel: function(e) {
		var oEvent = window.event ? window.event : e;
		var oDev = window.__mouseDevice;
		var nDelta = 0;
		if (oEvent.wheelDelta) {
			nDelta = oEvent.wheelDelta; 
		} else {
			nDelta = -40 * oEvent.detail;
		}
		if (oDev.bUseBuffer && oDev.aEvents.length < oDev.nKeyBufferSize) {
			if (e.wheelDelta) {
				nDelta = oEvent.wheelDelta > 0 ? 3 : -3; 
				oDev.aEvents.push([nDelta, 0, 0, 3]);
			} else {
				nDelta = oEvent.detail > 0 ? -3 : 3;
				oDev.aEvents.push([nDelta, 0, 0, 3]);
			}
		}
	},


	/**
	 * Branche le handler de leture souris à l"élément spécifié
	 */
	plugEvents: function(oElement) {
		window.__mouseDevice = this;
		oElement.addEventListener('mousedown', this.eventMouseDown, false);
		oElement.addEventListener('click', this.eventMouseClick, false);
		oElement.addEventListener('mouseup', this.eventMouseUp, false);
		oElement.addEventListener('mousewheel', this.mouseWheel, false);
		oElement.addEventListener('DOMMouseScroll', this.mouseWheel, false);
		this.oElement = oElement;
	},
	
	unplugEvents: function() {
		var oElement = this.oElement;
		oElement.removeEventListener('mousedown', this.eventMouseDown, false);
		oElement.removeEventListener('click', this.eventMouseClick, false);
		oElement.removeEventListener('mouseup', this.eventMouseUp, false);
		oElement.removeEventListener('mousewheel', this.mouseWheel, false);
		oElement.removeEventListener('DOMMouseScroll', this.mouseWheel, false);
	},
	
	clearEvents: function() {
		this.aEvents = [];
	}
});


O2.createClass('O876_Raycaster.FrameCounter', {

	bCheck: false, // when true the FPS is being checked... 
	bLoop: true,
	// if FPS is too low we decrease the LOD
	nFPS: 0,
	nTimeStart: 0,
	nCount: 0,
	nSeconds: 0,
	nAcc: 0,
	
	/**
	 * Starts to count frames per second
	 */
	start: function(nTimeStamp) {
		this.nTimeStart = nTimeStamp;
		this.bCheck = true;
		this.nCount = 0;
	},
	
	getAvgFPS: function() {
		return ((this.nAcc / this.nSeconds) * 10 | 0) / 10;
	},

	/**
	 * count frames per second
	 */
	check: function(nNowTimeStamp) {
		if (this.bCheck) {
			++this.nCount;
			if ((nNowTimeStamp - this.nTimeStart) >= 1000) {
				this.nFPS = this.nCount;
				this.nAcc += this.nCount;
				++this.nSeconds;
				this.bCheck = this.bLoop;
				if (this.bCheck) {
					this.start(nNowTimeStamp);
				}
				return true;
			}
		}
		return false;
	},

});

O2.createObject('O876_Raycaster.FullScreen', {
	enter: function(oElement) {
		oElement.requestFullScreen = oElement.requestFullScreen || oElement.webkitRequestFullScreen || oElement.mozRequestFullScreen;
		oElement.onfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.onwebkitfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.onmozfullscreenchange = O876_Raycaster.FullScreen.changeEvent;
		oElement.requestFullScreen(oElement.ALLOW_KEYBOARD_INPUT);
	},
	
	isFullScreen: function() {
		return document.webkitIsFullScreen || document.mozFullScreen;
	},
	
	changeEvent: function(oEvent) {
		
	}
	
});
/** GXEffect : Classe de base pour les effets graphiques temporisés
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */
O2.createClass('O876_Raycaster.GXEffect', {
  sClass: 'Effect',
  oRaycaster: null,     // référence de retour au raycaster (pour le rendu)

  /** constructeur de l'effet, initialise la référence de raycaster
   * @param oRaycaster référence du raycaster
   */
  __construct: function(oRaycaster) {
    this.oRaycaster = oRaycaster;
  },

  /** Cette fonction doit renvoyer TRUE si l'effet est fini
   * @return bool
   */
  isOver: function() {
    return true;
  },

  /** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
   */
  process: function() {
  },

  /** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
   */
  render: function() {
  },

  /** Fonction appelée lorsque l'effet se termine de lui même
   * ou stoppé par un clear() du manager
   */
  done: function() {
  },

  /** Permet d'avorter l'effet
   * Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
   * (restauration de l'état du laby par exemple)
   */
  terminate: function() {
  }
});


/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * L'écran se colore graduellement d'une couleur unis
 * Permet de produire des effet de fade out pour faire disparaitre le contenu de l'écran
 * - oColor : couleur {r b g a} du fadeout
 * - fAlpha : opacité de départ
 * - fAlpha : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFade', O876_Raycaster.GXEffect, {
	sClass : 'FadeOut',
	oCanvas : null,
	oContext : null,
	nTime : 0,
	fAlpha : 0,
	fAlphaFade : 0,
	oColor : null,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
	},

	isOver : function() {
		return this.fAlphaFade > 0 ? this.fAlpha >= 1 : this.fAlpha <= 0;
	},

	process : function() {
		this.oColor.a = this.fAlpha;
		if (this.oColor.a < 0) {
			this.oColor.a = 0;
		}
		if (this.oColor.a > 1) {
			this.oColor.a = 1;
		}
		this.fAlpha += this.fAlphaFade;
	},

	render : function() {
		this.oContext.fillStyle = GfxTools.buildRGBA(this.oColor);
		this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
	},

	terminate : function() {
		this.fAlpha = this.fAlphaFade > 0 ? 1 : 0;
	}
});

/** Effet graphique temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Colore l'ecran d'un couleur unique qui s'estompe avec le temps
 * Permet de produire des effet de flash rouge ou d'aveuglement
 * - oColor : couleur {r b g a} du flash
 * - fAlpha : opacité de départ
 * - fAlphaFade : Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXFlash', O876_Raycaster.GXEffect, {
  sClass: 'Flash',
  oCanvas: null,
  oContext: null,
  nTime: 0,
  fAlpha: 0,
  fAlphaFade: 0,
  oColor: null,

  __construct: function(oRaycaster) {
    __inherited(oRaycaster);
    this.oCanvas = this.oRaycaster.oCanvas;
    this.oContext = this.oCanvas.getContext('2d'); 
  },

  isOver: function() {
    return this.fAlpha <= 0;
  },

  process: function() {
    this.oColor.a = this.fAlpha;
    if (this.oColor.a < 0) { 
      this.oColor.a = 0;
    }
    if (this.oColor.a > 1) {
      this.oColor.a = 1;
    }
    this.fAlpha -= this.fAlphaFade;
  },

  render: function() {
    this.oContext.fillStyle = GfxTools.buildRGBA(this.oColor);
    this.oContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
  },

  terminate: function() {
    this.fAlpha = 0;
  }
});



/** Gestionnaire d'effets temporisés
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 *
 * Cette classe gère les effet graphique temporisés
 */
O2.createClass('O876_Raycaster.GXManager', {
	aEffects : null, // liste des effets

	/** Le constructeur initialise la liste des effet à vide
	 */
	__construct : function() {
		this.aEffects = [];
	},

	/** Compte le nombre d'effets
	 * @return entier
	 */
	count : function() {
		return this.aEffects.length;
	},

	/** Permet d'ajouter un effet à la liste
	 * @param oEffect un nouveau GXEffect
	 * @return oEffect
	 */
	addEffect : function(oEffect) {
		this.aEffects.push(oEffect);
		return oEffect;
	},

	/** Supprime tous les effet actuels
	 * Lance la methode terminate de chacun d'eux
	 */
	clear : function() {
		for ( var i = 0; i < this.aEffects.length; ++i) {
			this.aEffects[i].terminate();
			this.aEffects[i].done();
		}
		this.aEffects = [];
	},

	/** Lance la methode process() de chaque effet
	 * Supprime les effet qui sont arrivé à terme
	 */
	process : function() {
		var i = this.aEffects.length - 1;
		while (i >= 0) {
			this.aEffects[i].process();
			if (this.aEffects[i].isOver()) {
				this.aEffects[i].done();
				ArrayTools.removeItem(this.aEffects, i);
			}
			i--;
		}
	},

	/** Lance la methode render() de chaque effet
	 */
	render : function() {
		var nLen = this.aEffects.length;
		for ( var i = nLen - 1; i >= 0; i--) {
			this.aEffects[i].render();
		}
	}
});

/**
 * Effet graphique temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet
 * 
 * Affichage d'un message au centre de l'écran - sMessage : Texte à afficher -
 * oColor : couleur {r b g a} du fadeout - fAlpha : opacité de départ - fAlpha :
 * Incrément/Décrément d'opacité
 */
O2.extendClass('O876_Raycaster.GXMessage', O876_Raycaster.GXEffect, {
	sClass: 'Message',
	oCanvas : null,
	oContext : null,
	nTime : 0,
	sMessage : '',
	oMessageCanvas : null,
	xPos : 0,
	yPos : 0,
	xTo : 0,
	yTo : 0,
	yOfs : 48,
	nState : 0,
	fAlpha : 1,
	aPath : null,
	iPath : 0,
	sTextAlign: 'left',
	xTextPos: 0,
	yTextPos: 0,
	nTextHeight: 13,
	fTimePerChar: 150,
	wSize: 512,
	hSize: 40,
	sFontFamily: 'monospace',
	
	// styles
	oStyle: {
		background: 'rgb(255, 255, 255)',
		border: 'rgb(64, 64, 64)',
		text: 'rgb(220, 220, 220)',
		shadow: 'rgb(0, 0, 0)',
		width: 512,
		height: 40,
		font: 'monospace 13',
		speed: 100,
		position: 48
	},
	
	
	oIcon: null,
	

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		var s = this.oStyle;
		this.wSize = s.width;
		this.hSize = s.height;
		this.fTimePerChar = s.speed;
		this.yOfs = s.position;
		s.font.toString().split(' ').forEach((function(sFontProp) {
			if (sFontProp | 0) {
				this.nTextHeight = sFontProp | 0;
			} else {
				this.sFontFamily = sFontProp;
			}
		}).bind(this));
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
		this.oMessageCanvas = O876.CanvasFactory.getCanvas();
		this.oMessageCanvas.width = this.wSize; 
		this.oMessageCanvas.height = this.hSize;
		this.xPos = this.xTo = (this.oCanvas.width - this.oMessageCanvas.width) >> 1;
		this.yPos = 0;
		this.yTo = 16;
		this.xAcc = 0;
		this.yAcc = -2;
		this.buildPath();
		if (this.sTextAlign == 'center') {
			this.xTextPos = this.oMessageCanvas.width >> 1; 
		} else {
			this.xTextPos = this.oMessageCanvas.height >> 1; 
		}
		this.yTextPos = (this.nTextHeight >> 1) + (this.oMessageCanvas.height >> 1);
	},
	
	drawIcon: function(oSource, x, y, w, h) {
		var nOffset = (this.oMessageCanvas.height - 32) >> 1;
		this.oMessageCanvas.getContext('2d').drawImage(oSource, x, y, w, h, nOffset, nOffset, 32, 32);
		this.xTextPos += 32;
		this.oIcon = null;
	},
	
	setIcon: function(oSource, x, y, w, h) {
		this.oIcon = {
			src: oSource,
			x: x,
			y: y,
			w: w,
			h: h
		};
	},
	
	setMessage: function(sMessage) {
		this.sMessage = sMessage;
		this.nTime = sMessage.length * this.fTimePerChar / this.oRaycaster.TIME_FACTOR | 0;
	},
	
	getTime: function() {
		return this.nTime;
	},

	isOver : function() {
		return this.nState >= 4;
	},

	buildPath : function() {
		this.aPath = [];
		var nWeightPos = 1;
		var nWeightTo = 1;
		var nSum = nWeightPos + nWeightTo;
		var bMove;
		var xPos = this.xPos;
		var yPos = this.yPos;
		do {
			bMove = false;
			if (xPos != this.xTo) {
				if (Math.abs(xPos - this.xTo) < 1) {
					xPos = this.xTo;
				} else {
					xPos = (xPos * nWeightPos + this.xTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (yPos != this.yTo) {
				if (Math.abs(yPos - this.yTo) < 1) {
					yPos = this.yTo;
				} else {
					yPos = (yPos * nWeightPos + this.yTo * nWeightTo) / nSum;
				}
				bMove = true;
			}
			if (bMove) {
				this.aPath.push( [ xPos | 0, yPos + this.yOfs | 0, 1 ]);
			}
		} while (bMove && this.aPath.length < 20);
		for (var i = this.aPath.length - 2; i >= 0; i--) {
			this.aPath[i][2] = Math.max(0, this.aPath[i + 1][2] - 0.2); 
		}
	},

	movePopup : function() {
		if (this.iPath < this.aPath.length) {
			var aPos = this.aPath[this.iPath];
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
			this.iPath++;
		}
	},

	reverseMovePopup : function() {
		if (this.aPath.length) {
			var aPos = this.aPath.pop();
			this.xPos = aPos[0];
			this.yPos = aPos[1];
			this.fAlpha = aPos[2];
		}
	},

	// Début : création du message dans un canvas
	process : function() {
		switch (this.nState) {
		case 0:
			var sMessage = this.sMessage;
			var oCtx = this.oMessageCanvas.getContext('2d');
			oCtx.font = this.nTextHeight.toString() + 'px ' + this.sFontFamily;
			oCtx.textAlign = this.sTextAlign;
			oCtx.fillStyle = this.oStyle.background;
			oCtx.strokeStyle = this.oStyle.border;
			oCtx.fillRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			oCtx.strokeRect(0, 0, this.oMessageCanvas.width, this.oMessageCanvas.height);
			if (this.oIcon) {
				this.drawIcon(this.oIcon.src, this.oIcon.x, this.oIcon.y, this.oIcon.w, this.oIcon.h);
			}
			var nTextWidth = oCtx.measureText(sMessage).width;
			if ((nTextWidth + this.xTextPos + 2) < this.wSize) {
				oCtx.fillStyle = this.oStyle.text;
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2);
				oCtx.fillStyle = this.oStyle.shadow;
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos);
			} else {
				// faut mettre sur deux lignes (mais pas plus)
				var sMessage2 = '';
				var aWords = sMessage.split(' ');
				while (aWords.length > 0 && (oCtx.measureText(sMessage2 + aWords[0]).width + this.xTextPos + 8) < this.wSize) {
					sMessage2 += aWords.shift();
					sMessage2 += ' ';
				}
				sMessage = aWords.join(' ');
				oCtx.fillStyle = this.oStyle.text;
				var yLine = (this.nTextHeight >> 1) + 2;
				oCtx.fillText(sMessage2, this.xTextPos + 2, this.yTextPos + 2 - yLine);
				oCtx.fillText(sMessage, this.xTextPos + 2, this.yTextPos + 2 + yLine);
				oCtx.fillStyle = this.oStyle.shadow;
				oCtx.fillText(sMessage2, this.xTextPos, this.yTextPos - yLine);
				oCtx.fillText(sMessage, this.xTextPos, this.yTextPos + yLine);
			}
			this.nState++;
			this.fAlpha = 0;
			break;

		case 1:
			this.movePopup();
			this.nTime--;
			if (this.nTime <= 0) {
				this.yTo = -this.oMessageCanvas.height;
				this.nState++;
			}
			break;

		case 2:
			if (this.aPath.length === 0) {
				this.nState++;
			}
			this.reverseMovePopup();
			break;

		case 3:
			this.oMessageCanvas = null;
			this.terminate();
			break;
		}
	},

	render : function() {
		if (this.fAlpha > 0) {
			var a = this.oContext.globalAlpha;
			this.oContext.globalAlpha = this.fAlpha;
			this.oContext.drawImage(this.oMessageCanvas,
					this.xPos | 0, this.yPos | 0);
			this.oContext.globalAlpha = a;
		}
	},

	terminate : function() {
		this.nState = 4;
	}
});

/**
 * Effet spécial temporisé O876 Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet Cet effet gère l'ouverture et la fermeture des
 *         portes, ce n'est pas un effet visuel a proprement parlé L'effet se
 *         sert de sa référence au raycaster pour déterminer la présence
 *         d'obstacle génant la fermeture de la porte C'est la fonction de
 *         temporisation qui est exploitée ici, même si l'effet n'est pas
 *         visuel.
 */
O2.extendClass('O876_Raycaster.GXSecret', O876_Raycaster.GXEffect, {
	sClass : 'Secret',
	nPhase : 0, // Code de phase : les block secrets ont X
				// phases : 0: fermé(init), 1: ouverture block
				// 1, 2: ouverture block 2, 3: terminé
	oRaycaster : null, // Référence au raycaster
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la
				// porte
	nLimit : 0, // Limite d'offset de la porte

	__construct: function(r) {
		__inherited(r);
		this.nLimit = r.nPlaneSpacing;
	},
	
	isOver : function() {
		return this.nPhase >= 3;
	},

	seekBlockSecret : function(dx, dy) {
		if (this.oRaycaster.getMapXYPhysical(this.x + dx,
				this.y + dy) == this.oRaycaster.PHYS_SECRET_BLOCK) {
			this.oRaycaster.setMapXYPhysical(this.x, this.y, 0);
			Marker.clearXY(this.oRaycaster.oDoors, this.x,
					this.y);
			this.x += dx;
			this.y += dy;
			Marker.markXY(this.oRaycaster.oDoors, this.x,
					this.y, this);
			return true;
		}
		return false;
	},

	seekBlockSecret4Corners : function() {
		if (this.seekBlockSecret(-1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, 1)) {
			return;
		}
		if (this.seekBlockSecret(1, 0)) {
			return;
		}
		if (this.seekBlockSecret(0, -1)) {
			return;
		}
	},

	process : function() {
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(this.oRaycaster.oDoors, this.x,
						this.y, this);
				this.fSpeed = this.oRaycaster.TIME_FACTOR * 40 / 1000;
				this.nPhase++; /** no break here */
				// passage au case suivant
			case 1: // le block se pousse jusqu'a : offset > limite
				this.fOffset += this.fSpeed;
				if (this.fOffset >= this.nLimit) {
					this.fOffset = this.nLimit - 1;
					// rechercher le block secret suivant
					this.seekBlockSecret4Corners();
					this.nPhase++;
					this.fOffset = 0;
				}
				break;
	
			case 2: // le 2nd block se pousse jusqu'a : offset >
					// limite
				this.fOffset += this.fSpeed;
				if (this.fOffset >= this.nLimit) {
					this.fOffset = this.nLimit - 1;
					this.oRaycaster.setMapXYPhysical(this.x,
							this.y, 0);
					Marker.clearXY(this.oRaycaster.oDoors, this.x,
							this.y);
					this.nPhase++;
					this.fOffset = 0;
				}
				break;
		}
		this.oRaycaster.setMapXYOffset(this.x, this.y,
				this.fOffset | 0);
	},

	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se
		// positionner en phase 3 et partir
		switch (this.nPhase) {
		case 0:
			this.nPhase = 3;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			break;
	
		case 1:
		case 2:
			this.fOffset = 0;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			this.oRaycaster.setMapXYPhysical(this.x, this.y, 0);
			break;
		}
	}
});

/** Gestion de la horde de sprite
 * L'indice des éléments de cette horde n'a pas d'importance.
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Horde',  {
	oRaycaster : null,
	oThinkerManager : null,
	aMobiles : null,
	aStatics : null,
	aSprites : null,
	oBlueprints : null,
	oTiles : null,
	nTileCount : 0,
	oImageLoader : null,
	oMobileDispenser : null,
	xTonari: [ 0, 0, 1, 1, 1, 0, -1, -1, -1 ],
	yTonari: [ 0, -1, -1, 0, 1, 1, 1, 0, -1 ],

	__construct : function(r) {
		this.oRaycaster = r;
		this.oImageLoader = this.oRaycaster.oImages;
		this.oMobileDispenser = new O876_Raycaster.MobileDispenser();
		this.aMobiles = [];
		this.aStatics = [];
		this.aSprites = [];
		this.oBlueprints = {};
		this.oTiles = {};
	},

	/** lance think pour chaque élément de la horde
	 */
	think : function() {
		var oMobile;
		var i = 0;
		while (i < this.aMobiles.length) {
			oMobile = this.aMobiles[i];
			oMobile.think();
			if (oMobile.bActive) {
				i++;
			} else {
				this.unlinkMobile(oMobile);
				this.oMobileDispenser.pushMobile(oMobile.oSprite.oBlueprint.sId, oMobile);
			}
		}
	},

	/**
	 * {src, width, height, frames}
	 */
	defineTile : function(sId, aData) {
		this.nTileCount++;
		var oTile = new O876_Raycaster.Tile(aData);
		oTile.oImage = this.oImageLoader.load(oTile.sSource);
		this.oTiles[sId] = oTile;
		return oTile;
	},

	/**
	 * {id, tile, width, height, speed, rotspeed}
	 *   
	 */
	defineBlueprint : function(sId, aData) {
		var oBP = new O876_Raycaster.Blueprint(aData);
		oBP.oTile = this.oTiles[aData.tile];
		oBP.sId = sId;
		this.oBlueprints[sId] = oBP;
		this.oMobileDispenser.registerBlueprint(sId);
	},

	// {blueprint}
	defineSprite : function(aData) {
		var oSprite = new O876_Raycaster.Sprite();
		oSprite.oBlueprint = this.oBlueprints[aData.blueprint];
		this.aSprites.push(oSprite);
		return oSprite;
	},

	// Ajoute un mobile existant dans la liste
	/**
	 * @param oMobile
	 */
	linkMobile : function(oMobile) {
		oMobile.bActive = true;
		this.aMobiles.push(oMobile);
		return oMobile;
	},

	unlinkMobile : function(oMobile) {
		var nHordeRank = this.aMobiles.indexOf(oMobile);
		if (nHordeRank < 0) {
			this.unlinkStatic(oMobile);
			return;
		}
		ArrayTools.removeItem(this.aMobiles, nHordeRank);
	},
	

	unlinkStatic : function(oMobile) {
		var nHordeRank = this.aStatics.indexOf(oMobile);
		if (nHordeRank < 0) {
			return;
		}
		ArrayTools.removeItem(this.aStatics, nHordeRank);
		// Un static n'a pas de thinker il faut le sortir du laby ici.
        this.oRaycaster.oMobileSectors.unregister(oMobile);
        oMobile.xSector = -1;
        oMobile.ySector = -1;
	},
	

	/**
	 * Définition d'un Mobile
	 * @param aData donnée de définition
	 * @return O876_Raycaster.Mobile
	 */ 	
	defineMobile : function(aData) {
		var oMobile = new O876_Raycaster.Mobile();
		oMobile.oRaycaster = this.oRaycaster;
		oMobile.oSprite = this.defineSprite(aData);
		var oThinker = null;
		if (oMobile.oSprite.oBlueprint.sThinker !== null) {
			oThinker = this.oThinkerManager.createThinker(oMobile.oSprite.oBlueprint.sThinker);
		}
		oMobile.setThinker(oThinker);
		oMobile.fTheta = aData.angle;
		oMobile.nSize = oMobile.oSprite.oBlueprint.nPhysWidth >> 1;
		oMobile.setXY(aData.x, aData.y);
		if (oThinker) {
			this.linkMobile(oMobile);
		} else {
			this.aStatics.push(oMobile);
			oMobile.bVisible = true;
			oMobile.bEthereal = true;
			oMobile.bActive = true;
		}
		return oMobile;
	},

	/**
	 * Création d'un nouveau mobile
	 * @param sBlueprint string, blueprint
	 * @param x ...
	 * @param y position initiale
	 * @param fTheta angle initial
	 * @return O876_Raycaster.Mobile
	 */
	spawnMobile : function(sBlueprint, x, y, fTheta) {
		var oMobile = this.oMobileDispenser.popMobile(sBlueprint);
		if (oMobile === null) {
			var aData = {
				blueprint : sBlueprint,
				x : x,
				y : y,
				angle : fTheta
			};
			return this.defineMobile(aData);
		} else {
			this.linkMobile(oMobile);
			oMobile.fTheta = fTheta;
			oMobile.setXY(x, y);
			return oMobile;
		}
	},


	getMobile : function(n) {
		return this.aMobiles[n];
	},

	getMobileCount : function() {
		return this.aMobiles.length;
	},

	/** Test si le mobile spécifié entre en collision avec un autre mobile
	 */
	computeCollision : function(oMobile) {
		var xTonari = this.xTonari;
		var yTonari = this.yTonari;
		var oRegister = this.oRaycaster.oMobileSectors;
		var oSector;
		var i;
		var oOther, iOther, nSectorLength;
		for (i = 0; i < 9; i++) {
			oSector = oRegister.get(oMobile.xSector + xTonari[i],
					oMobile.ySector + yTonari[i]);
			if (oSector !== null) {
				nSectorLength = oSector.length;
				for (iOther = 0; iOther < nSectorLength; ++iOther) {
					oOther = oSector[iOther];
					if (oOther != oMobile) {
						if (oMobile.hits(oOther)) {
							oMobile.oMobileCollision = oOther;
							return;
						}
					}
				}
			}
		}
		oMobile.oMobileCollision = null;
	},
	
	getAllocatedMemory: function() {
		var nRes = 0, oTile;
		for (var s in this.oTiles) {
			oTile = this.oTiles[s];
			nRes += oTile.oImage.width * oTile.oImage.height * 4;
		}
		return nRes;
	}
});

/** Classe gérant le chargement des images
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 *
 */
O2.createClass('O876_Raycaster.ImageLoader', {
	oImages : null,
	aLoading : null,
	bComplete : false,
	nLoaded : 0,
	oStats: null,

	__construct : function() {
		this.oImages = {};
		this.aLoading = [];
		this.oStats = {
			images: {},
			totalsize: 0
		};
	},
	
	
	/** 
	 * Permet de vider les images déja chargées
	 */
	finalize: function() {
		this.aLoading = null;
		for(var i in this.oImages) {
			this.oImages[i] = null;
		}
		this.oImages = null;
		this.oStats = null;
	},

	/** Chargement d'une image.
	 * Si l'image est déja chargée, renvoie sa référence
	 * @param sUrl chaine url de l'image
	 * @return référence de l'objet image instancié
	 */
	load : function(sUrl) {
		if (!(sUrl in this.oImages)) {
			this.oImages[sUrl] = new Image();
			this.oImages[sUrl].src = sUrl;
		}
		this.bComplete = false;
		this.aLoading.push(this.oImages[sUrl]);
		// L'image n'est pas chargée -> on la mets dans la liste "en chargement"
		return this.oImages[sUrl];
	},

	complete : function() {
		if (this.bComplete) {
			return true;
		}
		this.nLoaded = 0;
	
		this.bComplete = true;
		for (var i = 0; i < this.aLoading.length; i++) {
			if (this.aLoading[i].complete) {
				this.nLoaded++;
			} else {
				this.bComplete = false;
			}
		}
		if (this.bComplete) {
			this.aLoading = [];
			var oImg;
			for (var sImg in this.oImages) {
				oImg = this.oImages[sImg];
				this.oStats.images[sImg] = oImg.width * oImg.height * 4;
				this.oStats.totalsize += this.oStats.images[sImg];
			}
		}
		return this.bComplete;
	},
	
	countLoading : function() {
		if (this.bComplete) {
			return this.nLoaded;
		} else {
			return this.aLoading.length;
		}
	},
	
	countLoaded : function() {
		return this.nLoaded;
	}
});

O2.createClass('O876_Raycaster.Minimap',  {

	oRaycaster: null,
	aSquares: null,
	aModified: null,
	aColors: null,
	oCanvas: null,
	oContext: null,
	
	aPixels: null,
	
	bRestricted : true, // affichage reduit pour ne pas detecter les autre joeur
	
	reset: function(oRaycaster) {
		this.aColors = [
              '#000000', // mur
              '#FF8888', // missiles
              '#00FF00', // mobiles
              '#00FFFF', 
              '#5588AA', // champ de vision
              '#FF00FF',
              '#FFFF00',
              '#555555', // vide             
              '#777777'  // placeable
		];
		this.oRaycaster = oRaycaster;
		this.aSquares = [];
		this.aModified = [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var aSqrRaw;
		var x, y;
		for (y = 0; y < this.oRaycaster.nMapSize; y++) {
			aSqrRaw = [];
			for (x = 0; x < this.oRaycaster.nMapSize; x++) {
				aSqrRaw.push([-1, false, x, y]);
			}
			this.aSquares.push(aSqrRaw);
		}
		if (this.oCanvas === null) {
			this.oCanvas = O876.CanvasFactory.getCanvas();
		}
		this.oCanvas.width = this.oCanvas.height = this.oRaycaster.nMapSize << 2;
		var ctx = this.oCanvas.getContext('2d');

		var pix = [];
		this.aColors.forEach(function(sItem, i, a) {
			var oID = ctx.createImageData(1, 1);
			var d = oID.data;
			d[0] = 100;//parseInt('0x' + sItem.substr(1, 2));
			d[1] = 200;//parseInt('0x' + sItem.substr(3, 2));
			d[2] = 50;//parseInt('0x' + sItem.substr(5, 2));
			d[3] = 1;
			pix.push(oID);
		});
		this.aPixels = pix;
		this.oContext = ctx;
	},
	
	setSquare: function(x, y, n) {
		var q = this.aSquares[y][x];
		if (q[0] != n) {
			q[0] = n;
			if (!q[1]) {
				q[1] = true;
				this.aModified[n].push(q);
			}
		}
	},
	
	getMobileColor: function(aMobiles) {
		var l = aMobiles.length;
		var m, nType, bPlaceable = false;
		for (var i = 0; i < l; ++i) {
			m = aMobiles[i];
			nType = m.getType();
			if (nType == RC.OBJECT_TYPE_PLAYER || nType == RC.OBJECT_TYPE_MOB) {
				return 2;
			}
			if (nType == RC.OBJECT_TYPE_MISSILE) {
				return 1;
			}
			if (nType == RC.OBJECT_TYPE_PLACEABLE) {
				bPlaceable = true;
			}
		}
		return bPlaceable ? 8 : 7;
	},
	
	render: function() {
		var rc = this.oRaycaster;
		var nMapSize = rc.nMapSize;
		var x, y, nColor;
		for (y = 0; y < nMapSize; y++) {
			for (x = 0; x < nMapSize; x++) {
				if (this.bRestricted && rc.oCamera.xSector === x && rc.oCamera.ySector === y) {
					nColor = 2;
				} else if (this.bRestricted === false && rc.oMobileSectors.get(x, y).length) {
					nColor = this.getMobileColor(rc.oMobileSectors.get(x, y));  // mobile
				} else if (Marker.getMarkXY(rc.aScanSectors, x, y)) {
					nColor = 4;  // champ de vision joueur
				} else if (rc.getMapXYPhysical(x, y)) {
					nColor = 0;  // mur
				} else {
					nColor = 7;  // vide
				}
				this.setSquare(x, y, nColor);
			}
		}
		var q, mc, m = this.aModified;
		for (nColor = 0; nColor < m.length; nColor++) {
			if (this.aColors[nColor]) {
				mc = m[nColor];
				this.oContext.fillStyle = this.aColors[nColor];
				while (mc.length) {
					q = mc.shift();
					this.oContext.fillRect(q[2], q[3], 1, 1);
					q[1] = false;
				}
			}
		}
		rc.oRenderContext.drawImage(this.oCanvas, 2, 2);
	}
	
});

/** La classe mobile permet de mémoriser la position des objets circulant dans le laby
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.Mobile', {
	oRaycaster: null,						// Référence de retour au raycaster
	x: 0,									// position du mobile
	y: 0,									// ...
	xSave: 0,
	ySave: 0,

	// flags
	bActive: false,							// Flag d'activité
	bEthereal: false,						// Flage de collision globale

	fTheta: 0,								// Angle de rotation
	fMovingAngle: 0,						// Angle de déplacement
	fSpeed: 0,								// Vitesse de déplacement initialisée à partir du blueprint du sprite
	fMovingSpeed: 0,						// Dernière vitesse enregistrée
	fRotSpeed: 0,							// Vitesse de rotation initialisée à partir du blueprint du sprite
	xInertie: 0,							// Vitesse utilisée pour accelerer les calculs...
	yInertie: 0,							// ... lorsque vitesse et angle sont conservée
	xSpeed: 0,								// Dernière vitesse X appliquée
	ySpeed: 0,								// Dernière vitesse Y appliquée
	xSector: -1,							// x Secteur d'enregistrement pour les collision ou les test de proximité
	ySector: -1,							// y ...	
	nSectorRank: -1,						// Rang dans le secteur pour un repérage facile
	nSize: 16,								// Taile du polygone de collision mobile-mur
	oSprite: null,							// Référence du sprite
	xCollisions: [0, 1, 0, -1],	// Tableau des collision
	yCollisions: [-1, 0, 1, 0],	// ...
	oThinker: null,
	oWallCollision: null,					// x: bool : on bumpe un mur qui empeche la progression en X
	oMobileCollision: null,
	oFrontCell: null,						// coordonnées du bloc devant soit

	nBlueprintType: null,					// type de mobile : une des valeurs de GEN_DATA.blueprintTypes
	bSlideWall: true,						// True: corrige la trajectoire en cas de collision avec un mur
	bVisible: true,							// Visibilité au niveau du mobile (le sprite dispose de sont propre flag de visibilité prioritaire à celui du mobile)

	oData: null,


	getBlueprint: function(sXData) {
		if (this.oSprite) {
			if (sXData === undefined) {
				return this.oSprite.oBlueprint;
			} else {
				return this.oSprite.oBlueprint.getData(sXData);
			}
		} else {
			return null;
		}
	},

	/** Renvoie le type de blueprint
	 * Si le mobile n'a pas de sprite (et n'a pas de blueprint)
	 * On renvoie 0, c'est généralement le cas pour le mobile-caméra
	 */
	getType: function() {
		if (this.nBlueprintType === null) {
			if (this.oSprite) {
				this.nBlueprintType = this.oSprite.oBlueprint.nType;
			} else if (this == this.oRaycaster.oCamera){
				this.nBlueprintType = RC.OBJECT_TYPE_PLAYER;
			} else {
				this.nBlueprintType = RC.OBJECT_TYPE_NONE;
			}
		}
		return this.nBlueprintType;
	},

	setData: function(sData, xValue) {
		if (this.oData === null) {
			this.oData = {};
		}
		if (xValue === undefined || xValue === null) {
			delete this.oData[sData];
		} else {
			this.oData[sData] = xValue;
		}
	},

	/** 
	 * Permet de récupérer des données de l'objet local Data
	 * ou de l'objet oXData du blueprint
	 * (local en priorité)
	 * @param sData nom de la donnée
	 * @return valeur de la donnée
	 */
	getData: function(sData) {
		if (this.oData === null) {
			this.oData = {};
		}
		if (sData in this.oData) {
			return this.oData[sData];
		} else {
			return this.getBlueprint(sData);
		}
	},

	// évènements

	setThinker: function(oThinker) {
		this.oThinker = oThinker;
		if (oThinker) {
			this.oThinker.oMobile = this;
		}
		this.oWallCollision = {x: 0, y: 0};
		this.gotoLimbo();
	},
	
	getThinker: function() {
		return this.oThinker;
	},

	think: function() {
		this.xSave = this.x;
		this.ySave = this.y;
		if (this.oThinker) {
			this.xSpeed = 0;
			this.ySpeed = 0;
			this.oThinker.think();
		}
	},
	
	/** Modifie l'angle de la caméra d'un delta.
	 * @param f float delta en radiant
	 */
	rotate: function(f) {
		this.setAngle(this.fTheta + f);
	},

	setAngle: function(f) {
		this.fTheta = f;
		var f2Pi = 2 * PI;
		if (f > 0) {
			while (this.fTheta >= PI) {
				this.fTheta -= f2Pi;
			}
		} else {
			while (this.fTheta < -PI) {
				this.fTheta += f2Pi;
			}
		}
	},
	
	/** 
	 * Renvoie les coordonnée du bloc devant le mobile
	 * @param oMobile
	 * @return object x y
	 */
	getFrontCellXY: function() {
		if (this.oFrontCell === null) {
			this.oFrontCell = {};
		}
		var rc = this.oRaycaster;
		var nActionRadius = rc.nPlaneSpacing * 0.75;
		this.oFrontCell.x = (this.x + Math.cos(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		this.oFrontCell.y = (this.y + Math.sin(this.fTheta) * nActionRadius) / rc.nPlaneSpacing | 0;
		return this.oFrontCell;
	},


	/** Quitte la grille de collision de manière à ne plus interférer avec les autres sprites
	 *
	 */
	gotoLimbo: function() {
		this.oRaycaster.oMobileSectors.unregister(this);
		this.xSector = -1;
		this.ySector = -1;
	},

	/** Modifie la position du mobile
	 * @param x nouvelle position x
	 * @param y nouvelle position y
	 */
	setXY: function(x, y) {
		var rc = this.oRaycaster;
		var ps = rc.nPlaneSpacing;
		this.x = x;
		this.y = y;
		var xs = x / ps | 0;
		var ys = y / ps | 0;
		if (xs != this.xSector || ys != this.ySector) {
			rc.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			rc.oMobileSectors.register(this);
		}
		// collision intersprites
		this.oRaycaster.oHorde.computeCollision(this);
	},

	rollbackXY: function() {
		var ps = this.oRaycaster.nPlaneSpacing;
		this.x = this.xSave;
		this.y = this.ySave;
		this.xSpeed = 0;
		this.ySpeed = 0;
		var xs = this.x / ps | 0;
		var ys = this.y / ps | 0;
		if (xs != this.xSector || ys != this.ySector) {
			this.oRaycaster.oMobileSectors.unregister(this);
			this.xSector = xs;
			this.ySector = ys;
			this.oRaycaster.oMobileSectors.register(this);
		}
	},

	/**
	 * Fait glisser le mobile
	 * détecte les collision avec le mur
	 */
	slide: function(dx, dy) {
		var xc = this.xCollisions;
		var yc = this.yCollisions;
		var x = this.x;
		var y = this.y;
		var ix, iy;
		var ps = this.oRaycaster.nPlaneSpacing;
		var nSize = this.nSize;
		var wc = this.oWallCollision;
		wc.x = 0;
		wc.y = 0;
		var nXYFormula = (Math.abs(dx) > Math.abs(dy) ? 1 : 0) | ((dx > dy) || (dx == dy && dx < 0) ? 2 : 0);
		var bCorrection = false;
		for (var i = 0; i < 4; ++i) {
			if (nXYFormula == i) {
				continue;
			}
			ix = nSize * xc[i] + x;
			iy = nSize * yc[i] + y;
			if (this.oRaycaster.clip(ix + dx, iy, 1)) {
				dx = 0;
				if (!this.bSlideWall) {
					dy = 0;
				}
				wc.x = xc[i];
				bCorrection = true;
			}
			if (this.oRaycaster.clip(ix, iy + dy, 1)) {
				dy = 0;
				if (!this.bSlideWall) {
					dx = 0;
				}
				wc.y = yc[i];
				bCorrection = true;
			}
		}
		if (bCorrection) {
			if (wc.x > 0) {
				x = (x / ps | 0) * ps + ps - 1 - nSize;
			} else if (wc.x < 0) {
				x = (x / ps | 0) * ps + nSize;
			}
			if (wc.y > 0) {
				y = (y / ps | 0) * ps + ps - 1 - nSize;
			} else if (wc.y < 0) {
				y = (y / ps | 0) * ps + nSize;
			}
			bCorrection = false;
		}
		this.setXY(x + dx, y + dy);
		this.xSpeed = dx;
		this.ySpeed = dy;
	},
	
	

	/** Déplace la caméra d'un certain nombre d'unité vers l'avant
	 * @param fDist float Distance de déplacement
	 */
	move: function(fAngle, fDist) {
		if (this.fMovingAngle != fAngle || this.fMovingSpeed != fDist) {
			this.fMovingAngle = fAngle;
			this.fMovingSpeed = fDist;
			this.xInertie = Math.cos(fAngle) * fDist;
			this.yInertie = Math.sin(fAngle) * fDist;
		}
		this.slide(this.xInertie, this.yInertie);
	},

	/** Test de collision avec le mobile spécifié
	 * @param oMobile mobile susceptible d'entrer en collision
	 * @returnn bool
	 */
	hits: function(oMobile) {
		if (this.bEthereal || oMobile.bEthereal) {
			return false;
		}
		var dx = oMobile.x - this.x;
		var dy = oMobile.y - this.y;
		var d2 = dx * dx + dy * dy;
		var dMin = this.nSize + oMobile.nSize;
		dMin *= dMin;
		return d2 < dMin;
	},

	/** Fait tourner le mobile dans le sens direct en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateLeft: function() {
		this.rotate(-this.fRotSpeed);
	},

	/** Fait tourner le mobile dans le sens retrograde en fonction de la vitesse de rotation
	 * si la vitesse est négative le sens de rotation est inversé
	 */
	rotateRight: function() {
		this.rotate(this.fRotSpeed);
	},

	/** Déplace le mobile vers l'avant, en fonction de sa vitesse
	 */
	moveForward: function() {
		this.move(this.fTheta, this.fSpeed);
	},

	/** Déplace le mobile vers l'arrière, en fonction de sa vitesse
	 */
	moveBackward: function() {
		this.move(this.fTheta, -this.fSpeed);
	},

	/** Déplace le mobile d'un mouvement latéral vers la gauche, en fonction de sa vitesse
	 */
	strafeLeft: function() {
		this.move(this.fTheta - PI / 2, this.fSpeed);
	},

	/** Déplace le mobile d'un mouvement latéral vers la droite, en fonction de sa vitesse
	 */
	strafeRight: function() {
		this.move(this.fTheta + PI / 2, this.fSpeed);
	}
});


/** Classe de distribution optimisée de mobiles
 * O876 Raycaster project
 * @date 2012-04-04
 * @author Raphaël Marandet 
 * 
 * Classe gérant une liste de mobile qui seront réutilisé à la demande.
 * Cette classe permet de limiter le nom de d'instanciation/destruction
 */
O2.createClass('O876_Raycaster.MobileDispenser', {
  aBlueprints: null,

  __construct: function() {
    this.aBlueprints = {};
  },

  registerBlueprint: function(sId) {
    this.aBlueprints[sId] = [];
  },

  /** Ajoute un mobile dans sa pile de catégorie
   */
  pushMobile: function(sBlueprint, oMobile) {
    this.aBlueprints[sBlueprint].push(oMobile);
  },

  /**
   * @return O876_Raycaster.Mobile
   */
  popMobile: function(sBlueprint) {
    if (this.aBlueprints[sBlueprint].length) {
      return this.aBlueprints[sBlueprint].pop();
    } else {
      return null;
    }
  },

  render: function() {
    var sRender = '';
    for (var sBlueprint in this.aBlueprints) {
      if (this.aBlueprints[sBlueprint].length) {
        sRender += '[' + sBlueprint + ': ' + this.aBlueprints[sBlueprint].length.toString() + ']';
      }
    }
    return sRender;
  }
});

/** Registres des mobiles. Permet d'enregistrer les mobile dans les secteurs composant le labyrinthe et de pouvoir
 * Organiser plus efficacement les collisions inter-mobile (on n'effectue les tests de collision qu'entre les mobiles des secteur proches).
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 */
O2.createClass('O876_Raycaster.MobileRegister', {
  aSectors: null,         // Secteurs
  nSize: 0,               // Taille des secteur (diviseur position mobile -> secteur)

  /** Construit l'instance en initialisant la taille des secteur 
   * @param n int, taille des secteurs
   */
  __construct: function(n) {
    var x, y;
    this.nSize = n;
    this.aSectors = {};
    for (x = 0; x < n; x++) {
      this.aSectors[x] = {};
      for (y = 0; y < n; y++) {
        this.aSectors[x][y] = [];
      }
    }
  },

  /** Renvoie la référence d'un secteur, la fonction n'effectue pas de test de portée, aussi attention aux paramètres foireux.
   * @param x position du secteur recherché
   * @param y ...
   * @return Secteur trouvé
   */
  get: function(x, y) {
    if (x >= 0 && y >= 0 && y < this.nSize && x < this.nSize) {
      return this.aSectors[x][y];
    } else {
      return null;
    }
  },
  
  /** Désenregistre un mobile de son secteur
   * @param oMobile mobile à désenregistrer
   */
  unregister: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = oMobile.nSectorRank;
    if (n == (aSector.length - 1)) {
      aSector.pop();
      oMobile.nSectorRank = -1;
    } else {
      aSector[n] = aSector.pop();
      aSector[n].nSectorRank = n;
    }
  },

  /** Enregistre en mobile dans son secteur, le mobile sera enregistré dans le secteur qu'il occupe réellement, calculé à partir de sa position
   * @param oMobile
   */
  register: function(oMobile) {
    if (oMobile.xSector < 0 || oMobile.ySector < 0 || oMobile.xSector >= this.nSize || oMobile.ySector >= this.nSize) {
      return;
    }
    var aSector = this.aSectors[oMobile.xSector][oMobile.ySector];
    var n = aSector.length;
    aSector.push(oMobile);
    oMobile.nSectorRank = n;
  }
});


/**
 * Api de gestion du fullscreen et de la capture de souris
 */

O2.createObject('O876_Raycaster.PointerLock', {
	
	oElement: null,
	oHookInstance: null,
	oHookFunction: null,
	bInitialized: null,
	bLocked: false,
	bEnabled: true,
	
	hasPointerLockFeature: function() {
		return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	},
	
	init: function() {
		if (!O876_Raycaster.PointerLock.hasPointerLockFeature()) {
			return false;
		}
		if (O876_Raycaster.PointerLock.bInitialized) {
			return true;
		}
		document.addEventListener('pointerlockchange', O876_Raycaster.PointerLock.eventChange, false);
		document.addEventListener('mozpointerlockchange', O876_Raycaster.PointerLock.eventChange, false);
		document.addEventListener('webkitpointerlockchange', O876_Raycaster.PointerLock.eventChange, false);
		document.addEventListener('pointerlockerror', O876_Raycaster.PointerLock.eventError, false);
		document.addEventListener('mozpointerlockerror', O876_Raycaster.PointerLock.eventError, false);
		document.addEventListener('webkitpointerlockerror', O876_Raycaster.PointerLock.eventError, false);
		O876_Raycaster.PointerLock.bInitialized = true;
		return true;
	},
	
	/**
	 * Renvoie TRUE si le pointer à été desactivé
	 */
	locked: function() {
		return O876_Raycaster.PointerLock.bLocked;
	},
	
	/**
	 * La fonction Hook doit être écrite de la manière suivante :
	 * myEventFunction: function(xMode, yMove) { ...
	 */
	setHook: function(oFunction, oInstance) {
		O876_Raycaster.PointerLock.oHookInstance = oInstance || window;
		O876_Raycaster.PointerLock.oHookFunction = oFunction;
	},

	requestPointerLock: function(oElement) {
		if (!O876_Raycaster.PointerLock.bEnabled) {
			return;
		}
		if (O876_Raycaster.PointerLock.locked()) {
			return;
		}
		O876_Raycaster.PointerLock.oElement = oElement;
		oElement.requestPointerLock = oElement.requestPointerLock || oElement.mozRequestPointerLockWithKeys || oElement.mozRequestPointerLock || oElement.webkitRequestPointerLock;
		oElement.requestPointerLock();
	},
	
	exitPointerLock: function() {
		if (!O876_Raycaster.PointerLock.locked()) {
			return;
		}
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
		document.exitPointerLock();
	},

	eventChange: function(e) {
		var oPointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
		if (oPointerLockElement) {
			document.addEventListener('mousemove', O876_Raycaster.PointerLock.eventMouseMove, false);
			O876_Raycaster.PointerLock.bLocked = true;
		} else {
			document.removeEventListener('mousemove', O876_Raycaster.PointerLock.eventMouseMove, false);
			O876_Raycaster.PointerLock.oElement = null;
			O876_Raycaster.PointerLock.bLocked = false;
		}
	},
	
	eventError: function(e) {
		console.error('PointerLock error', e);
	},
	
	eventMouseMove: function(e) {
		var xMove = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		var yMove = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
		var p = O876_Raycaster.PointerLock;
		if (p.oHookFunction) {
			p.oHookFunction.apply(p.oHookInstance, [xMove, yMove]);
		}
	}
});

/**
 * Raycasting engine
 * -----------------
 * Writen by Raphael Marandet
 * raphael.marandet@gmail.com
 * 
 * Inspiration : 
 * 2 web sites gave me inspiration to create this engine.
 * #1 the first one : 
 *   Raytracing Engine
 *   C0D3D by Gunnar Leffler
 *   http://www.leftech.com/raycaster.htm
 *   Version 1.0
 *   
 * #2 the second one :
 *   http://arguingwithmyself.com/demos/raycaster/
 *   I looked at version 1
 *
 * I took one function from each (CastRay() from #1 and DrawScreen() from #2), 
 * merged them both and added some features.
 * - sprite support with alpha
 * - semi-transparent walls (with windows, iron bars, grates...).
 * - doors (one panel, two panels, sliding up, squeezing up). 
 * - secret doors (just like wolfenstein 3D secret walls).
 * - ambient light and darkness.
 * - weapon canvas layer.
 * - speed optimization.
 * - raster effects.
 * - ...
 */


/** Notes:
 * 
 * Raycaster configuration JSO
 * 
 * raycasterConfig = {
 *   canvas: string | HTMLCanvasElement,   // canvas id or canvas instance
 *   ghostVision: float,   // alpha du ghost vision (intensité de l'effet de flou) 
 *   drawMap: boolean,   // drawing map or not
 *   zoom: int           // level of detail  
 * }
 */
O2.createClass('O876_Raycaster.Raycaster',  {
	// Laby Phys Properties
	PHYS_NONE : 0x00,
	PHYS_WALL : 0x01,

	// Laby door properties
	PHYS_FIRST_DOOR : 0x02,
	PHYS_DOOR_SLIDING_UP : 0x02,
	PHYS_CURT_SLIDING_UP : 0x03,
	PHYS_DOOR_SLIDING_DOWN : 0x04,
	PHYS_CURT_SLIDING_DOWN : 0x05,
	PHYS_DOOR_SLIDING_LEFT : 0x06,
	PHYS_DOOR_SLIDING_RIGHT : 0x07,
	PHYS_DOOR_SLIDING_DOUBLE : 0x08,

	PHYS_LAST_DOOR : 0x08,

	PHYS_SECRET_BLOCK : 0x09,
	PHYS_TRANSPARENT_BLOCK : 0x0A,
	PHYS_INVISIBLE_BLOCK : 0x0B,
	PHYS_OFFSET_BLOCK : 0x0C,
	PHYS_DOOR_D : 0x0D,
	PHYS_DOOR_E : 0x0E,
	PHYS_DOOR_F : 0x0F,
	// Permet de régler les évènements liés au temps
	TIME_FACTOR : 50,  // c'est le nombre de millisecondes qui s'écoule entre chaque calcul

	// World Render params
	oWall : null,
	oFloor : null,
	oBackground : null,
	nMapSize : 0,
	aMap : null,
	oVisual : null,
	nPlaneSpacing : 64,
	nShadingFactor : 50,
	nShadingThreshold : 15,    // default 15
	nDimmedWall : 7,
	oDoors : null,
	oXMap : null, // Données supplémentaires pour chaque faces d'un block
	oMinimap: null,

	// Textures
	xTexture : 64,
	yTexture : 96,

	// Viewport
	oCanvas : null,
	oContext : null,
	oRenderCanvas : null,
	oRenderContext : null,
	
	bUseVideoBuffer : true, // true: semble plus rapide sur chromium
	bGradient: true, // dessine des gradients
	bFloor : true,	// utilise le rendu du sol (automatiquement positionné selon le world def)
	bCeil : true,	// active le plafond
	bSky: false,		// active le ciel
	bFlatSky: false,	// a utiliser si le plafond a des "trous" au travers desquels on peut voir le ciel.
		// sinon on ne pourra voir le ciel qu'a travers les fenetre

	nZoom : 1,
	wCanvas : 0, // ratio 0.625
	hCanvas : 0,
	xScrSize : 0,
	yScrSize : 0,
	fViewAngle : 0,
	fViewHeight: 1,

	// Rendu des murs
	nRayLimit: 100,
	bExterior : false,
	nMeteo : 0,
	fCameraBGOfs : 0,
	fDist : 1,
	bSideWall : false,
	nWallPanel : 1,
	nWallPos : 1,
	xWall : 0,
	yWall : 0,
	aZBuffer : null,
	oContinueRay: null,

	// sprites
	oHorde : null,
	aScanSectors : null,
	aWallSectors : null,
	oMobileSectors : null,
	oThinkerManager : null,
	
	// weapon Layer
	oWeaponLayer: null,

	oImages : null,

	// Effects
	oEffects : null,

	// Data
	aWorld : null,
	oConfig : null,
	
	oUpper: null,
	
	setConfig : function(oConfig) {
		if (this.oConfig === null) {
			this.oConfig = oConfig;
		} else {
			for (var i in oConfig) {
				this.oConfig[i] = oConfig[i];
			}
		}
	},

	/** Définition des données initiale du monde
	 * @param aWorld objet contenant des définition de niveau
	 */
	defineWorld : function(aWorld) {
		this.aWorld = aWorld;
	},

	initialize : function() {
		this.fViewAngle = PI / 4;
		if (this.oConfig.planeSpacing) {
			this.nPlaneSpacing = this.oConfig.planeSpacing; 
			this.xTexture = this.oConfig.planeSpacing; 
		}
		if (this.oCanvas === null) {
			this.initCanvas();
		}
		if (this.oConfig.zoom) {
			this.setDetail(this.oConfig.zoom);
		} else {
			this.setDetail(1);
		}
		this.aZBuffer = [];
		this.oEffects = new O876_Raycaster.GXManager();
		if (this.oImages === null) {
			this.oImages = new O876_Raycaster.ImageLoader();
		}
		this.oThinkerManager = new O876_Raycaster.ThinkerManager();
		this.oContinueRay = { bContinue: false };
		this.oWeaponLayer = {
			canvas: null,
			x: -1024,
			y: 0,
			width: 0,
			height: 0,
			index: 0,
			alpha: 1,
			zoom: 1
		};
		// économiser la RAM en diminuant le nombre de shading degrees
		if (this.oConfig.shades) {
			this.nShadingThreshold = this.oConfig.shades;
		}
		
		switch (this.nShadingThreshold) {
			case 0:
				this.nDimmedWall = 0;
				break;
				
			case 1:
				this.nDimmedWall = 1;
				break;
				
			default:
				this.nDimmedWall = Math.round(this.nShadingThreshold / 3);
				break;
		}
	},
	
	finalize: function() {
		this.oEffects.clear();
		this.oEffects = null;
		this.oImages.finalize();
		this.oImages = null;
		this.oThinkerManager = null;
	},

	/** Le shade process est un processus qui peut prendre du temps
	 * aussi proposons nous un callback destiné à afficher une barre de progression
	 */
	shadeProcess : function() {
		if (this.nShadingThreshold === 0) {
			return true;
		}
		var i = '';
		var w = this.shadeImage(this.oWall.image, false);
		this.oWall.image = w;
		if (this.bFloor) {
			w = this.shadeImage(this.oFloor.image, false);
			this.oFloor.image = w;
		}
		
		for (i in this.oHorde.oTiles) {
			if (this.oHorde.oTiles[i].bShading) {
				w = this.shadeImage(this.oHorde.oTiles[i].oImage, true);
				this.oHorde.oTiles[i].bShading = false;
				this.oHorde.oTiles[i].oImage = w;
				return false;
			}
		}
		return true;
	},
	
	drawUpper: function() {
		this.oUpper.fViewHeight = this.fViewHeight + 2; 
		this.oUpper.drawScreen();
	},

	frameProcess : function() {
		this.updateHorde();
		this.oEffects.process();
	},

	frameRender : function() {
		this.drawScreen();
		this.oEffects.render();
	},
	
	/**
	 * An emergency fonction which decrease the level of detail
	 * because the computer is too slow
	 */
	downgrade: function() {
		this.oCanvas.width >>= 1;
		this.oCanvas.height >>= 1;
		this.xScrSize >>= 1;
		this.yScrSize >>= 1;
		this.backgroundRedim();
		if (this.oUpper) {
			this.oUpper.xScrSize >>= 1;
			this.oUpper.yScrSize >>= 1;
		}
	},
	
	/** Rendu graphique de l'arme
	 * canvas : référence du canvas source
	 * index : numero de la frame affiché
	 * width : largeur en pixel d'une frame
	 * height : hauteur d'une frame
	 * x : position du sprite à l'écran
	 * y : *        *         *
	 * zoom : zoom appliqué au sprite 
	 */
	drawWeapon: function() {
		var w = this.oWeaponLayer;
		if (w.index >= 0 && w.canvas) {
			var fAlpha = 1;
			if (w.alpha != 1) {
				fAlpha = this.oRenderContext.globalAlpha;
				this.oRenderContext.globalAlpha = w.alpha;
			}
			this.oRenderContext.drawImage(
				w.canvas,    // canvas des tiles d'arme 
				w.index * w.width,   
				0, 
				w.width, 
				w.height, 
				w.x, 
				w.y, 
				w.width * w.zoom | 0, 
				w.height * w.zoom | 0
			);
			if (w.alpha != 1) {
				this.oRenderContext.globalAlpha = fAlpha;
			}
		}
	},

	buildLevel : function() {
		this.oHorde = null;
		this.oEffects.clear();
		this.aScanSectors = null;
		this.aWallSectors = null;
		this.oMobileSectors = null;
		this.buildMap();
		this.buildHorde();
	},

	updateHorde : function() {
		this.oHorde.think();
	},

	initCanvas : function() {
		if (typeof this.oConfig.canvas == 'string') {
			this.oCanvas = document.getElementById(this.oConfig.canvas);
		} else if (typeof this.oConfig.canvas == 'object' && this.oConfig.canvas !== null) {
			this.oCanvas = this.oConfig.canvas;
		} else {
			throw new Error('initCanvas failed: configuration object needs a valid canvas entry (dom or string id)');
		}
		if (this.wCanvas) {
			this.oCanvas.width = this.wCanvas;
		}
		if (this.hCanvas) {
			this.oCanvas.height = this.hCanvas;
		}
		this.oContext = this.oCanvas.getContext('2d');
		if (this.bUseVideoBuffer) {
			if (this.oRenderCanvas === null) {
				this.oRenderCanvas = O876.CanvasFactory.getCanvas();
			}
			this.oRenderCanvas.height = this.oCanvas.height;
			this.oRenderCanvas.width = this.oCanvas.width;
			this.oRenderContext = this.oRenderCanvas.getContext('2d');
		} else {
			this.oRenderCanvas = this.oCanvas;
			this.oRenderContext = this.oContext;
		}
		if ('smoothTextures' in this.oConfig) {
			this.oRenderContext.mozImageSmoothingEnabled = this.oConfig.smoothTextures;
			this.oRenderContext.webkitImageSmoothingEnabled = this.oConfig.smoothTextures;
		}
		if ('ghostVision' in this.oConfig) {
			if (this.oConfig.ghostVision > 0) {
				this.oContext.globalAlpha = this.oConfig.ghostVision;
			}
		}
		this.xScrSize = Math.floor(this.oCanvas.width / this.nZoom);
		this.yScrSize = this.oCanvas.height >> 1;
	},

	/** Modification du détail 
	 * @param nDetail 0: interdit ; 1: haute qualité ; 2: bonne qualité ; 4 basse qualité
	 */
	setDetail : function(nDetail) {
		switch (nDetail) {
			case 1:
				this.nZoom = 1;
				this.xScrSize = this.oCanvas.width;
				this.drawFloor = this.drawFloor_zoom1;
				this.drawFloorAndCeil = this.drawFloorAndCeil_zoom1;
				break;
				
			case 2:
			case 4:
				this.nZoom = nDetail;
				this.xScrSize = Math.floor(this.oCanvas.width / this.nZoom);
				this.drawFloor = this.drawFloor_zoom2;
				this.drawFloorAndCeil = this.drawFloorAndCeil_zoom2;
				break;
				
			default:
				throw new Error('invalid detail ' + nDetail + ' ! allowed values are 1, 2, 4');
		}
	},

	loadImage : function(sUrl) {
		return this.oImages.load(sUrl);
	},
	
	
	filterImage : function(oImage, f) {
		if (f) {
			var oCtx = oImage.getContext('2d');
			var oImgData = oCtx.getImageData(0, 0, oImage.width, oImage.height);
			var aPixData = oImgData.data;
			var nPixCount = aPixData.length;
			var fr = f.r, fg = f.g, fb = f.b;
			/*var b255 = function(x) {
				return Math.min(255, Math.max(0, x | 0));
			};*/
			for (var iPix = 0; iPix < nPixCount; iPix += 4) {
				aPixData[iPix] = Math.min(255, Math.max(0, aPixData[iPix] * fr | 0));     //b255(aPixData[iPix] * fr); 
				aPixData[iPix + 1] = Math.min(255, Math.max(0, aPixData[iPix + 1] * fg | 0));     //b255(aPixData[iPix + 1] * fg); 
				aPixData[iPix + 2] = Math.min(255, Math.max(0, aPixData[iPix + 2] * fb | 0));    //b255(aPixData[iPix + 1] * fb); 
			}
			oCtx.putImageData(oImgData, 0, 0);
		}
	},

	/** Le shading est un traitement long et est soumis à une limite de temps
	 * Si la fonction dépasse le temps limite elle se termine
	 */
	shadeImage : function(oImage, bSprite) {
		if (oImage.__shaded) {
			return oImage;
		}
		// Récupération du Shaded en cours (ou création d'un nouveau)
		var oShaded = O876.CanvasFactory.getCanvas();
		oShaded.width = oImage.width;
		oShaded.height = oImage.height * (this.nShadingThreshold + 1);
		var oCtx = oShaded.getContext('2d');
		var g;
		var nMethod = 1;
		g = {
			r : this.oVisual.fogColor.r,
			g : this.oVisual.fogColor.g,
			b : this.oVisual.fogColor.b
		};
		// Maximiser le filter
		if (bSprite && this.oVisual.filter) {
			var oFilteredImage;
			oFilteredImage = O876.CanvasFactory.getCanvas();
			oFilteredImage.width = oImage.width;
			oFilteredImage.height = oImage.height;
			oFilteredImage.getContext('2d').drawImage(oImage, 0, 0);
			this.filterImage(oFilteredImage, this.oVisual.filter);
			oImage = oFilteredImage;
		}
		var fAlphaMin = this.oVisual.diffuse || 0;
		// i : 0 -> shadingThreshold
		// f : 0 -> 1
		// f2 : fAlphaMin -> 1
		for ( var i = 0; i <= this.nShadingThreshold; i++) {
			g.a = Math.min(i / this.nShadingThreshold, 1) * (1 - fAlphaMin);
			switch (nMethod) {
				case 0: // Méthode conservant l'Alpha (ne marche pas sous moz)
					oCtx.globalCompositeOperation = 'source-over';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.fillStyle = GfxTools.buildRGBA(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'destination-in';
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 1:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-atop';
					oCtx.fillStyle = GfxTools.buildRGBA(g);
					oCtx.fillRect(0, i * oImage.height, oImage.width,
							oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;

				case 2:
					oCtx.drawImage(oImage, 0, i * oImage.height);
					oCtx.globalCompositeOperation = 'source-over';
					break;
			}
		}
		oShaded.__shaded = true;
		return oShaded;
	},

	/**
	 * Clonage de mur.
	 * La texture nSide du pan mur spécifié par x, y est copiée dans un canvas transmis 
	 * à une function callBack. à charge de cette fonction de dessiner ce qu'elle veux dans 
	 * ce canvas cloné. cette modification sera reportée dans le jeu.
	 *   
	 * @param x coordonnée X du mur
	 * @param y coordonnée Y du mur
	 * @param nSide coté du mur 0:nord, 1:est, 2:sud, 3:ouest
	 * @param pDrawingFunction fonction qui servira à déssiner le mur (peut être un tableau [instance, function],
	 * cette fonction devra accepter les paramètres suivants :
	 * - param1 : instance du raycaster
	 * - param2 : instance du canvas qui contient le clone de la texture.
	 * - param3 : coordoonée X du mur
	 * - param4 : coordoonée Y du mur
	 * - param5 : coté du mur concerné
	 */
	cloneWall : function(x, y, nSide, pDrawingFunction) {
		var c = this.oXMap.cloneWall(this.oWall.image, this.aWorld.walls.codes[this.getMapXYTexture(x, y)][(1 - nSide & 1)], x, y, nSide);
		if (ArrayTools.isArray(pDrawingFunction)) {
			var oInst = pDrawingFunction[0];
			var pFunc = pDrawingFunction[1];
			pFunc.apply(oInst, [this, c, x, y, nSide]);
		} else {
			pDrawingFunction(this, c, x, y, nSide);
		}
		this.shadeCloneWall(c, x, y, nSide);
	},

	shadeCloneWall : function(oCanvas, x, y, nSide) {
		this.oXMap.get(x, y, nSide).oWall = this.shadeImage(oCanvas,
				false);
	},

	/* Code map
	 * Numéro de Tile (byte)
	 * Propriété physique (byte)
	 * - 0: pas d'état
	 * - 1: porte coulissant vers le haut
	 * - 2: porte coulissant vers le bas
	 * - 3: porte coulissant vers la gauche
	 * - 4: porte coulissant vers la droite
	 * Transitionneur (nombre permettant de faire evoluer un etat) (byte)
	 * - 1, 2, 3, 4: Offset de déplacement

	 */
	/** Vérifie l'existance d'une série de clé dans un objet
	 * @param oObj objet à vérifier
	 * @param aKeys liste des clés
	 * @return bool true : l'objet est OK, false : il manque une ou plusieur clé
	 */
	checkObjectStructure : function(oObj, xKeys) {
		// clé composée
		if (ArrayTools.isArray(xKeys)) {
			for (var i = 0; i < xKeys.length; i++) {
				this.checkObjectStructure(oObj, xKeys[i]);
			}
			return true;
		}
		if (xKeys.indexOf('.') >= 0) {
			var aKeys = xKeys.split('.');
			var sKey0 = aKeys.shift();
			if (this.checkObjectStructure(oObj, sKey0)) {
				// Vérifier premier objet
				return this.checkObjectStructure(oObj[sKey0], aKeys.join('.'));
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		} else {
			if (xKeys in oObj) {
				return true;
			} else {
				throw new Error('invalid object structure: missing key [' + xKeys + ']');
			}
		}
	},

	/** Construction de la map avec les donnée contenues dans aWorld
	 */
	buildMap : function() {
		var oData = this.aWorld;
		// verifier integrité des données
		this.checkObjectStructure(oData, [
		'map.length',
		'walls.src',
		'walls.codes',
		'startpoint.x',
		'startpoint.y',
		'startpoint.angle'
		]);
		this.nMapSize = oData.map.length;
		this.oMobileSectors = new O876_Raycaster.MobileRegister(
				this.nMapSize);
		this.oDoors = Marker.create();
		this.aMap = [];
		var yMap, xMap;
		for (yMap = 0; yMap < oData.map.length; ++yMap) {
			this.aMap[yMap] = new Uint32Array(oData.map[yMap].length);
			for (xMap = 0; xMap < oData.map[yMap].length; ++xMap) {
				this.aMap[yMap][xMap] = oData.map[yMap][xMap];
			}
		}
		this.oWall = {
			image : this.loadImage(oData.walls.src),
			codes : oData.walls.codes,
			animated : 'animated' in oData.walls ? oData.walls.animated : {}
		};
		if ('flats' in oData) {
			this.bFloor = true;
			var bAllEmpty = oData.flats.codes.every(function(item, index, array) {
				if (item) {
					return item[1] === -1;
				} else {
					return true;
				}
			});
			this.bCeil = !bAllEmpty;
			this.oFloor = {
				image : this.loadImage(oData.flats.src),
				codes : oData.flats.codes,
				imageData : null,
				imageData32 : null,
				renderSurface32 : null
			};
		} else {
			this.bFloor = false;
			this.bCeil = false;
		}
		if ('background' in oData) {
			this.oBackground = this.loadImage(oData.background);
			this.bSky = true;
		} else {
			this.oBackground = null;
			this.bSky = false;
		}
		// construction des textures animées
		this.buildAnimatedTextures();
		// Définition de la caméra
		this.oCamera = new O876_Raycaster.Mobile();
		this.oCamera.oRaycaster = this;
		this.oCamera.fSpeed = 8;
		this.oCamera.fRotSpeed = 0.1;
		this.oCamera.xSave = this.oCamera.x = oData.startpoint.x;
		this.oCamera.ySave = this.oCamera.y = oData.startpoint.y;
		this.oCamera.xSector = this.oCamera.x / this.nPlaneSpacing | 0;
		this.oCamera.ySector = this.oCamera.y / this.nPlaneSpacing | 0;
		this.oCamera.fTheta = oData.startpoint.angle;
		this.oCamera.bActive = true;
		this.oVisual = {
			ceilColor: oData.visual.ceilColor,		// couleur du plafond au pixel le plus proche
			floorColor: oData.visual.floorColor,	// couleur du sol au pixel le plus proche
			light: oData.visual.light,				// puissance lumineuse combinée à la distance pour déterminer la luminosité final d'un objet 
			diffuse: oData.visual.diffuse,			// luminosité minimale de tout objet ou mur
			filter: oData.visual.filter,			// filtre coloré appliqué aux sprites
			fogDistance: oData.visual.fogDistance,	// indice du gradient correspondant à la fogColor (0..1)
			fogColor: oData.visual.fogColor			// couleur du fog
		};
		this.buildGradient();
		// Extra Map
		this.oXMap = new O876_Raycaster.XMap();
		this.oXMap.nWallWidth = this.xTexture;
		this.oXMap.nWallHeight = this.yTexture;
		this.oXMap.setSize(this.nMapSize, this.nMapSize);
		if ('uppermap' in oData) {
			this.buildSecondFloor();
		}
	},
	
	backgroundRedim: function() {
		var oBackground = this.oBackground;
		var dh = this.yScrSize << 1;
		if (oBackground && oBackground.height != dh) {
			var sw = oBackground.width;
			var sh = oBackground.height;
			var dw = sw * dh / sh | 0;
			var bg2 = O876.CanvasFactory.getCanvas();
			bg2.height = dh;
			bg2.width = dw;
			var ctx = bg2.getContext('2d');
			ctx.drawImage(oBackground, 0, 0, sw, sh, 0, 0, dw, dh);
			this.oBackground = bg2;
		}
	},
	
	/**
	 * Ajoute un second étage au raycaster
	 */
	buildSecondFloor: function() {
		// Ajout du second étage
		var oData = this.aWorld;
		if ('uppermap' in oData) {
			var SELF = this.constructor;
			var urc = new SELF();
			urc.TIME_FACTOR = this.TIME_FACTOR;
			urc.setConfig(this.oConfig);
			urc.bUseVideoBuffer = false;
			urc.initialize();
			var oUpperWorld = {
				map: oData.uppermap,
				walls: oData.walls,
				visual: oData.visual,
				startpoint: oData.startpoint,
				tiles: oData.tiles,
				blueprints: {},
				objects: []
			};
			urc.defineWorld(oUpperWorld);
			urc.buildMap();
			urc.bGradient = false;
			urc.oCamera = this.oCamera;
			urc.oWall = this.oWall;
			//urc.oCanvas = this.oCanvas;
			//urc.oContext = this.oContext;
			urc.oRenderCanvas = this.oRenderCanvas;
			urc.oRenderContext = this.oRenderContext;
			this.oUpper = urc;
		}
	},

	buildHorde : function() {
		this.oHorde = new O876_Raycaster.Horde(this);
		this.oHorde.oThinkerManager = this.oThinkerManager;
		var aData = this.aWorld;
		var oTiles = aData.tiles;
		var oBlueprints = aData.blueprints;
		var oMobs = aData.objects;
		this.oHorde.linkMobile(this.oCamera);
		var i = '';
		for (i in oTiles) {
			this.oHorde.defineTile(i, oTiles[i]);
		}
		for (i in oBlueprints) {
			this.oHorde.defineBlueprint(i, oBlueprints[i]);
		}
		for (i = 0; i < oMobs.length; i++) {
			this.oHorde.defineMobile(oMobs[i]);
		}
	},

	/** Création des gradient
	 * pour augmenter la luz :
	 * this.oVisual.light = 200; 
	 * this.oVisual.fogDistance = 1; 
	 * G.oRaycaster.buildGradient();
	 */
	buildGradient : function() {
		var g;
		this.oVisual.gradients = [];
		g = this.oRenderContext.createLinearGradient(0, 0, 0, this.oCanvas.height >> 1);
		g.addColorStop(0, GfxTools.buildRGBA(this.oVisual.ceilColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, GfxTools.buildRGBA(this.oVisual.fogColor));
		}
		g.addColorStop(1, GfxTools.buildRGBA(this.oVisual.fogColor));
		this.oVisual.gradients[0] = g;

		g = this.oRenderContext.createLinearGradient(0, this.oCanvas.height - 1, 0, (this.oCanvas.height >> 1) + 1);
		g.addColorStop(0, GfxTools.buildRGBA(this.oVisual.floorColor));
		if (this.oVisual.fogDistance < 1) {
			g.addColorStop(this.oVisual.fogDistance, GfxTools.buildRGBA(this.oVisual.fogColor));
		}
		g.addColorStop(1, GfxTools.buildRGBA(this.oVisual.fogColor));
		this.oVisual.gradients[1] = g;

		this.nShadingFactor = this.oVisual.light;
	},
	
	insideMap: function(x) {
		return x >= 0 && x < this.nMapSize;
	},

	/** Lance un rayon dans la map actuelle
	 * Lorsque le rayon frappe un mur opaque, il s'arrete et la fonction renvoie la liste
	 * des secteur traversé (visible).
	 * La fonction mets à jour un objet contenant les propriétés suivantes :
	 *   nWallPanel    : Code du Paneau (texture) touché par le rayon
	 *   bSideWall     : Type de coté (X ou Y)
	 *   nSideWall     : Coté
	 *   nWallPos      : Position du point d'impact du rayon sur le mur
	 *   xWall         : position du mur sur la grille
	 *   yWall         :  "       "       "       "
	 *   fDist         : longueur du rayon
	 * @param oData objet de retour
	 * @param x position de la camera
	 * @param y    "      "      "
	 * @param dx pente du rayon x (le cosinus de son angle)
	 * @param dy pente du rayon y (le sinus de son angle)
	 * @param aExcludes tableau des cases semi transparente que le rayon peut traverser
	 * @param aVisibles tableau des cases visitées par le rayon
	 */
	projectRay : function(oData, x, y, dx, dy, aExcludes, aVisibles) {
		var side = 0;
		var map = this.aMap;
		var nMapSize = this.nMapSize;
		var nScale = this.nPlaneSpacing;

		//raycount++;
		var xi, yi, xt, dxt, yt, dyt, t, dxi, dyi, xoff, yoff, cmax = oData.nRayLimit;
		
		var oContinue = oData.oContinueRay;
		
		
		// Le continue sert à se passer de refaire le raycast depuis la 
		// source (camera), on mémorise xi et yi
		if (oContinue.bContinue) {
			xi = oContinue.xi;
			yi = oContinue.yi;
		} else {
			xi = x / nScale | 0;
			yi = y / nScale | 0;
		}
		xoff = (x / nScale) - xi;
		yoff = (y / nScale) - yi;
		if (dx < 0) {
			xt = -xoff / dx;
			dxt = -1 / dx;
			dxi = -1;
		} else {
			xt = (1 - xoff) / dx;
			dxt = 1 / dx;
			dxi = 1;
		}
		if (dy < 0) {
			yt = -yoff / dy;
			dyt = -1 / dy;
			dyi = -1;
		} else {
			yt = (1 - yoff) / dy;
			dyt = 1 / dy;
			dyi = 1;
		}
		
		var xScale = nScale * dx;
		var yScale = nScale * dy;
		
		t = 0;
		var done = 0;
		var c = 0;
		var bStillVisible = true;
		var nOfs, nTOfs = 0;
		var nText;
		
		var Marker_getMarkXY = Marker.getMarkXY;
		var Marker_markXY = Marker.markXY;

		var nPhys;
		var nPHYS_FIRST_DOOR = this.PHYS_FIRST_DOOR;
		var nPHYS_LAST_DOOR = this.PHYS_LAST_DOOR;
		var nPHYS_SECRET_BLOCK = this.PHYS_SECRET_BLOCK;
		var nPHYS_OFFSET_BLOCK = this.PHYS_OFFSET_BLOCK;
		var nPHYS_TRANSPARENT_BLOCK = this.PHYS_TRANSPARENT_BLOCK;
		var xint = 0, yint = 0;
		
		var sameOffsetWall = this.sameOffsetWall;
		
		while (done === 0) {
			if (xt < yt) {
				xi += dxi;
				if (xi >= 0 && xi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 8) & 0xFF;
					
					if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					}
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys == nPHYS_SECRET_BLOCK || nPhys == nPHYS_TRANSPARENT_BLOCK || nPhys == nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF;
					} else {
						nOfs = 0;
					}
					
					if (nOfs) {
						xint = x + xScale * xt;
						yint = y + yScale * xt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dxt / nScale) * nOfs;
							yint = y + yScale * (xt + nTOfs);
							if (((yint / nScale | 0)) != yi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					// 0xB00 : INVISIBLE_BLOCK ou vide 0x00
					if (nPhys == 0xB || nPhys == 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						xt += dxt;
					} else {
						t = xt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 1;
						bStillVisible = false;
					}
				} else {
					t = xt;
					c = cmax;
				}
			} else {
				yi += dyi;
				if (yi >= 0 && yi < nMapSize) {
					nText = map[yi][xi];
					nPhys = (nText >> 8) & 0xFF;

					if (nText !== 0 && Marker_getMarkXY(aExcludes, xi, yi)) {
						nPhys = nText = 0;
					} 
					
					if (nPhys >= nPHYS_FIRST_DOOR && nPhys <= nPHYS_LAST_DOOR) {
						// entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
						nOfs = nScale >> 1;
					} else if (nPhys == nPHYS_SECRET_BLOCK || nPhys == nPHYS_TRANSPARENT_BLOCK || nPhys == nPHYS_OFFSET_BLOCK) {
						// PHYS_SECRET ou PHYS_TRANSPARENT
						nOfs = (nText >> 16) & 0xFF;
					} else {
						nOfs = 0;
					}

					if (nOfs) {
						xint = x + xScale * yt;
						yint = y + yScale * yt;
						if (sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
							nTOfs = (dyt / nScale) * nOfs;
							xint = x + xScale * (yt + nTOfs);
							if (((xint / nScale | 0)) != xi) {
								nPhys = nText = 0;
							}
							if (nText !== 0	&& Marker_getMarkXY(aExcludes, xi, yi)) {
								nPhys = nText = 0;
							}
						} else { // pas même mur -> wall
							nPhys = nText = 0;
						}
					} else {
						nTOfs = 0;
					}
					if (nPhys == 0xB || nPhys == 0) {
						if (bStillVisible) {
							Marker_markXY(aVisibles, xi, yi);
						}
						yt += dyt;
					} else {
						t = yt + nTOfs;
						xint = x + xScale * t;
						yint = y + yScale * t;
						done = 1;
						side = 2;
						bStillVisible = false;
					}
				} else {
					t = yt;
					c = cmax;
				}
			}
			c++;
			if (c >= cmax) {
				//			t = 100;
				done = 1;
			}
		}
		if (c < cmax) {
			oData.nWallPanel = map[yi][xi];
			oData.bSideWall = side == 1;
			oData.nSideWall = side - 1;
			oData.nWallPos = oData.bSideWall ? yint % oData.xTexture
					: xint % oData.xTexture;
			if (oData.bSideWall && dxi < 0) {
				oData.nWallPos = oData.xTexture - 1 - oData.nWallPos;
				oData.nSideWall = 2;
			}
			if (!oData.bSideWall && dyi > 0) {
				oData.nWallPos = oData.xTexture - 1 - oData.nWallPos;
				oData.nSideWall = 3;
			}
			oData.xWall = xi;
			oData.yWall = yi;
			oData.fDist = t * nScale;
			oData.bExterior = false;
			if (this.isWallTransparent(oData.xWall, oData.yWall)) {
				oContinue.bContinue = true;
				oContinue.xi = xi;
				oContinue.yi = yi;
			} else {
				oContinue.bContinue = false;
			}
		} else {
			oData.fDist = t * nScale;
			oData.bExterior = true;
		}
	},

	/**
	 * Calcule le caste d'un rayon  
	 */
	castRay : function(oData, x, y, dx, dy, xScreen, aVisibles) {
		var aExcludes = Marker.create();
		var oXBlock = null;
		var oWall;
		var nTextureBase;
		var nMaxIterations = 6;
		if (!aVisibles) {
			aVisibles = Marker.create();
		}
		var oBG = this.oBackground;
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.bExterior) {
				// hors du laby
				if (oBG) {
					this.drawExteriorLine(xScreen, oData.fDist);
				}
			} else if (oData.fDist >= 0) {
				if (xScreen !== undefined) {
					// Lecture données extra du block;
					oXBlock = this.oXMap.get(oData.xWall, oData.yWall,
							oData.nSideWall);
					if (oXBlock.oWall) {
						oWall = oXBlock.oWall;
						nTextureBase = 0;
					} else {
						oWall = oData.oWall.image;
						nTextureBase = oData.oWall.codes[oData.nWallPanel & 0xFF][oData.bSideWall ? 1 : 0] * this.xTexture;
					}
					this.drawLine(xScreen, oData.fDist, nTextureBase,
							oData.nWallPos | 0, oData.bSideWall, oWall,
							oData.nWallPanel);
				} 
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			nMaxIterations--;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	/**
	 * CastRay rapide (pas de considération graphique)
	 * @param oData données à mettre à jour (bExterior fDist xwall ywall owall)
	 * @param x position camera x
	 * @param y position camera y
	 * @param dx direction du rayon X
	 * @param dy direction du rayon y
	 * @param xScreen (facultatif) Y actuellement déssiné (pour l'extérieur)
	 * @param aVisibles liste des secteur visibles
	 * @returns aVisibles
	 */
	fastCastRay : function(x, y, a) {
		var aExcludes = Marker.create();
		var nMaxIterations = 6;
		var aVisibles = {};
		var dx = Math.cos(a);
		var dy = Math.sin(a);
		var oData = { 
			oContinueRay : {
				bContinue : false
			},
			nRayLimit : 10
		};
		do {
			this.projectRay(oData, x, y, dx, dy, aExcludes, aVisibles);
			if (oData.fDist >= 0) {
				if (oData.oContinueRay.bContinue) {
					Marker.markXY(aExcludes, oData.xWall, oData.yWall);
				}
			}
			nMaxIterations--;
		} while (oData.oContinueRay.bContinue && nMaxIterations > 0);
		return aVisibles;
	},

	
	
	sameOffsetWall : function(nOfs, x0, y0, xm, ym, fBx, fBy, ps) {
		x0 += nOfs * fBx;
		y0 += nOfs * fBy;
		var ym2, xm2;
		ym2 = y0 / ps | 0;
		xm2 = x0 / ps | 0;
		return xm2 == xm && ym2 == ym;
	},

	// compare z, départage les z identique en comparant les x
	// du plus grand au plus petit Z (distance)
	// si Z identitiques du plus petit au plus grand dx
	zBufferCompare : function(a, b) {
		if (a[9] != b[9]) {
			return b[9] - a[9];
		}
		return a[5] - b[5];
	},

	// renvoie true si le code correspond à une porte (une vrai porte, pas un passage secret)
	isDoor : function(xw, yw) {
		var nPhys = this.getMapXYPhysical(xw, yw);
		return (nPhys >= this.PHYS_FIRST_DOOR && nPhys <= this.PHYS_LAST_DOOR);
	},

	// Renvoie true si on peut voir a travers le murs, et qu'on doit relancer le seekWall pour ce Ray
	isWallTransparent : function(xWall, yWall) {
		var nPhys = this.getMapXYPhysical(xWall, yWall);
		if (nPhys === 0) {
			return false;
		}
		var nOffset = this.getMapXYOffset(xWall, yWall);
		// code physique transparent
		if ((nPhys >= this.PHYS_FIRST_DOOR &&
				nPhys <= this.PHYS_LAST_DOOR && nOffset !== 0) ||
				nPhys == this.PHYS_TRANSPARENT_BLOCK ||
				nPhys == this.PHYS_INVISIBLE_BLOCK) {
			return true;
		}
		return false;
	},
	
	// Renvoie la distance d'un éventuel renfoncement
	getWallDepth : function(xw, yw) {
		var nPhys = this.getMapXYPhysical(xw, yw);
		if (this.isDoor(xw, yw)) {
			return this.nPlaneSpacing >> 1;
		}
		if (nPhys == this.PHYS_SECRET_BLOCK || nPhys == this.PHYS_TRANSPARENT_BLOCK || nPhys == this.PHYS_OFFSET_BLOCK) {
			return this.getMapXYOffset(xw, yw);
		}
		return 0;
	},

	setMapXY: function(x, y, nCode) {
		this.aMap[y][x] = nCode;
	},

	getMapXY: function(x, y) {
		return this.aMap[y][x];
	},

	setMapXYTexture : function(x, y, nTexture) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFFFF00) | nTexture;
	},

	getMapXYTexture : function(x, y) {
		return this.aMap[y][x] & 0xFF;
	},

	setMapXYPhysical : function(x, y, nPhys) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFFFF00FF) | (nPhys << 8);
	},

	getMapXYPhysical : function(x, y) {
		return (this.aMap[y][x] >> 8) & 0xFF;
	},

	setMapXYOffset : function(x, y, nOffset) {
		this.aMap[y][x] = (this.aMap[y][x] & 0xFF00FFFF)
				| (nOffset << 16);
	},

	getMapXYOffset : function(x, y) {
		return (this.aMap[y][x] >> 16) & 0xFF;
	},

	setMapXYTag : function(x, y, nTag) {
		this.aMap[y][x] = (this.aMap[y][x] & 0x00FFFFFF)
				| (nOffset << 24);
	},

	getMapXYTag : function(x, y) {
		return (this.aMap[y][x] >> 24) & 0xFF;
	},


	drawScreen : function() {
		// phase 1 raycasting
		
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);
		var dx = (wx2 - wx1) / this.xScrSize;
		var dy = (wy2 - wy1) / this.xScrSize;
		var fBx = wx1;
		var fBy = wy1;
		var xCam = this.oCamera.x;
		var yCam = this.oCamera.y;
		var xCam8 = xCam / this.nPlaneSpacing | 0;
		var yCam8 = yCam / this.nPlaneSpacing | 0;
		var i = 0;
		this.aZBuffer = [];
		this.aScanSectors = Marker.create();
		this.aWallSectors = {};
		if (this.oBackground) { // Calculer l'offset camera en cas de background
			this.fCameraBGOfs = (PI + this.oCamera.fTheta)	* this.oBackground.width / PI;
		}
		Marker.markXY(this.aScanSectors, xCam8, yCam8);
		var oContinueRay = this.oContinueRay;
		var xScrSize = this.xScrSize;
		var aScanSectors = this.aScanSectors;
		for (i = 0; i < xScrSize; ++i) {
			oContinueRay.bContinue = false;
			this.castRay(this, xCam, yCam, fBx, fBy, i, aScanSectors);
			fBx += dx;
			fBy += dy;
		}
		
		// Optimisation ZBuffer -> suppression des drawImage inutile, élargissement des drawImage utiles.
		// si le last est null on le rempli
		// sinon on compare last et current
		// si l'un des indices 0, 1 diffèrent alors on flush, sinon on augmente le last
		var aZ = [];
		var nLast = 1;
		var nLLast = 1;
		var nLLLast = 1;
		var z = this.nZoom;
		
		// image 0
		// sx  1
		// sy  2
		// sw  3
		// sh  4
		// dx  5
		// dy  6
		// dw  7
		// dh  8
		// z   9
		// fx  10
		
		var zb = this.aZBuffer;
		var zbl = zb.length;
		if (zbl === 0) {
			return;
		}
		var b; // Element courrant du ZBuffer;
		var lb = zb[0];
		var llb = lb;
		var lllb = lb;
		var abs = Math.abs;
		
		for (i = 0; i < zbl; i++) {
			b = zb[i];
			// tant que c'est la même source de texture
			if (b[10] == lb[10] && b[0] == lb[0] && b[1] == lb[1] && abs(b[9] - lb[9]) < 8) { 
				nLast += z;
			} else if (b[10] == llb[10] && b[0] == llb[0] && b[1] == llb[1] && abs(b[9] - llb[9]) < 8) {
				nLLast += z;
			} else if (b[10] == lllb[10] && b[0] == lllb[0] && b[1] == lllb[1] && abs(b[9] - lllb[9]) < 8) {
				nLLLast += z;
			} else {
				lllb[7] = nLLLast;
				aZ.push(lllb);
				lllb = llb;
				nLLLast = nLLast;
				llb = lb;
				nLLast = nLast;
				lb = b;
				nLast = z;
			}
		}
		lllb[7] = nLLLast;
		aZ.push(lllb);
		llb[7] = nLLast;
		aZ.push(llb);
		lb[7] = nLast;
		aZ.push(lb);
		
		this.aZBuffer = aZ;
		this.drawHorde();
		// Le tri permet d'afficher les textures semi transparente après celles qui sont derrières
		this.aZBuffer.sort(this.zBufferCompare);
		
		

		// phase 2 : rendering

		// sky
		if (this.bSky && this.oBackground) {
			var oBG = this.oBackground;
			var wBG = oBG.width;
			var hBG = oBG.height;
			var xBG = (this.fCameraBGOfs * this.nZoom) % wBG | 0;
			var yBG = this.yScrSize - (hBG >> 1);
			hBG = hBG + yBG;
			this.oRenderContext.drawImage(oBG, 0, 0, wBG, hBG, wBG - xBG, yBG, wBG, hBG);
			this.oRenderContext.drawImage(oBG, 0, 0, wBG, hBG, -xBG, yBG, wBG, hBG);
		}
		
		// drawing gradient if no floor texture is defined.
		if (this.bGradient && !this.bFloor) {
			this.oRenderContext.fillStyle = this.oVisual.gradients[0];
			this.oRenderContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height >> 1);
			this.oRenderContext.fillStyle = this.oVisual.gradients[1];
			this.oRenderContext.fillRect(0, (this.oCanvas.height >> 1), this.oCanvas.width, this.oCanvas.height >> 1);
		}
		
		// 2ndFloor
		if (this.oUpper) {
			this.drawUpper();
		}

		// floor
		if (this.bFloor) {
			if (this.bCeil && this.fViewHeight != 1) {
				this.drawFloorAndCeil();
			} else {
				if ((!this.bSky) && this.bGradient) {
					this.oRenderContext.fillStyle = this.oVisual.gradients[0];
					this.oRenderContext.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height >> 1);
				}
				this.drawFloor();
			}
		}
		
		zbl = this.aZBuffer.length;
		for (i = 0; i < zbl; ++i) {
			this.drawImage(i);
		}
		if (this.oConfig.drawMap) {
			this.drawMap();
		}
		this.drawWeapon();
		if (this.bUseVideoBuffer) {
			this.oContext.drawImage(this.oRenderCanvas, 0, 0);
		}
	},

	drawSprite : function(oMobile) {
		var oSprite = oMobile.oSprite;
		// Si le sprite n'est pas visible, ce n'est pas la peine de gaspiller du temps CPU
		// on se barre immédiatement
		if (!(oSprite.bVisible && oMobile.bVisible)) {
			return;
		}
		var oTile = oSprite.oBlueprint.oTile;
		var dx = oMobile.x - this.oCamera.x;
		var dy = oMobile.y - this.oCamera.y;

		// Gaffe fAlpha est un angle ici, et pour un sprite c'est une transparence
		var fTarget = Math.atan2(dy, dx);
		var fAlpha = fTarget - this.oCamera.fTheta; // Angle
		if (fAlpha >= PI) { // Angle plus grand que l'angle plat
			fAlpha = -(PI * 2 - fAlpha);
		}
		if (fAlpha < -PI) { // Angle plus grand que l'angle plat
			fAlpha = PI * 2 + fAlpha;
		}
		var w2 = this.oCanvas.width >> 1;

		// Animation
		var fAngle1 = oMobile.fTheta + (PI / 8) - fTarget;
		if (fAngle1 < 0) {
			fAngle1 = 2 * PI + fAngle1;
		}
		oSprite.setDirection(((8 * fAngle1 / (2 * PI)) | 0) & 7);
		oSprite.animate(this.TIME_FACTOR);

		if (Math.abs(fAlpha) <= (this.fViewAngle * 1.5)) {
			var x = (Math.tan(fAlpha) * w2 + w2) | 0;
			// Faire tourner les coordonnées du sprite : projection sur l'axe de la caméra
			var z = MathTools.distance(dx, dy) * Math.cos(fAlpha) * 1.333;  // le 1.333 empirique pour corriger une erreur de tri bizarroïde
			// Les sprites bénéficient d'un zoom 2x afin d'améliorer les détails.

			var dz = (oTile.nScale * oTile.nHeight / (z / this.yScrSize) + 0.5);
			var dzy = this.yScrSize - (dz * this.fViewHeight);
			var iZoom = (oTile.nScale * oTile.nWidth / (z / this.yScrSize) + 0.5);
			var nOpacity; // j'ai nommé opacity mais ca n'a rien a voir : normalement ca aurait été sombritude
			// Self luminous
			var nSFx = oSprite.oBlueprint.nFx | (oSprite.bTranslucent ? (oSprite.nAlpha << 2) : 0);
			if (nSFx & 2) {
				nOpacity = 0;
			} else {
				nOpacity = z / this.nShadingFactor | 0;
				if (nOpacity > this.nShadingThreshold) {
					nOpacity = this.nShadingThreshold;
				}
			}
			var aData = [ oTile.oImage, // image 0
					oSprite.nFrame * oTile.nWidth, // sx  1
					oTile.nHeight * nOpacity, // sy  2
					oTile.nWidth, // sw  3
					oTile.nHeight, // sh  4
					x - iZoom, // dx  5
					dzy, // dy  6   :: this.yScrSize - dz + (dz >> 1)
					iZoom << 1, // dw  7
					dz << 1, // dh  8
					z, 
					nSFx]; 
			this.aZBuffer.push(aData);
			// Traitement overlay
			var oOL = oSprite.oOverlay;
			if (oOL) {
				if (Array.isArray(oSprite.nOverlayFrame)) {
					oSprite.nOverlayFrame.forEach(function(of, iOF) {
						this.aZBuffer.push(
						[	oOL.oImage, // image 0
							of * oOL.nWidth, // sx  1
							0, // sy  2
							oOL.nWidth, // sw  3
							oOL.nHeight, // sh  4
							aData[5], // dx  5
							aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
							aData[7], // dw  7
							aData[8], // dh  8
							aData[9] - 1 - (iOF / 100), 
							2
						]);
					}, this);
				} else if (oSprite.nOverlayFrame !== null) {
					this.aZBuffer.push(
					[	oOL.oImage, // image 0
						oSprite.nOverlayFrame * oOL.nWidth, // sx  1
						0, // sy  2
						oOL.nWidth, // sw  3
						oOL.nHeight, // sh  4
						aData[5], // dx  5
						aData[6], // dy  6   :: this.yScrSize - dz + (dz >> 1)
						aData[7], // dw  7
						aData[8], // dh  8
						aData[9] - 1, 
						2
					]);
				}
			}
		}
	},
	

	drawHorde : function() {
		var x = '', y = '', aMobiles, oMobile, nMobileCount, i;
		for (x in this.aScanSectors) {
			for (y in this.aScanSectors[x]) {
				aMobiles = this.oMobileSectors.get(x, y);
				nMobileCount = aMobiles.length;
				for (i = 0; i < nMobileCount; i++) {
					oMobile = aMobiles[i];
					if (oMobile.bActive && oMobile.oSprite) {
						this.drawSprite(oMobile);
					}
				}
			}
		}
	},

	drawExteriorLine : function(x, z) {
		var dz, sx, sy, sw, sh, dx, dy, dw, dh, a = null;
		if (z === 0) {
			z = 0.1;
		} //  [nPanel & 0xFF][bDim ? 1 : 0]
		dz = (this.yTexture / (z / this.yScrSize));
		var dzfv = (dz * this.fViewHeight);
		var dzy = this.yScrSize - dzfv;
		// dz = demi hauteur de la texture projetée
		var oBG = this.oBackground;
		var wBG = oBG.width, hBG = oBG.height;
		sx = ((x + this.fCameraBGOfs) * this.nZoom) % wBG | 0;
		sy = Math.max(0, (hBG >> 1) - dzfv);
		sw = this.nZoom;
		sh = Math.min(hBG, dz << 1);
		dx = x * this.nZoom;
		dy = Math.max(dzy, this.yScrSize - (hBG >> 1));
		dw = sw;
		dh = Math.min(sh, dz << 1);
		a = [ oBG, sx, sy, sw, sh, dx, dy, dw, dh, z, 0 ];
		this.aZBuffer.push(a);
	},
	
	
	drawFloor: null,
	
	/**
	 * Rendu du floor et du ceil quand fViewHeight est à 1
	 */
	drawFloor_zoom1: function() {
		var bCeil = this.bCeil;
		var oFloor = this.oFloor;
		var x, y, w = this.xScrSize, h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var ofsDstCeil; // offset de l'array pixel de destination (plancher)
		var wyCeil;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			wyCeil = w * (h - y - 1);
			yOfs = Math.min(st, dFront / sf | 0);
			
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				if (fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[0];
						ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
						aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
						if (bCeil) {
							xOfs = aFBlock[1];
							if (xOfs >= 0) {
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this.oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	/**
	 * Version zoomée de DrawFloor
	 * Fonctionne avec zoom 2 et 4
	 */
	drawFloor_zoom2: function() {
		var bCeil = this.bCeil;
		var oFloor = this.oFloor;
		var nZoom = this.nZoom;
		var x, y, w = this.xScrSize * nZoom, h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var ofsDstCeil; // offset de l'array pixel de destination (plancher)
		var wyCeil;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		var xz;
		
		
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			wyCeil = w * (h - y - 1);
			yOfs = Math.min(st, dFront / sf | 0);
			
			for (x = 0; x < w; x += nZoom) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				if (fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[0];
						ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
						for (xz = 0; xz < nZoom; ++xz) {
							aRenderSurf[ofsDst + xz] = aFloorSurf[ofsSrc];
						}
						if (bCeil) {
							xOfs = aFBlock[1];
							if (xOfs >= 0) {
								ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
								for (xz = 0; xz < nZoom; ++xz) {
									aRenderSurf[ofsDstCeil + xz] = aFloorSurf[ofsSrc];
								}
							}
						}
					}
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this.oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},	

	
	drawFloorAndCeil: null,
	
	/**
	 * Rendu du floor et du ceil si le fViewHeight est différent de 1
	 * (presque double ration de calcul....)
	 */
	drawFloorAndCeil_zoom1: function() {
		var oFloor = this.oFloor;
		var x, y, w = this.xScrSize, h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var fhCeil = (this.yTexture >> 1) + ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDeltaFrontCeil = 0;
		var yDeltaFrontCeil = 0;
		var fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
		var dFrontCeil; // distance "devant caméra" du pixel actuellement pointé
		var ofsDstCeil; // offset de l'array pixel de destination (plafon) 
		var wyCeil = 0;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		
		var bCeil = this.bCeil;
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			yOfs = Math.min(st, dFront / sf | 0);

			// ceill
			if (bCeil) {
				dFrontCeil = fhCeil * ff / y; 
				fyCeil = wy1 * dFrontCeil + yCam;
				fxCeil = wx1 * dFrontCeil + xCam;
				xDeltaFrontCeil = xDelta * dFrontCeil;
				yDeltaFrontCeil = yDelta * dFrontCeil;
				wyCeil = w * (h - y);
				yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
			}
			
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				if (fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[0];
						if (xOfs >= 0) {
							ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
							aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
						}
					}
				}
				if (bCeil && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
					nBlock = aMap[fyCeil / ps | 0][fxCeil / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[1];
						if (xOfs >= 0) {
							ofsSrc = (((fyCeil % ps) + yOfs * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
							aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
						}
					}
				}
				if (bCeil) {
					fyCeil += yDeltaFrontCeil;
					fxCeil += xDeltaFrontCeil;
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this.oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},

	/**
	 * Rendu du floor et du ceil si le fViewHeight est différent de 1
	 * (presque double ration de calcul....)
	 * Optimizée pour les zoom > 1
	 */
	drawFloorAndCeil_zoom2: function() {
		var oFloor = this.oFloor;
		var nZoom = this.nZoom;
		var x, y, w = this.xScrSize * nZoom, h = this.yScrSize;
		if (oFloor.imageData === null) {
			var oFlat = O876.CanvasFactory.getCanvas();
			oFlat.width = oFloor.image.width;
			oFlat.height = oFloor.image.height;
			var oCtx = oFlat.getContext('2d');
			oCtx.drawImage(oFloor.image, 0, 0);
			oFloor.image = oFlat;
			oFloor.imageData = oCtx.getImageData(0, 0, oFlat.width, oFlat.height);
			oFloor.imageData32 = new Uint32Array(oFloor.imageData.data.buffer);
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		if (this.bFlatSky) {
			// recommencer à lire le background pour prendre le ciel en compte
			oFloor.renderSurface = this.oRenderContext.getImageData(0, 0, w, h << 1);
			oFloor.renderSurface32 = new Uint32Array(oFloor.renderSurface.data.buffer);
		}
		var aFloorSurf = oFloor.imageData32;
		var aRenderSurf = oFloor.renderSurface32;
		// 1 : créer la surface
		var wx1 = Math.cos(this.oCamera.fTheta - this.fViewAngle);
		var wy1 = Math.sin(this.oCamera.fTheta - this.fViewAngle);
		var wx2 = Math.cos(this.oCamera.fTheta + this.fViewAngle);
		var wy2 = Math.sin(this.oCamera.fTheta + this.fViewAngle);

		var fh = (this.yTexture >> 1) - ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDelta = (wx2 - wx1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var yDelta = (wy2 - wy1) / this.xScrSize; // incrément d'optimisateur trigonométrique
		var xDeltaFront;
		var yDeltaFront;
		var ff = this.yScrSize << 1; // focale
		var fx, fy; // coordonnée du texel finale
		var dFront; // distance "devant caméra" du pixel actuellement pointé
		var ofsDst; // offset de l'array pixel de destination (plancher)
		var wy;
		
		var fhCeil = (this.yTexture >> 1) + ((this.fViewHeight - 1) * this.yTexture >> 1);
		var xDeltaFrontCeil = 0;
		var yDeltaFrontCeil = 0;
		var fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
		var dFrontCeil; // distance "devant caméra" du pixel actuellement pointé
		var ofsDstCeil; // offset de l'array pixel de destination (plafon) 
		var wyCeil = 0;

		var xCam = this.oCamera.x; // coord caméra x
		var yCam = this.oCamera.y; // coord caméra y
		var nFloorWidth = oFloor.image.width; // taille pixel des tiles de flats
		var ofsSrc; // offset de l'array pixel source
		var xOfs = 0; // code du block flat à afficher
		var yOfs = 0; // luminosité du block flat à afficher
		var ps = this.nPlaneSpacing;
		var nBlock;
		var xyMax = this.nMapSize * ps;
		var st = this.nShadingThreshold;
		var sf = this.nShadingFactor;
		var aMap = this.aMap;
		var F = this.oFloor.codes;
		var aFBlock;
		var xz;
		
		var bCeil = this.bCeil;
		
		for (y = 1; y < h; ++y) {
			fBx = wx1;
			fBy = wy1;
			
			// floor
			dFront = fh * ff / y; 
			fy = wy1 * dFront + yCam;
			fx = wx1 * dFront + xCam;
			xDeltaFront = xDelta * dFront;
			yDeltaFront = yDelta * dFront;
			wy = w * (h + y);
			yOfs = Math.min(st, dFront / sf | 0);

			// ceill
			if (bCeil) {
				dFrontCeil = fhCeil * ff / y; 
				fyCeil = wy1 * dFrontCeil + yCam;
				fxCeil = wx1 * dFrontCeil + xCam;
				xDeltaFrontCeil = xDelta * dFrontCeil;
				yDeltaFrontCeil = yDelta * dFrontCeil;
				wyCeil = w * (h - y - 1);
				yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
			}
			
			for (x = 0; x < w; ++x) {
				ofsDst = wy + x;
				ofsDstCeil = wyCeil + x;
				if (fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
					nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[0];
						if (xOfs >= 0) {
							ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
							for (xz = 0; xz < nZoom; ++xz) {
								aRenderSurf[ofsDst + xz] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
					nBlock = aMap[fyCeil / ps | 0][fxCeil / ps | 0] & 0xFF;
					aFBlock = F[nBlock];
					if (aFBlock !== null) {
						xOfs = aFBlock[1];
						if (xOfs >= 0) {
							ofsSrc = (((fyCeil % ps) + yOfs * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
							for (xz = 0; xz < nZoom; ++xz) {
								aRenderSurf[ofsDstCeil + xz] = aFloorSurf[ofsSrc];
							}
						}
					}
				}
				if (bCeil) {
					fyCeil += yDeltaFrontCeil;
					fxCeil += xDeltaFrontCeil;
				}
				fy += yDeltaFront;
				fx += xDeltaFront;
			}
		}
		this.oRenderContext.putImageData(oFloor.renderSurface, 0, 0);
	},
	
	
	
	drawLine : function(x, z, nTextureBase, nPos, bDim, oWalls, nPanel) {
		if (z === 0) {
			z = 0.1;
		} //  [nPanel & 0xFF][bDim ? 1 : 0]
		//var dz = (this.yTexture / (z / this.yScrSize) + 0.5) | 0;
		var nZoom = this.nZoom;
		var ytex = this.yTexture;
		var xtex = this.xTexture;
		var dz = ytex * this.yScrSize / z;
		var fvh = this.fViewHeight;
		dz = dz + 0.5 | 0;
		var dzy = this.yScrSize - (dz * fvh);
		var nPhys = (nPanel >> 8) & 0x7F;
		var nOffset = (nPanel >> 16) & 0xFF;
		var nOpacity = z / this.nShadingFactor | 0;
		if (bDim) {
			nOpacity += this.nDimmedWall;
		}
		if (nOpacity > this.nShadingThreshold) {
			nOpacity = this.nShadingThreshold;
		}
		var aData = [
				oWalls, // image 0
				nTextureBase + nPos, // sx  1
				ytex * nOpacity, // sy  2
				1, // sw  3
				ytex, // sh  4
				x * nZoom, // dx  5
				dzy - 1, // dy  6
				nZoom, // dw  7
				(2 + dz * 2), // dh  8
				z, // z 9
				bDim ? RC.FX_DIM0 : 0
		];

		// Traitement des portes
		switch (nPhys) {
			case this.PHYS_DOOR_SLIDING_UP: // porte coulissant vers le haut
				aData[2] += nOffset;
				if (nOffset > 0) {
					aData[4] = this.yTexture - nOffset;
					aData[8] = ((aData[4] / (z / this.yScrSize) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_UP: // rideau coulissant vers le haut
				if (nOffset > 0) {
					aData[8] = (((this.yTexture - nOffset) / (z / this.yScrSize) + 0.5)) << 1;
				}
				break;

			case this.PHYS_CURT_SLIDING_DOWN: // rideau coulissant vers le bas
				aData[2] += nOffset; // no break here 
				// suite au case 4...

			case this.PHYS_DOOR_SLIDING_DOWN: // Porte coulissant vers le bas
				if (nOffset > 0) {
					aData[4] = this.yTexture - nOffset;
					aData[8] = ((aData[4] / (z / this.yScrSize) + 0.5));
					aData[6] += (dz - aData[8]) << 1;
					aData[8] <<= 1;
				}
				break;

			case this.PHYS_DOOR_SLIDING_LEFT: // porte latérale vers la gauche
				if (nOffset > 0) {
					if (nPos > (xtex - nOffset)) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_RIGHT: // porte latérale vers la droite
				if (nOffset > 0) {
					if (nPos < nOffset) {
						aData[0] = null;
					} else {
						aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
					}
				}
				break;

			case this.PHYS_DOOR_SLIDING_DOUBLE: // double porte latérale
				if (nOffset > 0) {
					if (nPos < (xtex >> 1)) { // panneau de gauche
						if ((nPos) > ((xtex >> 1) - nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + nOffset) % xtex + nTextureBase;
						}
					} else {
						if ((nPos) < ((xtex >> 1) + nOffset)) {
							aData[0] = null;
						} else {
							aData[1] = (nPos + xtex - nOffset) % xtex + nTextureBase;
						}
					}
				}
				break;

			case this.PHYS_INVISIBLE_BLOCK:
				aData[0] = null;
				break;
		}
		if (aData[0]) {
			this.aZBuffer.push(aData);
		}
	},

	/** Rendu de l'image stackée dans le Z Buffer
	 * @param i rang de l'image
	 */
	drawImage : function(i) {
		var rc = this.oRenderContext;
		var aLine = this.aZBuffer[i];
		var sGCO = '';
		var fGobalAlphaSave = 0;
		var nFx = aLine[10];
		if (nFx & 1) {
			sGCO = rc.globalCompositeOperation;
			rc.globalCompositeOperation = 'lighter';
		}
		if (nFx & 12) {
			fGobalAlphaSave = rc.globalAlpha;
			rc.globalAlpha = RC.FX_ALPHA[nFx >> 2];
		}
		var xStart = aLine[1];
		// Si xStart est négatif c'est qu'on est sur un coté de block dont la texture est indéfinie (-1)
		// Firefox refuse de dessiner des textures "négative" dont on skipe le dessin
		if (xStart >= 0) {
			rc.drawImage(
				aLine[0], 
				aLine[1] | 0,
				aLine[2] | 0,
				aLine[3] | 0,
				aLine[4] | 0,
				aLine[5] | 0,
				aLine[6] | 0,
				aLine[7] | 0,
				aLine[8] | 0);
		}
		if (sGCO !== '') {
			rc.globalCompositeOperation = sGCO;
		}
		if (nFx & 12) {
			rc.globalAlpha = fGobalAlphaSave;
		}
	},

	drawSquare : function(x, y, nWidth, nHeight, sColor) {
		this.oRenderContext.fillStyle = sColor;
		this.oRenderContext.fillRect(x, y, nWidth, nHeight);
	},

	drawMap : function() {
		if (this.oMinimap) {
			this.oMinimap.render();
		} else {
			this.oMinimap = new O876_Raycaster.Minimap();
			this.oMinimap.reset(this);
		}
	},

	/* sprites:
	
	1) déterminer la liste des sprite susceptible d'etre visible
	- ce qui sont dans les secteurs traversés par les rayons
	2) déterminer la distance
	3) déterminer l'angle
	4) déterminer la position X (angle)

	 */

	/** Renvoie des information concernant la case contenant le point spécifié
	 * @param x coordonnée du point à étudier
	 * @param y
	 * @param n optionnel, permet de spécifier le type d'information voulu
	 *  - undefined : tout
	 *  - 0: le code texture 0-0xFF
	 *  - 1: le code physique
	 *  - 2: le code offset
	 *  - 3: le tag
	 * @return code de la case.
	 */
	clip : function(x, y, n) {
		if (n === undefined) {
			n = 0;
		}
		var ps = this.nPlaneSpacing;
		var xm = x / ps | 0;
		var ym = y / ps | 0;
		switch (n) {
			case 0:
				return this.getMapXYTexture(xm, ym);
			case 1:
				return this.getMapXYPhysical(xm, ym);
			case 2:
				return this.getMapXYOffset(xm, ym);
			case 3:
				return this.getMapXYTag(xm, ym);
			default:
				return this.aMap[ym][xm];
		}
	},
	
	/**
	 * Animation des textures
	 * Toutes les textures déclarée dans walls.animated subissent un cycle d'animation
	 * Cette fonction n'est pas appelée automatiquement
	 */
	textureAnimation: function() {
		// Animation des textures
		var aCode, w = this.oWall, wc = w.codes, wa = w.animated;
		for (var iAnim in wa) {
			aCode = wc[iAnim];
			aCode.push(aCode.shift());
			aCode.push(aCode.shift());
		}
	},
	
	buildAnimatedTextures: function() {
		// animation des textures
		var w = this.oWall;
		if (!('animated' in w)) {
			w.animated = {};
		}
		var wc = w.codes, wa = w.animated;
		for (var nCode = 0; nCode < wc.length; ++nCode) {
			if (wc[nCode] && wc[nCode].length > 3) { // Une animation de texture ?
				// Enregistrer l'animation de texture dans la propriété "animated"
				wa[nCode] = {
					nIndex: 0,
					nCount: wc[nCode].length >> 1
				};
			}
		}
	}
});

/**
 * Temporise et retarde l'exécution de certaines commandes
 */
O2.createClass('O876_Raycaster.Scheduler', {
	oCommands: null,
	aIndex: null,
	bInvalid: true,
	nTime: 0,

	
	__construct: function() {
		this.oCommands = {};
		this.aIndex = [];
	},

	/** 
	 * Retarde l'exécution de la function passée en paramètre
	 * la fonction doit etre une méthode de l'instance défini dans le
	 * constructeur
	 * @param pCommand methode à appeler
	 * @param nDelay int delai d'exécution
	 */
	delayCommand: function(oInstance, pCommand, nDelay) {
		var aParams = Array.prototype.slice.call(arguments, 3);
		var n = nDelay + this.nTime;
		if (!(n in this.oCommands)) {
			this.oCommands[n] = [];
		}
		this.oCommands[n].push([oInstance, pCommand, aParams]);
		this.aIndex.push(n);
		this.bInvalid = true;
	},

	/** 
	 * Appelée à chaque intervale de temps, cette fonction détermine 
	 * quelle sont les fonctions à appeler.
	 * @param nTime int temps
	 */ 
	schedule: function(nTime) {
		this.nTime = nTime;
		if (this.bInvalid) { // trier en cas d'invalidité
			this.aIndex.sort(function(a, b) { return a - b; });
			this.bInvalid = false;
		}
		var n, i, o;
		while (this.aIndex.length && this.aIndex[0] < nTime) {
			n = this.aIndex.shift();
			o = this.oCommands[n];
			for (i = 0; i < o.length; i++) {
				o[i][2].apply(o[i][0], o[i][2]);
			}
			delete this.oCommands[n];
		}
	}
});

/**
 * Un sprite est une image pouvant être placée et déplacée à l'écran O876
 * Raycaster project
 * 
 * @date 2012-01-01
 * @author Raphaël Marandet Le sprite a besoin d'un blueprint pour récupérer ses
 *         données initiales Le sprite est utilisé par la classe Mobile pour
 *         donner une apparence aux objet ciruclant dans le laby
 */
O2.createClass('O876_Raycaster.Sprite',  {
	oBlueprint : null, // Référence du blueprint
	oAnimation : null, // Pointeur vers l'animation actuelle
	nAnimation : -1, // Animation actuelle
	nFrame : 0, // Frame affichée
	nLight : 0,
	nAngle8 : 0, // Angle 8 modifiant l'animation en fonction de la
	// caméra
	nAnimationType : 0,
	sCompose : '',
	bVisible : true,
	oOverlay: null,
	nOverlayFrame: null,
	bTranslucent: false, // active alpha
	nAlpha: 2, // 1=75% 2=50% 3=25%


	/**
	 * Change l'animation en cours
	 * 
	 * @param n
	 *            numero de la nouvelle animation
	 */
	playAnimation : function(n) {
		if (n == this.nAnimation) {
			return;
		}
		var aBTA = this.oBlueprint.oTile.aAnimations;
		this.nAnimation = n;
		if (n < aBTA.length) {
			// transfere les timers et index d'une animation à l'autre
			if (this.oAnimation === null) {
				this.oAnimation = new O876_Raycaster.Animation();
			}
			if (aBTA[n]) {
				this.oAnimation.assign(aBTA[n]);
				this.bVisible = true;
			} else {
				this.bVisible = false;
			}
			this.oAnimation.nDirLoop = 1;
		} else {
			throw new Error('sprite animation out of range: ' + n + ' max: ' + aBTA.length);
		}
	},

	/**
	 * Permet de jouer une animation
	 * 
	 * @param nAnimationType
	 *            Type d'animation à jouer
	 * @param bReset reseter une animation
	 */
	playAnimationType : function(nAnimationType, bReset) {
		this.nAnimationType = nAnimationType;
		this.playAnimation(this.nAnimationType * 8 + this.nAngle8);
		if (bReset) {
			this.oAnimation.reset();
		}
	},

	setDirection : function(n) {
		this.nAngle8 = n;
		var nIndex = 0;
		if (this.oAnimation !== null) {
			nIndex = this.oAnimation.nIndex;
		}
		this.playAnimationType(this.nAnimationType); // rejouer l'animation en
		// cas de changement de
		// point de vue
		this.oAnimation.nIndex = nIndex; // conserver la frame actuelle
	},

/**
 * Calcule une nouvelle frame d'animation, mise à jour de la propriété
 * nFrame
 */
	animate : function(nInc) {
		if (this.oAnimation) {
			this.nFrame = this.oAnimation.animate(nInc);
		}
	}
});

/** Classe de déplacement automatisé et stupidité artificielle des mobiles
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Classe de base pouvant être étendue
 */
O2.createClass('O876_Raycaster.Thinker', {
	oMobile: null,
	oGame: null,
	think: function() {}
});


O2.createClass('O876_Raycaster.ThinkerManager', {
	oGameInstance : null,
	oLoader : null,

	__construct : function() {
		this.oLoader = new O876.ClassLoader();
	},

	createThinker : function(sThinker) {
		// Les thinkers attaché a un device particulier ne peuvent pas être initialisé
		// transmettre la config du raycaster ? 
		if (sThinker === undefined || sThinker === null) {
			return null;
		}
		var pThinker = this.oLoader.loadClass(sThinker + 'Thinker');
		if (pThinker !== null) {
			var oThinker = new pThinker();
			oThinker.oGame = this.oGameInstance;
			return oThinker;
		} else {
			throw new Error('ThinkerManager : ' + sThinker
					+ ' class not found.');
		}
	}
});

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Fait bouger lemobile de manière aléatoire
 */
O2.extendClass('O876_Raycaster.WanderThinker', O876_Raycaster.Thinker, {
  nTime: 0,
  aAngles: null,
  nAngle: 0,

  __construct: function() {
    this.aAngles = [0, 0.25 * PI, 0.5 * PI, 0.75 * PI, PI, -0.75 * PI, -0.5 * PI, -0.25 * PI];
    this.nTime = 0;
    this.think = this.thinkInit;
  },
  
  think: function() {},

  thinkInit: function() {
	  this.oMobile.fSpeed = 2;
	  this.think = this.thinkGo;
  },

  thinkGo: function() {
    if (this.nTime <= 0) { // changement d'activité si le timer tombe à zero
      this.nAngle = MathTools.rnd(0, 7);
      this.oMobile.fTheta = this.aAngles[this.nAngle];
      this.nTime = MathTools.rnd(15, 25) * 4;
    } else {
      --this.nTime;
      this.oMobile.moveForward();
      if (this.oMobile.oWallCollision.x != 0 || this.oMobile.oWallCollision.y != 0) {
        this.nTime = 0;
      }
    }
  }
});


/** Gestion d'un ensemble de Tiles stockées dans la même image
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * L'objet Tile permet de renseigner le raycaster sur la séquence d'image à charger
 */
O2.createClass('O876_Raycaster.Tile',  {
	oImage : null, // Objet image contenant toutes les Tiles
	nWidth : 0, // Largeur d'une Tile en pixel (!= oImage.width)
	nHeight : 0, // Hauteur d'une Tile en pixel
	sSource : null, // Url source de l'image
	nFrames : 0, // Nombre de Tiles
	aAnimations : null, // Liste des animations
	bShading : true,
	nScale: 1,

	__construct : function(oData) {
		if (oData !== undefined) {
			this.sSource = oData.src;
			this.nFrames = oData.frames;
			this.nWidth = oData.width;
			this.nHeight = oData.height;
			this.bShading = true;
			this.nScale = oData.scale || 1;
			if ('noshading' in oData && oData.noshading) {
				this.bShading = false;
			}
			// animations
			if (oData.animations) {
				var oAnimation, iFrame;
				this.aAnimations = [];
				for ( var iAnim = 0; iAnim < oData.animations.length; iAnim++) {
					if (oData.animations[iAnim] === null) {
						for (iFrame = 0; iFrame < 8; iFrame++) {
							this.aAnimations.push(null);
						}
					} else {
						for (iFrame = 0; iFrame < 8; iFrame++) {
							oAnimation = new O876_Raycaster.Animation();
							oAnimation.nStart = oData.animations[iAnim][0][iFrame];
							oAnimation.nCount = oData.animations[iAnim][1];
							oAnimation.nDuration = oData.animations[iAnim][2];
							oAnimation.nLoop = oData.animations[iAnim][3];
							this.aAnimations.push(oAnimation);
						}
					}
				}
			}
		}
	}
});

/** ArrayTools Boîte à outil pour les tableau (Array)
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */


O2.createObject('ArrayTools', {
	
	/** Retire un élément d'un Array
	 * @param aArray élément à traiter
	 * @param nItem index de l'élément à retirer
	 */
	removeItem: function(aArray, nItem) {
		var aItem = Array.prototype.splice.call(aArray, nItem, 1);
		return aItem[0];
		/*
		if (nItem >= (aArray.length - 1)) {
			return aArray.pop();
		} else {
			var oItem = aArray[nItem];
			aArray[nItem] = aArray.pop();
			return oItem;
		}*/
	},
	
	isArray: function(o) {
		return Array.isArray(o);
	},
	
	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	shuffle: function(o){ //v1.0
		for(var j, x, i = o.length; i; j = (Math.random() * i | 0), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	
	// renvoie l'indice du plus grand élément
	theGreatest: function(a) {
		if (!a) {
			return null;
		}
		var nGreater = a[0], iGreater = 0;
		for (var i = 1; i < a.length; ++i) {
			if (a[i] > nGreater) {
				nGreater = a[iGreater = i];
			}
		}
		return iGreater;
	}
});

O2.createClass('Astar.Point', {
	x : 0,
	y : 0,
	__construct : function(x, y) {
		this.x = x;
		this.y = y;
	}
});

O2.createClass('Astar.Nood', {
	fGCost : 0.0,
	fHCost : 0.0,
	fFCost : 0.0,
	oParent : null,
	oPos : null,

	__construct : function() {
		this.oParent = new Astar.Point(0, 0);
		this.oPos = new Astar.Point(0, 0);
	},

	isRoot : function() {
		return this.oParent.x == this.oPos.x && this.oParent.y == this.oPos.y;
	}
});

O2.createClass('Astar.NoodList', {
	aList : null,

	__construct : function() {
		this.aList = {};
	},

	add : function(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	},

	set : function(x, y, oNood) {
		this.aList[this.getKey(x, y)] = oNood;
	},

	count : function() {
		var n = 0, i = '';
		for (i in this.aList) {
			n++;
		}
		return n;
	},

	exists : function(x, y) {
		if (this.getKey(x, y) in this.aList) {
			return true;
		} else {
			return false;
		}
	},

	getKey : function(x, y) {
		return x.toString() + '__' + y.toString();
	},

	get : function(x, y) {
		if (this.exists(x, y)) {
			return this.aList[this.getKey(x, y)];
		} else {
			return null;
		}
	},

	del : function(x, y) {
		delete this.aList[this.getKey(x, y)];
	},

	empty : function() {
		var i = '';
		for (i in this.aList) {
			return false;
		}
		return true;
	}
});

O2.createClass('Astar.Land', {
	bUseDiagonals : false,
	MAX_ITERATIONS : 2048,
	nIterations : 0,
	aTab : null,
	nWidth : 0,
	nHeight : 0,
	oOpList : null,
	oClList : null,
	aPath : null,
	aMoves : null,
	xLast : 0,
	yLast : 0,
	nLastDir : 0,

	LAND_BLOCK_WALKABLE: 0,

	init : function(a) {
		this.aTab = a;
		this.nHeight = a.length;
		this.nWidth = a[0].length;
	},

	reset : function() {
		this.oOpList = new Astar.NoodList();
		this.oClList = new Astar.NoodList();
		this.aPath = [];
		this.aMoves = [];
		this.nIterations = 0;
	},

	distance : function(x1, y1, x2, y2) {
		return MathTools.distance(x1 - x2, y1 - y2);
	},

	setCell : function(x, y, n) {
		if (this.aTab[y] !== undefined && this.aTab[y][x] !== undefined) {
			this.aTab[y][x] = n;
		} else {
			throw new Error(
					'Astar: Land.badCell: writing tile out of land: ' + x + ', ' + y);
		}
	},

	getCell : function(x, y) {
		if (this.aTab[y]) {
			if (x < this.aTab[y].length) {
				return this.aTab[y][x];
			}
		}
		throw new Error('Astar: Land.badTile: read tile out of land: ' + x + ', ' + y);
	},

	isCellWalkable : function(x, y) {
		try {
			return this.getCell(x, y) == this.LAND_BLOCK_WALKABLE;
		} catch (e) {
			return false;
		}
	},

	// Transferer un node de la liste ouverte vers la liste fermee
	closeNood : function(x, y) {
		var n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	},

	addAdjacent : function(x, y, xArrivee, yArrivee) {
		var i, j;
		var i0, j0;
		var oTmp;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= this.nWidth)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!this.bUseDiagonals && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= this.nHeight)) {
					continue;
				}
				if ((i == x) && (j == y)) {
					continue;
				}
				if (!this.isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new Astar.Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ this.distance(i, j, x, y);
					oTmp.fHCost = this.distance(i, j, xArrivee,	yArrivee);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new Astar.Point(i, j);
					oTmp.oParent = new Astar.Point(x, y);

					if (this.oOpList.exists(i, j)) {
						if (oTmp.fFCost < this.oOpList.get(i, j).fFCost) {
							this.oOpList.set(i, j, oTmp);
						}
					} else {
						this.oOpList.set(i, j, oTmp);
					}
				}
			}
		}
	},

	// Recherche le meilleur noeud de la liste et le renvoi
	bestNood : function(oList) {
		var oBest = null;
		var oNood;
		var iNood = '';

		for (iNood in oList.aList) {
			oNood = oList.aList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	},

	findPath : function(xFrom, yFrom, xTo, yTo) {
		this.reset();
		var oBest;
		var oDepart = new Astar.Nood();
		oDepart.oPos = new Astar.Point(xFrom, yFrom);
		oDepart.oParent = new Astar.Point(xFrom, yFrom);
		var xCurrent = xFrom;
		var yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		var iIter = 0;

		while (!((xCurrent == xTo) && (yCurrent == yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > this.MAX_ITERATIONS) {
				throw new Error('Astar: Land.badPath: pathfinder, too much iterations');
			}
		}
		if (this.oOpList.empty()) {
			 throw new Error('Astar: Land.badDest: pathfinder, no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		this.transformPath(xFrom, yFrom);
	},

	buildPath : function(xTo, yTo) {
		var oCursor = this.oClList.get(xTo, yTo);
		if (oCursor !== null) {
			while (!oCursor.isRoot()) {
				this.aPath.unshift(new Astar.Point(oCursor.oPos.x, oCursor.oPos.y));
				oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
			}
		}
	},

	getDirFromXY : function(xFrom, yFrom, x, y) {
		// Cas Nord 0
	if (xFrom == x) {
		if ((yFrom - 1) == y) {
			return 0;
		}
		if ((yFrom + 1) == y) {
			return 2;
		}
	}
	if (yFrom == y) {
		if ((xFrom - 1) == x) {
			return 3;
		}
		if ((xFrom + 1) == x) {
			return 1;
		}
	}
},

// Transformer la suite de coordonnées en couple (direction, distance)
	transformPath : function(xFrom, yFrom) {
		var i;
		if (this.aPath.length === 0) {
			return;
		}
		this.xLast = this.aPath[0].x;
		this.yLast = this.aPath[0].y;
		this.nLastDir = this.getDirFromXY(xFrom, yFrom, this.xLast,
				this.yLast);
		var d;
		var n = 1;

		var nLen = this.aPath.length;
		for (i = 1; i < nLen; i++) {
			d = this.getDirFromXY(this.xLast, this.yLast,
					this.aPath[i].x, this.aPath[i].y);
			this.xLast = this.aPath[i].x;
			this.yLast = this.aPath[i].y;
			if (d == this.nLastDir) {
				n++;
			} else {
				this.aMoves.push(this.nLastDir);
				this.aMoves.push(n);
				this.nLastDir = d;
				n = 1;
			}
		}
		this.aMoves.push(this.nLastDir);
		this.aMoves.push(n);
	}
});

/** GfxTools Boîte à outil graphique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

O2.createObject('GfxTools', {
	/** Calcule une couleur CSS à partir de donnée R G B A 
	 * @param aData objet {r g b a} r, g, b sont des entier 0-255 a est un flottant 0-1
	 * @return chaine CSS utilisable par le canvas
	 */
	buildRGBA : function(xData) {
		return GfxTools.buildRGBAFromStructure(GfxTools.buildStructure(xData));
	},
	
	buildStructure: function(xData) {
		if (typeof xData === "object") {
			return xData;
		} else if (typeof xData === "number") {
			return GfxTools.buildStructureFromInt(xData);
		} else if (typeof xData === "string") {
			switch (xData.length) {
				case 3:
					return GfxTools.buildStructureFromString3(xData);
					
				case 4:
					if (xData[0] === '#') {
						return GfxTools.buildStructureFromString3(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				case 6:
					return GfxTools.buildStructureFromString6(xData);
					
				case 7:
					if (xData[0] === '#') {
						return GfxTools.buildStructureFromString6(xData.substr(1));
					} else {
						throw new Error('invalid color structure');
					}
					
				default:
					var rx = sStyle.match(/^rgb\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)$/);
					if (rx) {
						return {r: rx[1] | 0, g: rx[2] | 0, b: rx[3] | 0};
					} else {
						throw new Error('invalid color structure');
					}
			}
		}
	},
	
	buildStructureFromInt: function(n) {
		var r = (n >> 16) & 0xFF;
		var g = (n >> 8) & 0xFF;
		var b = n & 0xFF;
		return {r: r, g: g, b: b};
	},
	
	buildStructureFromString3: function(s) {
		var r = parseInt('0x' + s[0] + s[0]);
		var g = parseInt('0x' + s[1] + s[1]);
		var b = parseInt('0x' + s[2] + s[2]);
		return {r: r, g: g, b: b};
	},

	buildStructureFromString6: function(s) {
		var r = parseInt('0x' + s[0] + s[1]);
		var g = parseInt('0x' + s[2] + s[3]);
		var b = parseInt('0x' + s[4] + s[5]);
		return {r: r, g: g, b: b};
	},

	buildRGBAFromStructure: function(oData) {
		var s1 = 'rgb';
		var s2 = oData.r.toString() + ', ' + oData.g.toString() + ', ' + oData.b.toString();
		if ('a' in oData) {
			s1 += 'a';
			s2 += ', ' + oData.a.toString();
		}
		return s1 + '(' + s2 + ')';
	},
	
	buildString3FromStructure: function(oData) {
		var sr = ((oData.r >> 4) & 0xF).toString(16);
		var sg = ((oData.g >> 4) & 0xF).toString(16);
		var sb = ((oData.b >> 4) & 0xF).toString(16);
		return sr + sg + sb;
	}
});

O2.createObject('Marker', {
	
	iterate: function(o, f) {
		o.forEach(function(aRow, x) {
			if (aRow) {
				aRow.forEach(function(v, y) {
					if (v) {
						f(x, y, v);
					}
				});
			}
		});
	},
	
	create: function() {
		return [];
	},
	
	getMarkXY : function(o, x, y) {
		if (o[x]) {
			return o[x][y];
		} else {
			return false;
		}
	},

	markXY : function(o, x, y, v) {
		if (!o[x]) {
			o[x] = Marker.create();
		}
		if (v === undefined) {
			v = true;
		}
		o[x][y] = v;
	},
	
	clearXY : function(o, x, y) {
		if (!o[x]) {
			return;
		}
		o[x][y] = false;
	},


	markBlock : function(o, x1, y1, x2, y2, v) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.markXY(o, x, y, v);
			}
		}
	},
	
	clearBlock : function(o, x1, y1, x2, y2) {
		var xFrom = Math.min(x1, x2);
		var yFrom = Math.min(y1, y2);
		var xTo = Math.max(x1, x2);
		var yTo = Math.max(y1, y2);
		var x, y;
		for (x = xFrom; x <= xTo; x++) {
			for (y = yFrom; y <= yTo; y++) {
				Marker.clearXY(o, x, y);
			}
		}
	}
});
/** MathTools Boîte à outil mathématique
 * O876 raycaster project
 * 2012-01-01 Raphaël Marandet
 */

var PI = 3.14159;
var MathTools = {
	aQuadrans : [ -PI / 2, -PI / 4, 0, PI / 4, PI / 2 ],
	fToDeg : 180 / PI,
	fToRad : PI / 180,
	
	pRndFunc: Math.random,

	sBASE64 : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

	iRndTable : 0,
	nRndSeed: Date.now() % 2147483647,
	
	aRndTable : [ 0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16,
			66, 74, 21, 211, 47, 80, 242, 154, 27, 205, 128, 161, 89, 77, 36,
			95, 110, 85, 48, 212, 140, 211, 249, 22, 79, 200, 50, 28, 188, 52,
			140, 202, 120, 68, 145, 62, 70, 184, 190, 91, 197, 152, 224, 149,
			104, 25, 178, 252, 182, 202, 182, 141, 197, 4, 81, 181, 242, 145,
			42, 39, 227, 156, 198, 225, 193, 219, 93, 122, 175, 249, 0, 175,
			143, 70, 239, 46, 246, 163, 53, 163, 109, 168, 135, 2, 235, 25, 92,
			20, 145, 138, 77, 69, 166, 78, 176, 173, 212, 166, 113, 94, 161,
			41, 50, 239, 49, 111, 164, 70, 60, 2, 37, 171, 75, 136, 156, 11,
			56, 42, 146, 138, 229, 73, 146, 77, 61, 98, 196, 135, 106, 63, 197,
			195, 86, 96, 203, 113, 101, 170, 247, 181, 113, 80, 250, 108, 7,
			255, 237, 129, 226, 79, 107, 112, 166, 103, 241, 24, 223, 239, 120,
			198, 58, 60, 82, 128, 3, 184, 66, 143, 224, 145, 224, 81, 206, 163,
			45, 63, 90, 168, 114, 59, 33, 159, 95, 28, 139, 123, 98, 125, 196,
			15, 70, 194, 253, 54, 14, 109, 226, 71, 17, 161, 93, 186, 87, 244,
			138, 20, 52, 123, 251, 26, 36, 17, 46, 52, 231, 232, 76, 31, 221,
			84, 37, 216, 165, 212, 106, 197, 242, 98, 43, 39, 175, 254, 145,
			190, 84, 118, 222, 187, 136, 120, 163, 236, 249 ],

	/** Calcule le sign d'une valeur
	 * @param x valeur à tester
	 * @return -1 si x < 0, +1 si y > 0, 0 si x = 0
	 */
	sign : function(x) {
		if (x === 0) {
			return 0;
		}
		return x > 0 ? 1 : -1;
	},

	/** Calcul de la distance entre deux point séparés par dx, dy
	 * @param dx delta x
	 * @param dx delta y
	 * @return float
	 */
	distance : function(dx, dy) {
		return Math.sqrt((dx * dx) + (dy * dy));
	},
	
	/**
	 * Détermine si un point (xTarget, yTarget) se situe à l'intérieur de l'angle 
	 * formé par le sommet (xCenter, yCenter) et l'ouverture fAngle.
	 * @param float xCenter, yCenter sommet de l'angle
	 * @param float fAperture ouverture de l'angle
	 * @param float fBissect direction de la bissectrice de l'angle
	 * @param float xTarget, yTarget point à tester
	 * @return boolean
	 */
	isPointInsideAngle: function(xCenter, yCenter, fBissect, fAperture, xTarget, yTarget) {
		var xPoint = xTarget - xCenter;
		var yPoint = yTarget - yCenter;
		var dPoint = MathTools.distance(xPoint, yPoint);
		xPoint /= dPoint;
		yPoint /= dPoint;
		var xBissect = Math.cos(fBissect);
		var yBissect = Math.sin(fBissect);
		var fDot = xPoint * xBissect + yPoint * yBissect;
		return Math.acos(fDot) < (fAperture / 2);
	},

	/** Renvoie, pour un angle donnée, le code du cadran dans lequel il se trouve
	 *	-PI/2...cadran 0...-PI/4...cadran 1...0...cadran 2...PI/4...cadran 3...PI/2
	 * @return entier entre 0 et 4 : la valeur 4 indique que l'angle est hors cadran
	 */
	quadran : function(a) {
		var i = 0;
		while (i < (MathTools.aQuadrans.length - 1)) {
			if (a >= MathTools.aQuadrans[i] && a < MathTools.aQuadrans[i + 1]) {
				break;
			}
			i++;
		}
		return i;
	},

	// conversion radians degres
	toDeg : function(fRad) {
		return fRad * MathTools.fToDeg;
	},

	// Conversion degres radians
	toRad : function(fDeg) {
		return fDeg * MathTools.fToRad;
	},

	
	/**
	 * Défini la graine du générateur 8 bits
	 * @param int n nouvelle graine
	 */
	rndSeed8: function(n) {
		MathTools.iRndIndex = n % MathTools.aRndTable.length;
	},

	/**
	 * Générateur de nombre pseudo-aléatoire sur 8 bits.
	 * Générateur sur table très faible. A n'utiliser que pour des truc vraiment pas importants.
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd8 : function(nMin, nMax) {
		var r = MathTools.aRndTable[MathTools.iRndIndex];
		MathTools.iRndIndex = (MathTools.iRndIndex + 1) & 0xFF;
		var d = nMax - nMin + 1;
		return (r * d / 256 | 0) + nMin;
	},
	
	/**
	 * Défini la nouvelle graine du générateur de nombre pseudo aléatoire sur 31 bits;
	 * @param int n nouvelle graine
	 */
	rndSeed31: function(n) {
		var v = n % 2147483647;
		if (v == 0) {
			v = 1;
		}
		return this.nRndSeed = v;
	},

	/** 
	 * Générateur de nombre aléatoire sur 31 bits;
	 * Si les paramètre ne sont pas précisé on renvoie le nombre sur 31 bits;
	 * sinon on renvoie une valeur redimensionné selon les borne min et max définies
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */ 
	rnd31: function(nMin, nMax) {
		var nRnd = this.rndSeed31(16807 * this.nRndSeed);
		if (nMin === undefined) {
			return nRnd;
		} else {
			return nRnd * (nMax - nMin + 1) / 2147483647 + nMin | 0;
		}
	},
	
	
	/**
	 * Générateur aléatoire standar de JS
	 * Si aucun paramètre n'est spécifié, renvoie un nombre floatant entre 0 et 1
	 * si non renvoie un nombre entier entre les bornes spécifiées
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int / float
	 */
	rndJS: function(nMin, nMax) {
		var fRnd = Math.random();
		if (nMin === undefined) {
			return fRnd;
		} else {
			return (fRnd * (nMax - nMin + 1) | 0) + nMin;
		}
	},

	/**
	 * Fonction abstraite 
	 * nombre aléatoire entre deux bornes
	 * @param int nMin valeur mini
	 * @param int nMax valeur maxi
	 * @return int
	 */
	rnd : null,
	
	benchmarkRnd: function() {
		var x, i, a = [];
		console.time('rnd js');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd js');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);

		a = [];
		console.time('rnd 31');
		for (i = 0; i < 1000000; ++i) {
			x = MathTools.rnd31(0, 10);
			if (a[x] === undefined) {
				a[x] = 1;
			} else {
				++a[x];
			}
		}
		console.timeEnd('rnd 31');
		console.log(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10]);
	},

	// Relance plusieur fois un dé, aditionne et renvoie les résultats
	rollDice : function(nFaces, nCount) {
		if (nCount > 3) {
			return (nCount - 3) * ((1 + nFaces) / 2) + MathTools.rollDice(nFaces, 3) | 0;
		}
		var n = 0;
		for ( var i = 0; i < nCount; i++) {
			n += MathTools.rnd(1, nFaces);
		}
		return n;
	},

	// Choix d'un éléments dans un tableau
	rndChoose : function(a) {
		if (a.length) {
			return a[MathTools.rnd(0, a.length - 1)];
		} else {
			return null;
		}
	},

	// Converti n (decimal) en base 64 
	base64Encode : function(n, l) {
		var s = '';
		if (l === undefined) {
			l = 0;
		}
		while (n > 0) {
			s = MathTools.sBASE64.charAt(n & 63) + s;
			l--;
			n >>= 6;
		}
		while (l > 0) {
			s = 'A' + s;
			l--;
		}
		return s;
	},

	base64Decode : function(s64) {
		var n = 0, nLen = s64.length;
		for ( var i = 0; i < nLen; i++) {
			n = (n << 6) | MathTools.sBASE64.indexOf(s64.charAt(i));
		}
		return n;
	}
};


MathTools.rnd = MathTools.rndJS;
O2.createClass('O876_Raycaster.Transistate', {
	nInterval : 160,
	oInterval : null,
	pDoomloop : null,
	sDoomloopType : 'interval',
	bPause : false,
	nTimeModulo : 0,
	_sState : '',
	bBound: false,

	__construct : function(sFirst) {
		this.setDoomloop(sFirst);
	},


	/** Definie la procédure à lancer à chaque doomloop
	 * @param sProc nom de la méthode de l'objet à lancer
	 */
	setDoomloop : function(sProc) {
		this.pDoomloop = this[this._sState = sProc];
	},

	getDoomLoop : function() {
		return this._sState;
	},

	initDoomloop : function() {
		this.pDoomloop();
		this.pause();
		this.oInterval = setInterval(this.doomloop.bind(this), this.nInterval);
		this.bBound = true;
	},

	doomloop : function() {
		this.pDoomloop();
	},


	/** 
	 * Met la machine en pause
	 * Le timer est véritablement coupé
	 */
	pause : function() {
		this.bPause = true;
		if (this.oInterval) {
			clearInterval(this.oInterval);
			this.oInterval = null;
		}
	},

	/** 
	 * Remet la machine en route après une pause
	 * Le timer est recréé.
	 */
	resume : function() {
		this.pause();
		this.bPause = false;
		this.initDoomloop();
	}
});

/**
 * Classe de personnalisation des 4 face d'un block Cette classe permet de
 * personaliser l'apparence ou les fonctionnalité d'une face d'un mur
 * Actuellement cette classe gène la personnalisation des texture du mur
 */
O2.createClass('O876_Raycaster.XMap', {
	aMap : null,
	nWidth : 0,
	nHeight : 0,
	nWallWidth : 0,
	nWallHeight : 0,
	nShadeFactor : 0,

	/*
	 * attributs de bloc utilisés Il y a 4 groupe d'attribut 1 pourt chaque face
	 * ... par cloneWall : la fonctionnalité de personalisation de la texture -
	 * bWall : flag à true si la texture du mur est personnalisé - oWall :
	 * canvas de la nouvelle texture - x - y ...
	 */

	setSize : function(w, h) {
		this.aMap = [];
		var aBlock, aRow, x, y, nSide;
		this.nWidth = w;
		this.nHeight = h;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				aBlock = [];
				for (nSide = 0; nSide < 4; nSide++) {
					aBlock.push({
						x : x,
						y : y,
						oWall : null,
						bWall : false
					});
				}
				aRow.push(aBlock);
			}
			this.aMap.push(aRow);
		}
	},

	get : function(x, y, nSide) {
		return this.aMap[y][x][nSide];
	},

	set : function(x, y, nSide, xValue) {
		this.aMap[y][x][nSide] = xValue;
	},

	/**
	 * Permet de créer une copie de la texture du mur spécifié.
	 * Renvoie le canvas nouvellement créé pour qu'on puisse dessiner dessus.
	 * Note : cette fonction est pas très pratique mais elle est utilisée par Raycaster.cloneWall
	 * @param oWalls textures murale du laby
	 * @param nWall numéro de la texture murale
	 * @param x
	 * @param y position du mur (pour indexation)
	 * @param nSide face du block concernée.
	 */
	cloneWall : function(oWalls, nWall, x, y, nSide) {
		var oCanvas;
		var oBlock = this.get(x, y, nSide);
		if (oBlock.oWall === null) {
			oBlock.oWall = oCanvas = O876.CanvasFactory.getCanvas();
		} else {
			oCanvas = oBlock.oWall;
		}
		oBlock.bWall = true;
		oCanvas.width = this.nWallWidth;
		oCanvas.height = this.nWallHeight;
		oCanvas.getContext('2d').drawImage(oWalls, nWall * this.nWallWidth, 0, this.nWallWidth, this.nWallHeight, 0, 0, this.nWallWidth, this.nWallHeight);
		return oCanvas;
	}
});

var RC = {
  OBJECT_TYPE_NONE: 0,
  OBJECT_TYPE_MOB: 1,			// Mobile object with Thinker procedure
  OBJECT_TYPE_PLAYER: 2,		// Player (non visible, user controlled mob)
  OBJECT_TYPE_PLACEABLE: 3,		// Non-mobile visible and collisionnable object
  OBJECT_TYPE_MISSILE: 4,		// Short lived mobile with owner 
  OBJECT_TYPE_ITEM: 5,			// Inventory objet
  
  FX_NONE: 0,					// Pas d'effet graphique associé au sprite
  FX_LIGHT_ADD: 1,				// Le sprite est translucide (opération ADD lors du dessin)
  FX_LIGHT_SOURCE: 2,			// Le sprite ne devien pas plus sombre lorsqu'il s'éloigne de la camera
  FX_ALPHA_75: 1 << 2,
  FX_ALPHA_50: 2 << 2,			// le sprite est Alpha 50 % transparent
  FX_ALPHA_25: 3 << 2,
  FX_ALPHA: [1, 0.75, 0.50, 0.25, 0],
  FX_DIM0: 0x10,				// indicateur dim 0 pour corriger un bug graphique d'optimisation
};


/** Liste des code clavier javascript
 * 2012-01-01 Raphaël Marandet
 */

var KEYS = {
  MOUSE: {
    KEY: 0,
    X: 0,
    Y: 1,
    BUTTONS: {
      LEFT: 2,
      RIGHT: 3,
      MIDDLE: 4
    },
    SCROLLUP: 5,
    SCROLLDOWN: 6
  },
  BACKSPACE:     8,
  TAB:           9,
  ENTER:        13,
  SHIFT:        16,
  CTRL:         17,
  ALT:          18,
  PAUSE:        19,
  CAPSLOCK:     20,
  ESCAPE:       27,
  SPACE:        32,
  PAGEUP:       33,
  PAGEDOWN:     34,
  END:          35,
  HOME:         36,
  LEFT:         37,
  UP:           38,
  RIGHT:        39,
  DOWN:         40,
  INSERT:       45,
  DELETE:       46,
  ALPHANUM: {
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  },
  NUMPAD:       {
    0:  96,
    1:  97,
    2:  98,
    3:  99,
    4: 100,
    5: 101,
    6: 102,
    7: 103,
    8: 104,
    9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBSTRACT: 109,
    POINT: 110,
    DIVIDE: 111
  },
  F1:        112,
  F2:        113,
  F3:        114,
  F4:        115,
  F5:        116,
  F6:        117,
  F7:        118,
  F8:        119,
  F9:        120,
  F10:       121,
  F11:       122,
  F12:       123,
  NUMLOCK:   144,
  SCROLLLOCK:145,
  SEMICOLON: 186,
  EQUAL:     187,
  COMMA:     188,
  DASH:      189,
  PERIOD:    190,
  SLASH:     191,
  GRAVE:     192,
  OPENBRACKET:219,
  BACKSLASH: 220,
  CLOSBRACKET:221,
  QUOTE:     222
};


/**
 * Outil d'exploitation de requete Ajax
 * Permet de chainer les requete ajax avec un système de file d'attente.
 */

O2.createObject('XHR', {
	oInstance : null,
	aQueue : [],
	bAjaxing : false,
	oCurrentTarget : null,
	sCurrentURL : '',
	
	
	getQueue: function() {
		return XHR.aQueue;
	},
	
	// Renvoie une instance XHR
	getInstance : function() {
		if (XHR.oInstance === null) {
			XHR.oInstance = new XMLHttpRequest();
		}
		return XHR.oInstance;
	},

	dataReceived : function(oEvent) {
		var xhr = oEvent.target;
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				switch (typeof XHR.oCurrentTarget) {
				case 'function':
					XHR.oCurrentTarget(xhr.responseText);
					break;

				case 'object':
					XHR.oCurrentTarget.innerHTML = xhr.responseText;
					break;

				case 'string':
					document.getElementById(XHR.oCurrentTarget).innerHTML = xhr.responseText;
					break;
				}
				XHR.bAjaxing = false;
				XHR.nextRequest();
			} else {
				throw new Error('xhr error while getting data from ' + XHR.sCurrentURL);
			}
		}
	},

	nextRequest : function() {
		if (XHR.bAjaxing) {
			return;
		}
		if (XHR.aQueue.length) {
			var a = XHR.aQueue.shift();
			XHR.bAjaxing = true;
			XHR.sCurrentURL = a.url;
			XHR.oCurrentTarget = a.target;
			var xhr = XHR.getInstance();
			xhr.open('GET', XHR.sCurrentURL, true);
			xhr.onreadystatechange = XHR.dataReceived;
			xhr.send(null);
		}
	},

	loadFragment : function(sUrl, oTarget) {
		XHR.aQueue.push({ url: sUrl, target: oTarget });
		XHR.nextRequest();
	},

	storeString : function(sUrl, sString) {
		if (typeof sString === 'object') {
			sString = JSON.stringify(sString);
		}
		var xhr = XHR.getInstance(); 
		if (xhr) {
			xhr.open('POST', sUrl, true);
			xhr.send(sString);
		} else {
			throw new Error('xhr not initialized');
		}
	},

	/**
	 * Get data from server asynchronously and feed the spécified DOM Element
	 * 
	 * @param string sURL url
	 * @param object/string/function oTarget
	 * @return string
	 */
	get : function(sURL, oTarget) {
		return XHR.loadFragment(sURL, oTarget);
	},
	
	post: function(sURL, sData) {
		XHR.storeString(sURL, sData);
	},
	
	/**
	 * Get data from server synchronously.
	 * It is known that querying synchronously is bad for health and makes animals suffer. 
	 * So don't use synchronous ajax calls.
	 */
	getSync: function(sURL) {
		console.warn('Synchronous Ajax Query (url : ' + sURL + ') ! It is known that querying synchronously is bad for health and makes animals suffer.');
		var xhr = XHR.getInstance();
		xhr.open('GET', sURL, false);
	    xhr.send(null);
	    if (xhr.status == 200) {
	    	return xhr.responseText;
	    } else {
	    	throw new Error('XHR failed to load: ' + sURL + ' (' + xhr.status.toString() + ')');
	    }
		
	}
});
var CONFIG = {
  game: {
    interval: 40,         /* timer interval (ms)                */
    doomloop: 'interval', /* doomloop type "raf" or "interval"  */
    cpumonitor: false,     /* use CPU Monitor system            */
    fullscreen: false
  },
  raycaster: {
    canvas: 'screen',
    ghostVision: 0,
    drawMap: true,
    smoothTextures: false,
    zoom: 1
  }
};

O2.createObject('MW.ATTRIBUTES_DATA', {

	blind: {
		pos: { haze: 11,	icon: 0,	color: 1},	
		neg: { haze: null,	icon: 0,	color: null}
	},
	clairvoyance: {
		pos: { haze: null,	icon: 20,	color: 0},
		neg: { haze: null,	icon: 20,	color: 1},
	},
	confused: {
		pos: { haze: 6,		icon: 1, 	color: 1},
		neg: { haze: null,	icon: 1,	color: null	},
	},
	cooldown: {
		pos: { haze: null,	icon: 19, 	color: 1},
		neg: { haze: null,	icon: 19,	color: 0},
	},
	damage: {
		pos: { haze: null,	icon: 2, 	color: 1},
		neg: { haze: null,	icon: 2,	color: null	},
	},
	dead: {
		pos: { haze: null,	icon: 3, 	color: 1},
		neg: { haze: null,	icon: 3,	color: null	},
	},
	defense: {
		pos: { haze: 13,	icon: 4, 	color: 0},
		neg: { haze: null,	icon: 4,	color: 1},
	},
	energy: {
		pos: { haze: null,	icon: 5, 	color: 0},
		neg: { haze: null,	icon: 5,	color: 1},
	},
	esp: {
		pos: { haze: 6,		icon: 6, 	color: 0},
		neg: { haze: null,	icon: 6,	color: null	},
	},
	frozen: {
		pos: { haze: null,	icon: 21,	color: 1},
		neg: { haze: null,	icon: 21,	color: 0},
	},
	hold: {
		pos: { haze: 9,		icon: 7, 	color: 1},
		neg: { haze: null,	icon: 7,	color: null	},
	},
	immortal: {
		pos: { haze: 15,	icon: 22, 	color: 0},
		neg: { haze: null,	icon: 22,	color: 1},
	},
	invisible: {
		pos: { haze: null,	icon: 8, 	color: 0},
		neg: { haze: null,	icon: 8,	color: null	},
	},
	luck: {
		pos: { haze: null,	icon: 10, 	color: 0},
		neg: { haze: null,	icon: 10,	color: 1},
	},
	magnet: {
		pos: { haze: 10,	icon: 11, 	color: 1},
		neg: { haze: null,	icon: 11,	color: 0},
	},
	pharma: {
		pos: { haze: null,	icon: 12, 	color: 0},
		neg: { haze: null,	icon: 12,	color: 1},
	},
	power: {
		pos: { haze: 14,	icon: 13, 	color: 0},
		neg: { haze: null,	icon: 13,	color: 1},
	},
	prof_holdroot: {
		pos: { haze: null,	icon: 21,	color: 1},
		neg: { haze: null,	icon: 21,	color: null	},
	},
	reflect: {
		pos: { haze: 12,	icon: 14, 	color: 0},
		neg: { haze: null,	icon: 14,	color: 1},
	},
	root: {
		pos: { haze: 1,		icon: 15, 	color: 1},
		neg: { haze: null,	icon: 15,	color: null	},
	},
	speed: {
		pos: { haze: null,	icon: 16, 	color: 0},
		neg: { haze: 3,		icon: 16,	color: 1},
	},
	vampyre: {
		pos: { haze: null,	icon: 17, 	color: 0},
		neg: { haze: null,	icon: 17,	color: null	},
	},
	vitality: {
		pos: { haze: null,	icon: 18,	color: 0},
		neg: { haze: null,	icon: 18,	color: 1},
	},
});

O2.createObject('MW.BLUEPRINTS_DATA', {
	// mobs
	m_warlock : {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_warlock_b",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 4
		}
	},

	m_succubus:{
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_succubus",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 5
		}
	},
	
	m_imp1: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_imp1",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 5
		}
	},

	m_imp2: {
		type : RC.OBJECT_TYPE_MOB,
		tile : "m_imp2",
		width : 40,
		height : 64,
		thinker : "MW.Mob",
		fx : 0,
		data : {
			sounds : {
				die : 'x_death'
			},
			speed : 5
		}
	},

	p_magbolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c2 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c2",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c3 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c3",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c4 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c4",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c5 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c5",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c6 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c6",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c7 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c7",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_magbolt_c8 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_magbolt_c8",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'hit_magic'
			}
		}
	},

	p_firebolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_fireball",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_fire2',
				die : 'hit_exp'
			}
		}
	},

	p_fireball : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_fireball",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_fire2',
				die : 'hit_exp'
			}
		}
	},

	p_lightbolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_lightbolt",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 3,
		data : {
			sounds : {
				spawn : 'atk_magic',
				die : 'amb_gloom'
			}
		}
	},

	p_spell : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_spell",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0',
				die : 'hit_spell1'
			}
		}
	},

	p_spell_c2 : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_spell_c2",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0',
				die : 'hit_spell1'
			}
		}
	},

	p_bouncing : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : 'p_bouncing',
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 45,
		thinker : "MW.Mob",
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_elec',
				die : 'hit_spell1'
			}
		}
	},

	p_icebolt : {
		type : RC.OBJECT_TYPE_MISSILE,
		tile : "p_icebolt",
		width: CONST.MISSILE_SIZE_NORMAL,
		height : 32,
		thinker : "MW.MagicMissile",
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_ice',
				die : 'hit_ice'
			}
		}
	},

	o_smoke_white : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_smoke_white',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 0,
		data : {
			sounds : {
				spawn : 'hit_spell0'
			}
		}
	},

	o_teleport : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_teleport',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'fx_teleport'
			}
		}
	},

	o_boom : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_boom',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'hit_spell0'
			}
		}
	},
	
	o_expfire : {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_expfire',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_exp'
			}
		}
	},
	
	o_bumporb: {
		type : RC.OBJECT_TYPE_PLACEABLE,
		tile : 'o_bumporb',
		width : 1,
		height : 96,
		thinker : 'MW.Timed',
		fx : 2,
		data : {
			sounds : {
				spawn : 'atk_toxic'
			}
		}
	}
});

O2.createObject('MW.BLUEPRINTS_DEC_DATA', {
	// decorators
	d_barrel: {
		type: RC.OBJECT_TYPE_PLACEABLE,
		tile: 'd_barrel',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_chain_long: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_chain_long',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},

	d_chain_short: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_chain_short',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_cooking_pot: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_cooking_pot',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},

	d_cross: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_cross',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},

	d_cross_heavy: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_cross_heavy',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},

	d_cross_stone: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_cross_stone',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},

	d_light_candle: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_light_candle',
		thinker: null,
		fx: 2,
		width: 20,
		height: 96
	},

	d_light_lamp: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_light_lamp',
		thinker: null,
		fx: 2,
		width: 20,
		height: 96
	},

	d_light_torch: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_light_torch',
		thinker: null,
		fx: 2,
		width: 20,
		height: 96
	},

	d_pillar_wood: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_pillar_wood',
		thinker: null,
		fx: 0,
		width: 8,
		height: 96
	},
	
	d_pole_skull: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_pole_skull',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_pole_two_skulls: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_pole_two_skulls',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_statue_gargoyle: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_statue_gargoyle',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_table_fancy: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_table_fancy',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	},
	
	d_tree: {
		type: RC.OBJECT_TYPE_PLACEABLE, 
		tile: 'd_tree',
		thinker: null,
		fx: 0,
		width: 20,
		height: 96
	}
});

/**
 * Décrit les effet de feedback visuel indiquant qu'on a utilisé un objet ou casté un sort.
 */
O2.createObject('MW.FEEDBACK', {
	pot_haste: {
		flash: [0x00FF66, 50, 3],
		sound: 'amb_gloom',
	},
	pot_luck: {
		flash: [0x00AAFF, 50, 4],
		sound: 'amb_gloom',
	},
	pot_energy: {
		flash: [0x00FF00, 75, 5, 0x0088FF, 40, 2],
		sound: 'amb_gloom',
	},
	pot_resist: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'amb_gloom',
	},
	pot_healing: {
		sound: 'amb_gloom',
	},
	pot_healing2: {
		sound: 'amb_gloom',
	},
	pot_healing3: {
		sound: 'amb_gloom',
	},
	pot_invisibility: {
		flash: [0x9900BB, 50, 3],
		sound: 'amb_gloom',
	},
	pot_esp: {
		flash: [0x00BBFF, 50, 2],
		sound: 'amb_gloom',
	},
	pot_remedy: {
		flash: [0xFFFF00, 50, 2],
		sound: 'amb_gloom',
	},
	pot_slowness: {
		flash: [0x880000, 50, 3],
		sound: 'amb_gloom2',
	},
	pot_poison: {
		flash: [0x000066, 30, 3],
		sound: 'amb_gloom2',
	},
	pot_immortal: {
		flash: [0xFFFF00, 50, 4],
		sound: 'amb_gloom'
	},

	scr_blindness: {
		flash: [0xFFFFFF, 50, 10, 0, 66, 3],
		sound: 'm_chant'
	},
	scr_confusion: {
		flash: [0xCC0000, 55, 4],
		sound: 'm_chant'
	},
	scr_drainlife: {
		flash: [0x990000, 50, 10, 0x440088, 50, 4],
		sound: 'amb_gloom'
	},
	scr_hold: {
		flash: [0xFFFFFF, 50, 4],
		sound: 'm_chant'
	},
	scr_power: {
		flash: [0xFFFFFF, 75, 10, 0xFFFF00, 75, 5, 0xFF0000, 75, 2],
		sound: 'amb_gloom',
	},
	scr_reflect: {
		flash: [0x0044FF, 50, 2],
		sound: 'amb_gloom',
	},
	scr_root: {
		flash: [0x00FFFF, 50, 4],
		sound: 'm_chant'
	},
	scr_snare: {
		flash: [0x0000FF, 50, 4],
		sound: 'm_chant'
	},
	scr_teleport: {
		flash: [0xFFFFFF, 100, 10, 0x0088FF, 50, 4],
	},
	scr_fireball: {
		flash: [0xFFFF00, 50, 10, 0xFF8800, 50, 4],
	},
	scr_magnet: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'm_chant'
	},
	scr_dispel: {
		flash: [0xFFFFFF, 50, 5, 0x0000FF, 30, 2],
		sound: 'm_chant'
	},

	book_fireball: {
		flash: [0xFFFF00, 50, 10, 0xFF8800, 50, 4],
	},
	book_bouncingorb: {
		flash: [0xFFFFFF, 50, 10, 0xFFFF00, 50, 5, 0x00FF00, 50, 3],
	},
	book_nullitysphere: {
		flash: [0xFFFF00, 50, 4],
		sound: 'amb_gloom',
	},
	book_deathspell: {
		flash: [0x440088, 40, 10, 0x000000, 50, 3],
		sound: 'm_chant',
	},
	book_charm: {
		flash: [0xFF66AA, 50, 4],
		sound: 'amb_gloom3',
	},
	book_clairvoyance: {
		flash: [0xAAFFAA, 50, 4],
		sound: 'amb_gloom',
	},
	book_amnesia: {
		flash: [0x993355, 50, 4],
		sound: 'm_chant',
	},
	book_remind: {
		flash: [0x00AA55, 50, 4],
		sound: 'amb_gloom',
	},
	book_magicshutdown: {
		flash: [0xAAAAFF, 50, 4],
		sound: 'm_chant',
	},
	book_mkscroll: {
		flash: [0xFFBB66, 50, 4, 0x440088, 75, 2],
		sound: 'amb_gloom'
	},
	book_deflector: {
		flash: [0xAAAAAA, 50, 4],
		sound: 'amb_gloom'
	},
	book_freeze: {
		flash: [0xFFFFFF, 50, 10, 0x00AAFF, 50, 4],
	}


});

O2.createObject('MW.HAZE_DATA', {
	DEFENSE: 15,	// defense up
	SLOW: 3,		// vitesse impactée : param = niveau de ralentissement
	ROOT: 1,		// vitesse nulle,
	MAGNET: 10, 	// magnetisme
	HOLD: 9,		// paralysie
	BLIND: 11,		// cécité
	CONFUSED: 6,	// confused
	REFLECT: 12,	// reflect
	POWER: 14,		// power up
});

O2.createObject('MW.ICONS', {
	pot_esp : 0,
	pot_haste : 1,
	pot_healing : 2,
	pot_invisibility : 3,
	pot_remedy : 4,
	scr_blindness : 5,
	scr_confusion : 6,
	scr_drainlife : 7,
	scr_hold : 8,
	scr_monster : 9,
	scr_power : 10,
	scr_reflect : 11,
	scr_root : 12,
	scr_snare : 13,
	scr_teleport : 14,
	pot_slowness : 15,
	wtf_root: 16,
	wtf_held: 17,
	wtf_blind: 18,
	wtf_chest: 19,
	scr_magnet: 20,
	scr_weakness: 21,
	scr_fireball: 22,
	pot_resist: 23,
	scr_dispel: 24,
	pot_healing2: 25,
	pot_luck: 26,
	pot_energy: 27,
	pot_healing3: 28,
	pot_poison: 29,
	pot_confusion: 30,
	book_charm: 31,
	book_deathspell: 32,
	book_fireball: 33,
	book_nullitysphere: 34,
	book_clairvoyance: 35,
	book_mkscroll: 36,
	book_deflector: 37,
	book_magicshutdown: 38,
	book_bouncingorb: 39,
	book_amnesia: 40,
	book_remind: 41,
	book_freeze: 42,
	pot_frozen: 43,
	pot_immortal: 44,
	wtf_alert: 45,
	wtf_confused: 46
});

O2.createObject('MW.SOUND_DATA', {
	DOOR_OPEN: ['a_drawstrt', 'a_drawchain', 'a_pushston'],
	DOOR_CLOSE: ['a_doorstop', '', ''],
	
	CHEST_OPEN: 'a_chest',
	CHEST_CLOSE: 'a_closet'
});

O2.createObject('STRINGS', {
		
	lang: 'en',
	
	_parameterSubstitution: function(sDispMsg, aParams) {
		if (aParams !== undefined) {
			switch (aParams.length) {
				case 10:
					sDispMsg = sDispMsg.replace(/\$9/g, STRINGS._(aParams[9])); // no break here
				case 9:
					sDispMsg = sDispMsg.replace(/\$8/g, STRINGS._(aParams[8])); // no break here
				case 8:
					sDispMsg = sDispMsg.replace(/\$7/g, STRINGS._(aParams[7])); // no break here 
				case 7:
					sDispMsg = sDispMsg.replace(/\$6/g, STRINGS._(aParams[6])); // no break here
				case 6:
					sDispMsg = sDispMsg.replace(/\$5/g, STRINGS._(aParams[5])); // no break here
				case 5:
					sDispMsg = sDispMsg.replace(/\$4/g, STRINGS._(aParams[4])); // no break here
				case 4:
					sDispMsg = sDispMsg.replace(/\$3/g, STRINGS._(aParams[3])); // no break here
				case 3:
					sDispMsg = sDispMsg.replace(/\$2/g, STRINGS._(aParams[2])); // no break here
				case 2:
					sDispMsg = sDispMsg.replace(/\$1/g, STRINGS._(aParams[1])); // no break here
				case 1:
					sDispMsg = sDispMsg.replace(/\$0/g, STRINGS._(aParams[0])); // no break here
			}
		}
		return sDispMsg;
	},
	
	_: function(xKey, aParams) {
		if (xKey === null) {
			return '';
		}
		var i = '', sKey, sDispMsg;
		if (typeof xKey === 'string') {
			sKey = xKey.substr(1);
			var oStrings = STRINGS[STRINGS.lang];
			if (sKey in oStrings) {
				sDispMsg = oStrings[sKey];
				if (typeof sDispMsg === 'string') {
					return STRINGS._parameterSubstitution(sDispMsg, aParams);
				} else if (typeof sDispMsg === 'object' || Array.isArray(sDispMsg)) {
					return STRINGS._(sDispMsg, aParams);
				} 
			} else {
				return STRINGS._parameterSubstitution(xKey, aParams);
			}
		} else if (ArrayTools.isArray(xKey)) {
			var aArray = [];
			for (var iArray = 0; iArray < xKey.length; iArray++) {
				aArray.push(STRINGS._(xKey[iArray], aParams));
			}
			return aArray;
		} else if (typeof xKey === 'object') {
			var oResult = {};
			for (i in xKey) {
				oResult[i] = STRINGS._(xKey[i], aParams);
			}
			return oResult;
		} else {
			return xKey;
		}
	},

	en: {
		dlg_button_close: 'Close',
		dlg_button_respawn: 'Revenge !',
		dlg_button_reboot: 'Restart',
		dlg_button_continue: 'Continue',
		
		dlg_youdied_title: 'Killed',
		dlg_youdied_message: 'You were killed by $0.',
		dlg_disconnected_title: 'Connection lost',
		dlg_disconnected_message: 'The connection with the server is lost. Please try again later.',
		dlg_loading_title: 'Loading',
		
		dlg_login_msg: 'Enter your nickname and click on ',
		dlg_login_pass: 'This account is protected by a password.',
		dlg_login_button: 'Connect',
		dlg_logged_msg: 'Welcome <b>$0</b>',
		dlg_logged_button: 'Join game',
					
		boss_msg: 'This is the white mode. You are in white mode because you pressed the "B" key. Press "B" again to exit white mode.',
		boss_title: 'white mode',
		
		frag_msg: 'You killed $0.',
				
		item_pickup: 'Acquired : $0.',
		item_invfull: 'Your inventory is full !',
		item_equip: 'You are now using : $0',
		item_drop: 'You dropped : $0',
		
		itm_scr_blindness: 'Scroll of Blindness',
		itm_scr_confusion: 'Scroll of Confusion',
		itm_scr_drainlife: 'Scroll of Drain life',
		itm_scr_hold: 'Scroll of Hold',
		itm_scr_power: 'Scroll of Power',
		itm_scr_reflect: 'Scroll of Reflection',
		itm_scr_root: 'Scroll of Root',
		itm_scr_snare: 'Scroll of Snare',
		itm_scr_teleport: 'Scroll of Teleport',
		itm_scr_monster: 'Scroll of Summon monster',
		itm_scr_fireball: 'Scroll of Fireball',
		itm_scr_magnet: 'Scroll of Magnet',
		itm_scr_weakness: 'Scroll of Weakness',
		itm_scr_dispel: 'Scroll of Dispel',

		itm_pot_esp: 'Potion of E.S.P.',
		itm_pot_healing: 'Potion of Healing',
		itm_pot_healing2: 'Potion of Greater Healing',
		itm_pot_healing3: 'Potion of Rejunenation',
		itm_pot_haste: 'Potion of Haste',
		itm_pot_remedy: 'Remedy',
		itm_pot_invisibility: 'Potion of Invisibility',
		itm_pot_resist: 'Potion of Magic Resistance',
		itm_pot_luck: 'Potion of Fortune',
		itm_pot_energy: 'Potion of Energy',
		itm_pot_immortal: 'Potion of Immortality',
		
		itm_book_amnesia: 'Amnesia',
		itm_book_bouncingorb: 'Bouncing Orb',
		itm_book_charm: 'Charm Monster',
		itm_book_clairvoyance: 'Clairvoyance',
		itm_book_deathspell: 'Death Spell',
		itm_book_deflector: 'Missile Deflector',
		itm_book_fireball: 'Fireball',
		itm_book_freeze: 'Cone of Cold',
		itm_book_magicshutdown: 'Magic Shutdown',
		itm_book_mkscroll: 'Conjure Scroll',
		itm_book_nullitysphere: 'Nullity Sphere',
		itm_book_remind: 'Remind',
		
		// wands
		itm_wand_basic: 'Basic Wand',
		itm_wand_prismatic: 'Prismatic Wand',
		
		// some weird items
		itm_pot_frozen: 'Frozen potion',
		itm_pot_slowness: 'Potion of Slowness',
		itm_pot_poison: 'Poison',
		itm_pot_confusion: 'Potion of Confusion',

		alert_wtf_invfull: "Your inventory is full.",
		alert_wtf_held: "You're held, you can't do ANY action.",
		alert_wtf_root: "You are rooted. You can't move.",
		alert_wtf_blindread_0: 'You can\'t read scrolls or books while blinded.',
		alert_wtf_blindread_1: 'Scrolls and spellbooks are not written in Braille, you know...',
		alert_wtf_confusedread_0: 'You are confused. You can\'t clearly cast the spell.',
		alert_wtf_confusedread_1: 'Confusion has blurred your mind : You fumbled the spellcasting.',
		
		alert_level_change_60: 'One minute before the game ends.',
		alert_level_change_30: '30 seconds before the game ends.',
		alert_level_change_10: '10 seconds before the game ends.',
		
		alert_wtf_tooslow: 'Your computer is too slow to play high detail mode.',
			
		load_lvl: 'map data...',
		load_gfx: 'loading assets...',
		load_shd: 'pre-shading...',
		load_end: 'complete !'
	}
});

O2.createObject('MW.TILES_DATA', {
	m_warlock_b : {
		src : 'resources/gfx/sprites/m_warlock_b.png',
		width : 64,
		height : 96,
		frames : 27,
		animations : [ [ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],	// stand
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 166, 1 ],		// walk
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 1, 0, 0 ],			// attack
				[ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 11, 50, 0 ] ] // death
	},

	m_succubus : {
		src : 'resources/gfx/sprites/m_succubus.png',
		width : 64,
		height : 96,
		frames : 67,
		animations : [ [ [ 17, 21, 25, 29, 0, 5, 9, 13 ], 1, 0, 0 ],	// stand
				[ [ 16, 20, 24, 28, 0, 4, 8, 12 ], 4, 166, 1 ],			// walk
				[ [ 44, 47, 50, 53, 32, 35, 38, 41 ], 3, 100, 2 ],		// attack
				[ [ 56, 56, 56, 56, 56, 56, 56, 56 ], 11, 50, 0 ] ] 	// death
	},
	
	m_imp1 : {
		src : 'resources/gfx/sprites/m_imp1.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [
				[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
				[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
				[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [
				[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},
	
	m_imp2 : {
		src : 'resources/gfx/sprites/m_imp2.png',
		width : 64,
		height : 96,
		frames : 59,
		animations : [ [ 
				[ 25, 31, 37, 43, 1, 7, 13, 19 ], 1, 0, 0 ], [ 
				[ 24, 30, 36, 42, 0, 6, 12, 18 ], 3, 150, 2 ], [ 
				[ 27, 33, 39, 45, 3, 9, 15, 21 ], 3, 150, 1 ], [ 
				[ 49, 49, 49, 49, 49, 49, 49, 49 ], 11, 50, 0 ] ]
	},

	p_fireball : {
		src : 'resources/gfx/sprites/p_fireball.png',
		width : 50,
		height : 64,
		frames : 20,
		noshading: true,
		animations : [ [ [ 16, 16, 16, 16, 16, 16, 16, 16 ], 4, 100, 0 ],
				[ [ 8, 10, 12, 14, 0, 2, 4, 6 ], 2, 100, 1 ] ]
	},
	p_magbolt : {
		src : 'resources/gfx/sprites/p_magbolt.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c2 : {
		src : 'resources/gfx/sprites/p_magbolt_c2.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c3 : {
		src : 'resources/gfx/sprites/p_magbolt_c3.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c4 : {
		src : 'resources/gfx/sprites/p_magbolt_c4.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c5 : {
		src : 'resources/gfx/sprites/p_magbolt_c5.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c6 : {
		src : 'resources/gfx/sprites/p_magbolt_c6.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c7 : {
		src : 'resources/gfx/sprites/p_magbolt_c7.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	p_magbolt_c8 : {
		src : 'resources/gfx/sprites/p_magbolt_c8.png',
		width : 48,
		height : 64,
		frames : 14,
		noshading: true,
		animations : [ [ [ 8, 8, 8, 8, 8, 8, 8, 8 ], 6, 100, 0 ],
				[ [ 4, 5, 6, 7, 0, 1, 2, 3 ], 1, 0, 0 ] ]
	},
	
	p_lightbolt : {
		src : 'resources/gfx/sprites/p_lightbolt.png',
		width : 64,
		height : 96,
		frames : 6,
		animations : [ [ [ 4, 4, 4, 4, 4, 4, 4, 4 ], 3, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 3, 50, 1 ] ]
	},

	p_spell: {
		src : 'resources/gfx/sprites/p_spell.png',
		width : 64,
		height : 51,
		frames : 8,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 6, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ] ]
	},
	
	p_spell_c2: {
		src : 'resources/gfx/sprites/p_spell_c2.png',
		width : 64,
		height : 51,
		frames : 8,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 6, 100, 0 ],
				[ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ] ]
	},
	
	p_bouncing: {
		src : 'resources/gfx/sprites/p_bouncing.png',
		width : 45,
		height : 45,
		frames : 5,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 2, 100, 1 ],
		               [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 3, 100, 0 ] ]
	},

	p_icebolt : {
		src : 'resources/gfx/sprites/p_icebolt.png',
		width : 48,
		height : 64,
		frames : 30,
		noshading: true,
		animations : [ [ [ 24, 24, 24, 24, 24, 24, 24, 24 ], 6, 100, 0 ],
				[ [ 12, 15, 18, 21, 0, 3, 6, 9 ], 3, 150, 1 ] ]
	},

	e_hazes: {
		src : 'resources/gfx/sprites/e_hazes.png',
		width : 16,
		height : 24,
		frames : 16,
		noshading: true,
		animations : null
	},
	
	// objects
	o_smoke_white : {
		src : 'resources/gfx/sprites/o_smoke_white.png',
		width : 64,
		height : 96,
		frames : 10,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 9, 100, 0 ],
				[ [ 9, 9, 9, 9, 9, 9, 9, 9 ], 1, 1, 0 ] ]
	},
	
	o_teleport : {
		src : 'resources/gfx/sprites/o_teleport.png',
		width : 64,
		height : 96,
		frames : 8,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 100, 0 ],
				[ [ 7, 7, 7, 7, 7, 7, 7, 7 ], 1, 1, 0 ] ]
	},
	
	o_boom : {
		src : 'resources/gfx/sprites/o_boom.png',
		width : 64,
		height : 96,
		frames : 7,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 7, 100, 0 ] ]
	},
	
	o_expfire : {
		src : 'resources/gfx/sprites/o_expfire.png',
		width : 64,
		height : 96,
		frames : 8,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 8, 100, 0 ] ]
	},
	
	o_bumporb : {
		src : 'resources/gfx/sprites/p_bouncing.png',
		width : 45,
		height : 45,
		frames : 5,
		noshading: true,
		animations : [ [ [ 2, 2, 2, 2, 2, 2, 2, 2 ], 3, 100, 0 ] ]
	},
	
	// icones
	i_icons32 : {
		src : 'resources/gfx/icons/icons32.png',
		width : 32,
		height : 32,
		frames : 64,
		noshading: true,
		animations : null
	},
	
	// icones 16
	i_icons16 : {
		src : 'resources/gfx/icons/icons16.png',
		width : 16,
		height : 32,
		frames : 64,
		noshading: true,
		animations : null
	}
});

O2.createObject('MW.TILES_DEC_DATA', {
	d_barrel : {
		src : 'resources/gfx/objects/d_barrel.png',
		width: 27,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_chain_long : {
		src : 'resources/gfx/objects/d_chain_long.png',
		width: 19,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_chain_short : {
		src : 'resources/gfx/objects/d_chain_short.png',
		width: 19,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_cooking_pot : {
		src : 'resources/gfx/objects/d_cooking_pot.png',
		width: 64,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_cross : {
		src : 'resources/gfx/objects/d_cross.png',
		width: 41,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_cross_heavy : {
		src : 'resources/gfx/objects/d_cross_heavy.png',
		width: 36,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_cross_stone : {
		src : 'resources/gfx/objects/d_cross_stone.png',
		width: 31,
		height: 96,
		frames: 1,
		animations: [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},

	d_light_candle: {
		src : 'resources/gfx/objects/d_light_candle.png',
		width: 21,
		height: 96,
		frames: 3,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 3, 100, 1 ] ]
	},

	d_light_torch: {
		src : 'resources/gfx/objects/d_light_torch.png',
		width: 12,
		height: 96,
		frames: 4,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 4, 100, 1 ] ]
	},
	
	d_light_lamp: {
		src : 'resources/gfx/objects/d_light_lamp.png',
		width: 29,
		height: 96,
		frames: 4,
		noshading: true,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 4, 100, 1 ] ]
	},

	d_pillar_wood: {
		src : 'resources/gfx/objects/d_pillar_wood.png',
		width: 8,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},

	d_pole_skull: {
		src : 'resources/gfx/objects/d_pole_skull.png',
		width: 12,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_pole_two_skulls: {
		src : 'resources/gfx/objects/d_pole_two_skulls.png',
		width: 15,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_statue_gargoyle: {
		src : 'resources/gfx/objects/d_statue_gargoyle.png',
		width: 28,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},
	
	d_table_fancy: {
		src : 'resources/gfx/objects/d_table_fancy.png',
		width: 64,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	},

	d_tree: {
		src : 'resources/gfx/objects/d_table_fancy.png',
		width: 64,
		height: 96,
		frames: 1,
		animations : [ [ [ 0, 0, 0, 0, 0, 0, 0, 0 ], 1, 100, 0 ] ]
	}
});

O2.createClass('MW.ClientSocket', {
	oSocket: null,
	oEventHandlers: null,


	/**
	 * Envoie d'un message au serveur
	 * @param string sMessage message
	 * @param any xData
	 */
	send: function(sMessage, xData) {
		this.oSocket.emit(sMessage, xData);
	},

	/**
	 * Initie la connexion au server 
	 * Utilise les données affichées dans la bar de location
	 */
	connect: function() {
		var sIP = location.hostname;
		var sPort = location.port;
		this.oSocket = io.connect('http://' + sIP + ':' + sPort + '/');
	},

	/**
	 * Définit un nouveau handler de message socket
	 * Lorsque le client recevra un message de ce type : il appelera la methode correspondante
	 * @param string sEvent message socket à prendre en compte
	 */
	setSocketHandler: function(sEvent, pHandler) {
		if (this.oEventHandlers === null) {
			this.oEventHandlers = {};
		}
		this.oEventHandlers[sEvent] = pHandler;
		this.oSocket.on(sEvent, pHandler);
	},
	
	setSocketHandlers: function(oHandlers) {
		for (var sMessage in oHandlers) {
			this.setSocketHandler(sMessage, oHandlers[sMessage]);
		}
	},
	
	/**
	 * Supprime un gestionnaire de message socket
	 * @param string sEvent message socket à ne plus prendre en compte
	 */
	clearSocketHandler: function(sEvent) {
		this.oSocket.removeListener(sEvent, this.oEventHandlers[sEvent]);
		this.oEventHandlers[sEvent] = null;
	},
	
	/**
	 * Désactive tous les gestionnaires de message socket de cette classe
	 * (leur methode commence par "sc")
	 */
	deactivateNetworkListeners: function() {
		for (var sEvent in this.oEventHandlers) {
			this.clearSocketHandler(sEvent);
		}
		this.oEventHandlers = {};
	},	
	
	/**
	 * Déconnecte le client du server
	 */
	disconnect: function() {
		this.deactivateNetworkListeners();
		this.oSocket.disconnect();
	}
});

/** Effet graphique temporisé
 * Simule un effet d'éblouissement à la Mass Effect 3
 */
O2.extendClass('MW.GXBlind', O876_Raycaster.GXEffect, {
	sClass: 'Blind',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oFlashCanvas: null,
	oFlashContext: null,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oFlashCanvas = O876.CanvasFactory.getCanvas();
		this.oFlashCanvas.width = this.oCanvas.width;
		this.oFlashCanvas.height = this.oCanvas.height;
		this.oFlashContext = this.oFlashCanvas.getContext('2d');
		this.oFlashContext.fillStyle = 'rgb(0, 0, 0)';
		this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
		this.nTime = 0;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildBlindness();
		this.oContext.drawImage(this.oFlashCanvas, 0, 0);
	},

	done: function() {
		this.oFlashCanvas = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	
	buildBlindness: function() {
		var xGA = this.oFlashContext.globalAlpha;
		var f = Math.sin(MathTools.toRad(this.nTime << 3));
		if (f < 0) {
			this.oFlashContext.globalAlpha = 0; 
		} else {
			this.oFlashContext.globalAlpha = f;
		}
		this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
		this.oFlashContext.globalAlpha = xGA;
		
		xGA = this.oFlashContext.globalCompositeOperation;
		this.oFlashContext.globalCompositeOperation = 'lighter';
		this.oFlashContext.drawImage(this.oCanvas, 0, 0);
		this.oFlashContext.globalCompositeOperation = xGA;
	}
});

/** Effet graphique temporisé
 * Ajoute un filtre coloré pour représenté l'application d'effets
 * entravant le mouvement du joueur.
 * Il y a plusieurs modes correspondant à plusieurs couleurs
 * - Mode SNARE : dégradé inférieur vert
 * - Mode ROOT : dégradé inférieur magenta
 * - Mode HOLD : calque complet bleu
 * Il ne peut y avoir qu'un seul mode à la fois
 * Chaque mode à sa priorité
 * C'est le mode le plus prioritaire qui s'exprime.
 * ex : si le joueur est ROOT + HOLD, c'est HOLD qui s'exprime
 * l'effet sera donc un calque complet bleu.
 * 
 */
O2.extendClass('MW.GXColorVeil', O876_Raycaster.GXEffect, {
	sClass: 'ColorVeil',
	oCanvas: null,
	oContext: null,
	nTime: 0,

	xStyle: null,
	yFrom: 0,
	yTo: 0,
	
	nEffectMask: 0,
	
	SNARE: 1,
	ROOT: 2,
	HOLD: 4,
	REFLECT: 8,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.nTime = 0;
	},
	
	/**
	 * Défini l'effet sur SNARE
	 * Construit un gradien inférieur vert
	 */
	setupSnare: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(0, 64, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 64, 255, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/** Défini l'effet sur ROOT
	 * Construit un gradient inférieur magenta
	 */
	setupRoot: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(0, 220, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 220, 255, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/** Défini l'effet sur HOLD
	 * Construit un calque coloré Bleu
	 */
	setupHold: function() {
		this.xStyle = this.oContext.createLinearGradient(0, 0, this.oCanvas.width - 1, 0);
		this.xStyle.addColorStop(0.000, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.125, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.250, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.375, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.500, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.625, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(0.750, 'rgba(220, 220, 255, 0)');
		this.xStyle.addColorStop(0.875, 'rgba(220, 220, 255, 1)');
		this.xStyle.addColorStop(1.000, 'rgba(220, 220, 255, 0)');
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupReflect: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 185, 255, 0)');
		this.xStyle.addColorStop(1, 'rgba(0, 185, 255, 1)'); // 00b9ff
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupInvisible: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(0, 0, 0, 0.8)'); 
		this.xStyle.addColorStop(1, 'rgba(128, 0, 192, 0.8)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	
	setupVampyre: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(128, 0, 0, 0.8)'); 
		this.xStyle.addColorStop(1, 'rgba(192, 64, 64, 0.8)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	setupPower: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(255, 0, 0, 0.75)'); 
		this.xStyle.addColorStop(0.9, 'rgba(255, 255, 0, 0.75)'); 
		this.xStyle.addColorStop(1, 'rgba(255, 255, 255, 0.75)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},

	setupWeakness: function() {
		var w2 = this.oCanvas.width >> 1;
		var h2 = this.oCanvas.height >> 1;
		this.xStyle = this.oContext.createRadialGradient(w2, h2, h2 >> 2, w2, h2, w2);
		this.xStyle.addColorStop(0, 'rgba(0, 0, 0, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(255, 0, 0, 0.75)'); 
		this.xStyle.addColorStop(0.9, 'rgba(255, 0, 255, 0.75)'); 
		this.xStyle.addColorStop(1, 'rgba(64, 0, 255, 0.75)'); 
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},
	
	/**
	 * Défini l'effet sur MAGNET
	 * Construit un gradien inférieur gris
	 */
	setupMagnet: function() {
		this.xStyle = this.oContext.createLinearGradient(0, this.oCanvas.height >> 1, 0, this.oCanvas.height - 1);
		this.xStyle.addColorStop(0, 'rgba(160, 160, 160, 0)');
		this.xStyle.addColorStop(1, 'rgba(160, 160, 160, 1)');
		this.yFrom = this.oCanvas.height >> 1;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},


	/**
	 * Défini l'effet sur MAGNET
	 * Construit un gradien inférieur gris
	 */
	setupDefense: function() {
		this.xStyle = this.oContext.createLinearGradient(0, 0, this.oCanvas.width, this.oCanvas.height);
		this.xStyle.addColorStop(0, 'rgba(250, 250, 160, 1)');
		this.xStyle.addColorStop(0.4, 'rgba(250, 250, 160, 0)');
		this.xStyle.addColorStop(0.6, 'rgba(250, 250, 160, 0)');
		this.xStyle.addColorStop(1, 'rgba(250, 250, 160, 1)');
		this.yFrom = 0;
		this.yTo = this.oCanvas.height;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		var f = this.oContext.globalAlpha;
		this.oContext.globalAlpha = Math.sin(MathTools.toRad(this.nTime << 3)) / 5 + 0.444;
		this.oContext.fillStyle = this.xStyle;
		this.oContext.fillRect(0, this.yFrom, this.oCanvas.width, this.yTo);
		this.oContext.globalAlpha = f;
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	}
});

/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
O2.extendClass('MW.GXConfused', O876_Raycaster.GXEffect, {
	sClass: 'Confused',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oConfCanvas: null,
	oConfContext: null,
	
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oConfCanvas = O876.CanvasFactory.getCanvas();
		this.oConfCanvas.width = this.oCanvas.width;
		this.oConfCanvas.height = this.oCanvas.height;
		this.oConfContext = this.oConfCanvas.getContext('2d');
		this.oConfContext.fillStyle = 'rgb(0, 0, 0)';
		this.oConfContext.fillRect(0, 0, this.oConfCanvas.width, this.oConfCanvas.height);
		this.nTime = 0;
		this.bOver = false;
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildConfusion();
		this.oContext.drawImage(this.oConfCanvas, 0, 0);
	},

	done: function() {
		this.oConfCanvas = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	buildConfusion: function() {
		var fx = Math.sin(MathTools.toRad(this.nTime * 9.8)) + Math.sin(MathTools.toRad(this.nTime * 4.77)) + 2;
		var fy = Math.sin(MathTools.toRad(this.nTime * 4.1)) + Math.sin(MathTools.toRad(this.nTime * 2.25)) + 2;
		var fx2 = Math.sin(MathTools.toRad(this.nTime * 7.8)) + Math.sin(MathTools.toRad(this.nTime * 5.77)) + 2;
		var fy2 = Math.sin(MathTools.toRad(this.nTime * 3.1)) + Math.sin(MathTools.toRad(this.nTime * 3.25)) + 2;
		var nx = fx * 16 | 0;
		var ny = fy * 8 | 0;
		var nx2 = fx2 * 16 | 0;
		var ny2 = fy2 * 8 | 0;
		
		this.oConfContext.drawImage(
			this.oCanvas, 
			nx, 
			ny, 
			this.oCanvas.width - nx - nx2, 
			this.oCanvas.height - ny - ny2, 
			0,
			0,
			this.oConfCanvas.width,
			this.oConfCanvas.height
		);
	}
});

O2.extendClass('MW.GXFlood', O876_Raycaster.GXEffect, {
	sClass: 'Flood',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	aAmp: null,
	aPls: null,
	BUBBLES: 40,
	TIME_AMP: 16,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.nTime = 0;
		this.aAmp = [];
		this.aPls = [];
		for (var i = 0; i < this.BUBBLES * 2; ++i) {
			this.aAmp.push(MathTools.rnd(4, 32));
			this.aPls.push(MathTools.rnd(1, 1));
		}
	},
	
	isOver: function() {
		return (this.nTime * this.TIME_AMP) >= (this.oCanvas.height + 128);
	},

	process: function() {
		++this.nTime;
	},

	render: function() {
		var c = this.oContext;
		var t = this.nTime * this.TIME_AMP;
		var y = this.oCanvas.height - t;
		var w = this.oCanvas.width;
		c.fillStyle = '#002020';
		c.fillRect(0, y, w, t);
		c.fillStyle = 'rgba(0, 32, 32, 0.75)';
		c.strokeStyle = 'rgb(128, 128, 192)';
		for (var i = 0; i < this.BUBBLES; ++i) {
			c.beginPath();
			c.arc(this.aAmp[i] + i * w / this.BUBBLES | 0, y + 16 * Math.sin(i * 3 + this.nTime / 4) | 0, this.aAmp[i], 0, 2 * PI);
			c.lineWidth = this.aAmp[i] >> 3;
			c.fill();
			c.stroke();
		}
		for (i = 0; i < this.BUBBLES; ++i) {
			c.beginPath();
			c.arc(this.aAmp[i + this.BUBBLES] + i * w / this.BUBBLES | 0, y + 32 * Math.sin(i * 3 + this.nTime / 4) | 0, this.aAmp[i + this.BUBBLES], 0, 2 * PI);
			c.lineWidth = this.aAmp[i + this.BUBBLES] >> 3;
			c.fill();
			c.stroke();
		}
	
	},

	done: function() {
		var nPower = 100;
		var nSpeed = 2;
		var rc = this.oRaycaster;
		var oGXFlash = new O876_Raycaster.GXFlash(rc);
		var nColor = 0x002020;
		var r = (nColor & 0xFF0000) >> 16;
		var g = (nColor & 0xFF00) >> 8;
		var b = nColor & 0xFF;
		oGXFlash.fAlpha = nPower / 100;
		oGXFlash.fAlphaFade = rc.TIME_FACTOR * nSpeed / 5000;
		oGXFlash.oColor = {r: r, g: g, b: b, a: nPower / 100};
		rc.oEffects.addEffect(oGXFlash);
		rc.oEffects.addEffect(new GXUnderwater(rc));
		rc.oVisual.light >>= 1;
		rc.oVisual.fogDistance *= 0.75;
		var w = rc.oWall.image;
		var wc = w.getContext('2d');
		wc.drawImage(w, w.width >> 1, 0, w.width >> 1, w.height, 0, 0, w.width >> 1, w.height);
		rc.buildGradient();
	},
	
	terminate: function() {
		this.nTime = this.oCanvas.height + 128;
	}
});

O2.extendClass('MW.GXIconPad', O876_Raycaster.GXEffect, {
	sClass : 'IconPad',
	oCanvas : null,
	oContext : null,

	oRenderCanvas : null,
	oRenderContext : null,

	oIcons : null,
	oEffects : null,
	oCreature : null,

	sSnapShot : 'xxx',

	PAD_HEIGHT : 48,
	PAD_Y : 8,
	PAD_X : 8,
	PAD_ICON_SPACING : 2,
	PAD_ICON_SIZE : 48,

	__construct : function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
		this.oRenderCanvas = O876.CanvasFactory.getCanvas();
		this.oRenderCanvas.width = this.oCanvas.width - this.PAD_X - this.PAD_X;
		this.oRenderCanvas.height = this.PAD_HEIGHT;
		this.oRenderContext = this.oRenderCanvas.getContext('2d');
	},

	/**
	 * Défini la créature qui doit être monitorée
	 * 
	 * @param oCreature
	 */
	setCreature : function(oCreature) {
		this.oCreature = oCreature;
		this.oEffects = this.oCreature.oEffects;
	},

	/**
	 * Génère un icone ou retrouve celle qui a déja été créée avec
	 * l'identifiant spécifié
	 * 
	 * @param sIcon
	 *            identifiant de l'icone (nom de l'altération)
	 */
	getIcon : function(sIcon) {
		var sIconName = 'eff_' + sIcon;
		if (!(sIconName in ICONS)) {
			throw new Error('unknown alteration icon: ' + sIcon);
		}
		if (this.oIcons === null) {
			this.oIcons = {};
		}
		if (!(sIcon in this.oIcons)) {
			var oIcon = this.oRaycaster.oHorde.oTiles.i_icons32.oImage;

			this.oIcons[sIcon] = {
				icon : oIcon,
				effect : null,
				visible : true,
				offset : ICONS[sIconName] * this.PAD_ICON_SIZE
			};
		}
		return this.oIcons[sIcon];
	},

	/**
	 * Associe une icones avec un effet Si l'effet spécifié à un timeout
	 * trop petit par rapport a l'effet en cours, la commande est
	 * ignorée : on ne désire afficher que l'effets le plus long
	 */
	setIconEffect : function(oEffect) {
		var oIcon = this.getIcon(oEffect.sEffect.substr(1, 4));
		// pas d'effet associé
		if (oIcon.effect === null) {
			oIcon.effect = oEffect;
			return oIcon;
		}
		// même effet déja associé
		if (oIcon.effect == oEffect) {
			return oIcon;
		}
		if (oIcon.effect.bExpirable && oIcon.effect.nTimeOut < oEffect.nTimeOut) { 
			// L'effet en cours est expirable et le timer du nouvel effet est plus long
			// on change d'effet
			oIcon.effect = oEffect;
		}
		return oIcon;
	},
	
	reset: function() {
		this.sSnapShot = 'xxx';
		this.oIcons = null;
	},

	/**
	 * Produit un cliché des altération d'état Si le cliché change il
	 * faut refaire les icones
	 */
	processIcons : function() {
		var nEffCount = this.oEffects.length;
		var sSnapShot = '';
		var oEffect;
		var iEff;
		// vérifier juste si les effets sont les mêmes
		for (iEff = 0; iEff < nEffCount; iEff++) {
			oEffect = this.oEffects[iEff];
			sSnapShot += oEffect.sEffect;
		}
		if (sSnapShot != this.sSnapShot) {
			this.sSnapShot = sSnapShot;
			for (iEff = 0; iEff < nEffCount; iEff++) {
				oEffect = this.oEffects[iEff];
				this.setIconEffect(oEffect);
			}
			return this.orderIcons();
		} else {
			return false;
		}
	},

	// Comparateur d'icone
	compareIcons : function(oIconA, oIconB) {
		return oIconA.effect.sEffect > oIconB.effect.sEffect;
	},

	/**
	 * Organise les icons Commute l'état visible/invisible de chaque
	 * icone
	 */
	orderIcons : function() {
		var aDisplayIcons = [];
		var oIcon;
		for ( var iIc in this.oIcons) {
			oIcon = this.oIcons[iIc];
			if (oIcon.effect) { // Effet valide ?
				if (oIcon.effect.hasExpired()) { // L'effet vient
													// d'expirer
					// on supprime cet effet inutile
					oIcon.effect = null;
					oIcon.visible = false;
				} else {
					// l'effet est actif
					aDisplayIcons.push(oIcon);
					oIcon.visible = true;
				}
			}
		}
		aDisplayIcons.sort(this.compareIcons);
		return aDisplayIcons;
	},
	
	/**
	 * Cette fonction doit renvoyer TRUE si l'effet est fini
	 * 
	 * @return bool
	 */
	isOver : function() {
		return false;
	},

	/**
	 * Fonction appelée par le gestionnaire d'effet pour recalculer
	 * l'état de l'effet
	 */
	process : function() {
		var x = 0;
		var oIcon;
		var a = this.processIcons();
		if (a) {
			this.oRenderContext
					.clearRect(0, 0, this.oRenderCanvas.width,
							this.oRenderCanvas.height);
			for (var i in a) {
				oIcon = a[i];
				if (oIcon.visible) {
					this.oRenderContext.drawImage(oIcon.icon,
							oIcon.offset, 0, this.PAD_ICON_SIZE,
							this.PAD_ICON_SIZE, x, 0,
							this.PAD_ICON_SIZE, this.PAD_ICON_SIZE);
					x += this.PAD_ICON_SIZE + this.PAD_ICON_SPACING;
				}
			}
		}
	},

	/**
	 * Fonction appelée par le gestionnaire d'effet pour le rendre à
	 * l'écran
	 */
	render : function() {
		this.oContext.drawImage(this.oRenderCanvas, this.PAD_X,
				this.PAD_Y);
	},

	/**
	 * Fonction appelée lorsque l'effet se termine de lui même ou stoppé
	 * par un clear() du manager
	 */
	done : function() {
	},

	/** Permet d'avorter l'effet
	 * Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
	 * (restauration de l'état du laby par exemple)
	 */
	terminate : function() {
	}
});

O2.extendClass('MW.GXMessage', O876_Raycaster.GXMessage, {
	oStyle: {
		background: 'rgb(255, 255, 255)',
		border: 'rgb(64, 64, 64)',
		text: 'rgb(220, 220, 220)',
		shadow: 'rgb(0, 0, 0)',
		width: 320,
		height: 40,
		font: 'monospace 10',
		speed: 100,
		position: 8
	}
});

/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
O2.extendClass('MW.GXQuake', O876_Raycaster.GXEffect, {
	sClass: 'Quake',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	fAmp: 10,
	
	oQuakeCanvas: null,
	oQuakeContext: null,
	
	

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 
		this.oQuakeCanvas = O876.CanvasFactory.getCanvas();
		this.oQuakeCanvas.width = this.oCanvas.width;
		this.oQuakeCanvas.height = this.oCanvas.height;
		this.oQuakeContext = this.oQuakeCanvas.getContext('2d');
		this.oQuakeContext.fillStyle = 'rgb(0, 0, 0)';
		this.oQuakeContext.fillRect(0, 0, this.oQuakeCanvas.width, this.oQuakeCanvas.height);
		this.nTime = 0;
		this.bOver = false;
	},

	isOver: function() {
		return this.nTime > 10;
	},

	process: function() {
		this.fAmp = this.fAmp * 0.8;
		++this.nTime;
	},

	render: function() {
		this.buildQuake();
		this.oContext.drawImage(this.oQuakeCanvas, 0, 0);
	},

	done: function() {
		this.oQuakeCanvas = null;
	},
	
	terminate: function() {
		this.nTime = 11;
	},
	
	buildQuake: function() {
		var fx = this.fAmp * Math.sin(MathTools.toRad(this.nTime * 100));
		this.oQuakeContext.drawImage(
			this.oCanvas,
			0, 
			fx 
		);
	}
});

/** Effet graphique temporisé
 * Simule un effet du time stop
 */
O2.extendClass('MW.GXTimeStop', O876_Raycaster.GXEffect, {
	sClass: 'TimeStop',
	oCanvas: null,
	oContext: null,
	bOver: false,
	nTime: 0,
	
	oPixBuff:null,
	oPixBuff8: null,
	oPixBuff32: null,
	
	wBuff: 0,
	hBuff: 0,
	nPixelCount: 0,
	
	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d');
		this.bOver = false;
		var oData = this.oContext.getImageData(0, 0, this.wBuff = this.oCanvas.width, this.hBuff = this.oCanvas.height);
		this.nPixelCount = this.hBuff * this.wBuff;
		this.oPixBuff = new ArrayBuffer(oData.data.length);
		this.oPixBuff8 = new Uint8ClampedArray(this.oPixBuff); 
		this.oPixBuff32 = new Uint32Array(this.oPixBuff);
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildTimeStop();
	},

	done: function() {
	},
	
	terminate: function() {
		this.bOver = true;
	},
	
	buildTimeStop: function() {
		var oImageData = this.oContext.getImageData(0, 0, this.wBuff, this.hBuff);
		var pc = this.nPixelCount;
		this.oPixBuff8.set(oImageData.data);
		var p32 = this.oPixBuff32;
		var p, r, g, b, v;
		for (var i = 0; i < pc; i += 1) {
			p = p32[i];
			b = (p >> 16) & 0xFF;
			g = (p >> 8) & 0xFF;
			r = p & 0xFF;
			v = (r * 19 + g * 38 + b * 7) >> 6;
			p32[i] = (p & 0xFF000000) | (v << 16) | (v << 8) | v;
		}
		oImageData.data.set(this.oPixBuff8);
		this.oContext.putImageData(oImageData, 0, 0);
	}
});

/** Effet graphique temporisé
 * Simule un effet de vision sous-marine
 */
O2.extendClass('MW.GXUnderwater', O876_Raycaster.GXEffect, {
	sClass: 'Underwater',
	oCanvas: null,
	oContext: null,
	nTime: 0,
	bOver: false,
	
	oDistCanvas: null,
	oDistContext: null,

	oDistCanvas2: null,
	oDistContext2: null,

	__construct: function(oRaycaster) {
		__inherited(oRaycaster);
		this.oCanvas = this.oRaycaster.oCanvas;
		this.oContext = this.oCanvas.getContext('2d'); 

		this.oDistCanvas = O876.CanvasFactory.getCanvas();
		this.oDistCanvas.width = this.oCanvas.width;
		this.oDistCanvas.height = this.oCanvas.height;
		this.oDistContext = this.oDistCanvas.getContext('2d');
		this.oDistContext.fillStyle = 'rgb(0, 0, 0)';
		this.oDistContext.fillRect(0, 0, this.oDistCanvas.width, this.oDistCanvas.height);

		this.oDistCanvas2 = O876.CanvasFactory.getCanvas();
		this.oDistCanvas2.width = this.oCanvas.width;
		this.oDistCanvas2.height = this.oCanvas.height;
		this.oDistContext2 = this.oDistCanvas2.getContext('2d');
		this.oDistContext2.fillStyle = 'rgb(0, 0, 0)';
		this.oDistContext2.fillRect(0, 0, this.oDistCanvas2.width, this.oDistCanvas2.height);

		this.nTime = 0;
		this.bOver = false;
		this.y = [0, 0, 0];
	},

	isOver: function() {
		return this.bOver;
	},

	process: function() {
		this.nTime++;
	},

	render: function() {
		this.buildDistortion();
		this.oContext.drawImage(this.oDistCanvas2, 0, 0);
	},

	done: function() {
		this.oDistCanvas = null;
		this.oDistCanvas2 = null;
	},
	
	terminate: function() {
		this.bOver = true;
	},

	buildDistortion: function() {
		//this.oDistContext.drawImage(this.oCanvas, 0, 0);
		//this.oDistContext.fillStyle = 'red';
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		var h2 = h >> 1;
		var h4 = h >> 2;
		var h16 = h >> 5;
		var y = [
			h16 * Math.sin(MathTools.toRad(this.nTime * 8)) + h4 - h16 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 10)) + h2 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 6)) + h2 + h4 + h16 | 0
		];
		this.oDistContext.drawImage(this.oCanvas, 0, 0, w, h4, 0, 0, w, y[0]);
		this.oDistContext.drawImage(this.oCanvas, 0, h4, w, h4, 0, y[0], w, y[1] - y[0]);
		this.oDistContext.drawImage(this.oCanvas, 0, h2, w, h4, 0, y[1], w, y[2] - y[1]);
		this.oDistContext.drawImage(this.oCanvas, 0, h2 + h4, w, h4, 0, y[2], w, h - y[2]);
		
		h2 = w >> 1;
		h4 = w >> 2;
		h16 = w >> 5;
		y = [
			h16 * Math.sin(MathTools.toRad(this.nTime * 7)) + h4 - h16 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 9)) + h2 | 0,
			h16 * Math.sin(MathTools.toRad(this.nTime * 5)) + h2 + h4 + h16 | 0
		];
		this.oDistContext2.drawImage(this.oDistCanvas, 0, 0, h4, h, 0, 0, y[0], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h4, 0, h4, h, y[0], 0, y[1] - y[0], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h2, 0, h4, h, y[1], 0, y[2] - y[1], h);
		this.oDistContext2.drawImage(this.oDistCanvas, h2 + h4, 0, h4, h, y[2], 0, w - y[2], h);
	}
});

O2.createClass('MW.HowToPlay', {
	nPage: 0,
	aPages: null,
	aButton: null,
	
	display: function(n) {
		if (n <= 0) {
			this.aButtons[0].disabled = 'disabled';
		} else {
			this.aButtons[0].disabled = '';
		}
		if (n >= (this.aPages.length - 1)) {
			this.aButtons[1].disabled = 'disabled';
		} else {
			this.aButtons[1].disabled = '';
		}
		this.nPage = Math.max(0, Math.min(this.aPages.length, n));
		XHR.get(this.aPages[this.nPage], this.oPage);
	},
	
	next: function() {
		this.display(this.nPage + 1);
	},

	prev: function() {
		this.display(this.nPage - 1);
	},

	run: function() {
		var w = 512, h = 480;
		MW.Microsyte.open('How to play', 512, 480);
		var oButtonBar = MW.Microsyte.oMicrosyte.linkDiv('<button type="button">◀ Previous</button> <button type="button">▶ Next</button> <button type="button">✖ Close</button>', 0, 0);
		oButtonBar.style.right = '16px';
		oButtonBar.style.bottom = '16px';
		oButtonBar.style.left = '';
		oButtonBar.style.top = '';
		this.aButtons = oButtonBar.getElementsByTagName('button');
		this.aButtons[0].addEventListener('click', this.prev.bind(this));
		this.aButtons[1].addEventListener('click', this.next.bind(this));
		this.aButtons[2].addEventListener('click', MW.Microsyte.close);
		this.oPage = MW.Microsyte.oMicrosyte.linkDiv('', 24, 40, 512 - 24 - 8);
		this.aPages = [
			'resources/pages/index.html',
			'resources/pages/man-controls.html',
			'resources/pages/man-controls-adv.html',
			'resources/pages/man-spacebar.html',
			'resources/pages/man-alchemy.html',
			'resources/pages/man-end.html'
		];
		this.display(0);
	}
});

O2.createObject('MW.Microsyte', {
	oMicrosyte: null,
	bOpen: false,

	/**
	 * Ouverture d'une fenetre
	 * @param string sTitle titre de la fenetre
	 * @param int w largeur de la fenetre en pixels
	 * @param int h hauteur de la fenetre en pixels
	 */
	open: function(sTitle, w, h) {
		if (MW.Microsyte.bOpen) {
			MW.Microsyte.close();
		}
		if ('G' in window) {
			G._getKeyboardDevice().unplugEvents();
		}
		MW.Microsyte.oMicrosyte = new O876.Microsyte('page');
		MW.Microsyte.bOpen = true;
		var m = MW.Microsyte.oMicrosyte;
		m.setSize(w, h);
		m.center();
		m.clear();
		m.show();
		var oTitle = m.linkDiv(sTitle, 4, 4, w - 2);
		oTitle.className = 'title';
	},
	
	/**
	 * Fermeture de la fenetre actuellement ouverte
	 * (et replug des event keaybord)
	 */
	close: function() {
		var m = MW.Microsyte.oMicrosyte;
		m.clear();
		m.hide();
		MW.Microsyte.bOpen = false;
		if ('G' in window) {
			G._getKeyboardDevice().plugEvents();
		}
	},
	
	
	/**
	 * Ouverture de la ligne de saisie du chat
	 */
	openChatForm: function() {
		MW.Microsyte.open('Message', 512, 64);
		var m = MW.Microsyte.oMicrosyte;
		m.linkDiv('<input id="edit_message" style="width: 100%;" />', 24, 40, 512 - 24 - 24);
		var oMsg = document.getElementById('edit_message');
		oMsg.focus();
		oMsg.onkeypress = MW.Microsyte.sendMessage;
		oMsg.onblur = MW.Microsyte.close;
	},
	
	/**
	 * Cette form intervient lorsque le jeu s'acheve
	 * Elle permet d'afficher des information de fin de partie
	 * @param string sTitle titre à afficher
	 * @param string sContent contenu html
	 */
	openInfoForm: function(sTitle, sContent) {
		MW.Microsyte.open(sTitle, 512, 400);
		var m = MW.Microsyte.oMicrosyte;
		m.linkDiv(sContent, 24, 40, 512 - 24 - 8);
	},
	
	/**
	 * Envoie d'un message de chat
	 * Lorsque la fenetre de ligne de saisie de chat est ouverte c'est cet event qui est déclenché quand
	 * on saisi une ligne de texte
	 * @param oEvent evenement javascript en réponse à une touche pressée
	 */
	sendMessage: function(oEvent) {
		if (oEvent.keyCode === 13) {
			var oMsg = document.getElementById('edit_message');
			G.sendChatMessage(oMsg.value);
			MW.Microsyte.close();
			return false;
		}
	}
});

/**
 * Les plugin sont des objet géré par un médiateur
 * Chaque plugin peut s'abonner à divers évènements déclenché par
 * l'application (le jeu)
 * 
 * startgame : déclenché au début du jeu une fois que le client s'est
 * 		connecté
 * 
 * render : déclenché à chaque frame affichée
 * 
 * 
 * ui_dialog : le jeu réclame l'affichage d'un dialogue, ce message dispose
 * 		de param_tre comme le titre, le message et la liste des bouttons
 * 		et les fonction callback associé a leur dé"clenchement
 */
O2.extendClass('MW.Plugin', O876.Mediator.Plugin, {
	oGame: null,
	
	setMediator: function(m) {
		__inherited(m);
		this.oGame = m.getApplication();
	}
});

O2.extendClass('MW.DialogPlugin', MW.Plugin, {
	getName: function() {
		return 'dialog';
	},
	
	init: function() {
		this.register('ui_dialog');
	},

	ui_dialog: function(sTitle, sMessage, oCmds) {
		var w = new UI.DialogWindow({
			title: sTitle, 
			message: sMessage, 
			buttons: oCmds
		});
		this.oGame.sendSignal('ui_open', w);
	},
});

O2.extendClass('MW.HUDPlugin', MW.Plugin, {

	oHUD: null,
	
	oData: {
		life: ['MW.HUDLifeBar', 4, -4, 50, 12],
		charge: ['MW.HUDChargeBar', null, -4, 50, 12],
		//scores: ['MW.HUDScores', -2, 2, 96, 128],
		crosshair: ['MW.HUDCrosshair', null, null, 16, 16],
		target: ['MW.HUDTarget', null, 64, 192, 24],
		chat: ['MW.HUDChat', 4, -20, '50%', '25%'],
		//avatar: ['MW.HUDImage', -4, -4, 32, 32],
		spells: ['MW.HUDSpellSelector', -40, -4, (6 + 2) * 16 - 4, 64],
		//ping: ['MW.HUDPing', -100, 2, 32, 32],
		attributes: ['MW.HUDIconPad', 60, -2, 128, 16]
	},
	
	oIndex: null,

	oClassLoader: null,

	getName: function() {
		return 'HUD';
	},
	
	centerElement: function(oElement) {
		var c = this.oHUD.getCanvas();
		var e = oElement.slice(0);
		if (e[1] === null) {
			e[1] = (c.width - e[3]) >> 1;
		}
		if (e[2] === null) {
			e[2] = (c.height - e[4]) >> 1;
		}
		var r, v;
		if (typeof e[1] === 'string') {
			r = e[1].match(/^(-?[0-9]+)%$/);
			if (r) {
				v = r[1] | 0;
				e[1] = v * c.width / 100 | 0;
			}
		}
		if (typeof e[2] === 'string') {
			r = e[2].match(/^(-?[0-9]+)%$/);
			if (r) {
				v = r[1] | 0;
				e[2] = v * c.height / 100 | 0;
			}
		}
		return e;
	},
	
	activateElement: function(sElement) {
		var d, p;
		d = this.oData[sElement];
		p = this.oClassLoader.loadClass(d[0]);
		d = this.centerElement(d);
		var oElement = new p();
		oElement._sClass = sElement;
		oElement.oGame = this.oGame;
		this.oHUD.addNewElement(oElement, sElement, d[1], d[2], d[3], d[4]);
		this.oIndex[sElement] = oElement; 
		oElement.init();
	},
	
	addElementData: function(sID, d) {
		this.oData[sID] = d;
	},
	
	init: function() {
		this.oClassLoader = new O876.ClassLoader();
		this.oIndex = {};
		this.oHUD = new UI.HUD();
		var c = document.getElementById(CONFIG.raycaster.canvas);
		this.oHUD.setCanvas(c);
		
		// plugin optionels
		var sId = '';
		var p, aHUDData, sRsc;
		for (sId in MW.PLUGINS_DATA) {
			p = MW.PLUGINS_DATA[sId];
			// création constante HUDE
			sRsc = '';
			// déclaration des tiles
			for (sRsc in p.tiles) {
				MW.TILES_DATA[sRsc] = p.tiles[sRsc]; 
			}
			// Déclaration dans HUDPlugin			
			aHUDData = [p.className, p.hud.x, p.hud.y, p.hud.width, p.hud.height];
			this.addElementData(sId, aHUDData);
		}
		
		for (var sID in this.oData) {
			this.activateElement(sID);
		}
		this.register('enterlevel');
		this.register('exitlevel');
		this.register('key');
		this.register('hud_update');
		this.register('ui_resize');
	},
	
	enterlevel: function() {
		this.register('render');
		// crosshair
		this.update('crosshair');
		
		// chargebar
		this.update('charge', 0, 1);

		// life
		this.update('life', 0, 1);
		
		// avatar
		var ld = this.oGame.oLoginData;
		if (ld && ('avatar' in ld)) {
			this.update('avatar', ld.avatar);
		}
		
		var oSpells = this.getElement('spells');
		oSpells.oImage = this.oGame.oRaycaster.oHorde.oTiles.i_icons32.oImage;
		// charger les icones
		var sIcon = '', iIcon = 0;
		for (sIcon in MW.ICONS) {
			oSpells.update_declare(iIcon, MW.ICONS[sIcon], sIcon, STRINGS._('~itm_' + sIcon));
			++iIcon;
		}
		oSpells.update_display(-1);
	},

	exitlevel: function() {
		this.unregister('render');
	},
	
	
	update: function(sElement) {
		var e = this.getElement(sElement);
		if (e) {
			var aArgs = Array.prototype.slice.call(arguments, 1);
			e.update.apply(e, aArgs);
		}		
	},
	
	getElement: function(sElement) {
		return this.oHUD.getElement(sElement);
	},
	
	render: function() {
		// informations vivaces
		/** @TODO achanger bientôt : le moyen de mettre à jour les HUDE vivace */ 
		var oMob = this.oGame.getFirstMobInSight();
		var sMobName = '';
		if (oMob) {
			sMobName = oMob.getData('name');
		}
		this.hud_update('target', sMobName);
		this.hud_update('chat', null, this.oGame.getTime());
		this.hud_update('spells', null, 'time', this.oGame.getTime());
		this.oHUD.render();
	},
	
	key: function(oKey) {
		var k = oKey.k, p;
		for (var idElement in this.oIndex) {
			p = this.oIndex[idElement];
			if ('keyPress' in p) {
				p.keyPress(k);
			}
		}
	},

	hud_update: function(idElement) {
		var e = this.oIndex[idElement];
		if (e) {
			var aArgs = Array.prototype.slice.call(arguments, 1);
			e.update.apply(e, aArgs);
		}
	},
	
	/**
	 * Recomputes the position and the size of all HUD elements.
	 */
	ui_resize: function() {
		var oElement, d;
		for (var sElement in this.oIndex) {
			oElement = this.oIndex[sElement];
			d = this.centerElement(this.oData[sElement]);
			this.oHUD.addNewElement(oElement, sElement, d[1], d[2], d[3], d[4]);
			oElement.redraw();
		}
	}
});

O2.extendClass('MW.PopupPlugin', MW.Plugin, {

	aPopupMessages: null,
	
	nIconSize: 32,
	

	getName: function() {
		return 'Popup';
	},
	
	init: function() {
		// popups
		this.aPopupMessages = [];
		this.aPopupMessages.__currentMessage = null;
		this.register('render');
		this.register('popup');
	},
	
	render: function() {
		// Gestion des popups
		var r = this.oGame.oRaycaster;
		if (this.aPopupMessages.__currentMessage) {
			if (this.aPopupMessages.__currentMessage.isOver()) {
				this.aPopupMessages.__currentMessage = this.aPopupMessages.shift();
				if (this.aPopupMessages.__currentMessage) {
					r.oEffects.addEffect(this.aPopupMessages.__currentMessage);
					if ('__sound' in this.aPopupMessages.__currentMessage) {
						this.oGame.playSound(this.aPopupMessages.__currentMessage.__sound);
					}
				}
			}
		} else {
			this.aPopupMessages.__currentMessage = this.aPopupMessages.shift();
			if (this.aPopupMessages.__currentMessage) {
				r.oEffects.addEffect(this.aPopupMessages.__currentMessage);
				if ('__sound' in this.aPopupMessages.__currentMessage) {
					this.oGame.playSound(this.aPopupMessages.__currentMessage.__sound);
				}
			}
		}
	},
	
	popup: function(sMessage, nIcon, sTile, sSound) {
		// Y a t il déja eu un message comme ca récemment ?
		var r = this.oGame.oRaycaster;
		if (!r) {
			return;
		}
		if (this.aPopupMessages.length &&
				(this.aPopupMessages.some(function(m) { return m.sMessage == sMessage; })) && 
				!this.aPopupMessages[this.aPopupMessages.length - 1].isOver()) {
			// On spamme le message ... pas de new message
			return;
		}
		var oGX = new MW.GXMessage(r);
		this.aPopupMessages.push(oGX);
		oGX.setMessage(sMessage);
		oGX.nTime /= 1 + (this.aPopupMessages.length * 0.66);
		oGX.nTime |= 0;
		oGX.yPos = oGX.yTo - 16;
		oGX.buildPath();
		if (nIcon !== undefined) {
			sTile = sTile || 'i_icons32';
			var oIcons = r.oHorde.oTiles[sTile]; 
			oGX.setIcon(oIcons.oImage, nIcon * this.nIconSize, 0, this.nIconSize, this.nIconSize);
		}
		if (sSound !== undefined) {
			oGX.__sound = sSound;
		}
	}
	
});

/**
 * Plugin d'interface graphique
 */

O2.extendClass('MW.UIPlugin', MW.Plugin, {
	oSystem: null,
	oCanvas: null,
	bOpen: false,
	
	getName: function() {
		return 'UI';
	},
	
	init: function() {
		this.oSystem = new UI.System();
		this.oSystem.setRenderCanvas(this.oCanvas = document.getElementById(CONFIG.raycaster.canvas));
		this.register('ui_open');
		this.register('ui_close');
		this.register('ui_switch');
		this.register('ui_resize');
	},

	render: function() {
		this.oSystem.render();
	},
	
	
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	
	/**
	 * Ouverture de l'interface graphique
	 */
	ui_open: function(w) {
		if (w) {
			this.oSystem.declareWidget(w);
			this.oSystem.centerWidget(w);
		}
		if (this.bOpen) {
			return;
		}
		this.bOpen = true;
		if (this.oGame.getPlayer() && this.oGame.getPlayer().oThinker) {
			// désactivation du thinker de camera
			this.oGame.setPlayerControllable(false);
			// sortie du mode pointerlock
			O876_Raycaster.PointerLock.exitPointerLock();
			O876_Raycaster.PointerLock.bEnabled = false;
		}
		// activation des évènements UI et du système de rendu
		this.oSystem.listenToMouseEvents(this.oCanvas);
		this.register('render');
	},
	
	/**
	 * Fermeture de l'interface graphique
	 */
	ui_close: function() {
		if (!this.bOpen) {
			return;
		}
		this.bOpen = false;
		if (this.oGame.getPlayer() && this.oGame.getPlayer().oThinker) {
			// réactivation du thinker de camera
			this.oGame.setPlayerControllable(true);
			// retour au mode pointerlock
			O876_Raycaster.PointerLock.bEnabled = true;
			O876_Raycaster.PointerLock.requestPointerLock(document.getElementById(CONFIG.raycaster.canvas));
		}
		// désactivation des évènements UI et du système de rendu
		this.oSystem.deafToMouseEvents(this.oCanvas);
		this.unregister('render');
	},
	
	/**
	 * Fermeture / Ouverture de l'interface graphique
	 */
	ui_switch: function() {
		if (this.bOpen) {
			this.ui_close();
		} else {
			this.ui_open();
		}
	},

	ui_resize: function() {
		this.oSystem.setRenderCanvas(this.oCanvas);
	}

});

O2.extendClass('MW.TimedThinker', O876_Raycaster.Thinker, {
	nTimeOut: 0,
	  
	start: function() {
		var a = this.oMobile.oSprite.oAnimation;
		if (!a) throw new Error('bordel de merde');
		t = a.nDuration * a.nCount;
		this.nTimeOut = this.oGame.getTime() + t;
		this.think = this.thinkAlive;
	},
	
	thinkAlive: function() {
		if (this.oGame.getTime() > this.nTimeOut) {
			this.think = this.thinkDead;
		}
	},
	
	thinkDead: function() {
		this.oMobile.gotoLimbo();
		this.oMobile.bActive = false;
	}
});


O2.createClass('UI.HUD', {
	oClientCanvas: null,	// canvas final
	oClientContext: null,
	
	oElements: null,
	
	setCanvas: function(c) {
		this.oClientCanvas = c;
		this.oClientContext = c.getContext('2d');
	},
	
	getCanvas: function() {
		return this.oClientCanvas;
	},
	
	addNewElement: function(e, sId, x, y, w, h) {
		if (!this.oElements) {
			this.oElements = {};
		}
		e.setCanvas(this.oClientCanvas);
		var r;
		if (typeof w == 'string') {
			r = w.match(/^(-?[0-9]+)%$/);
			if (r) {
				w = this.oClientCanvas.width * (r[1] | 0) / 100 | 0;
			}
		}
		if (typeof h == 'string') {
			r = h.match(/^(-?[0-9]+)%$/);
			if (r) {
				h = this.oClientCanvas.height * (r[1] | 0) / 100 | 0;
			}
		}
		e.setSize(w, h); 
		e.moveTo(x, y);
		this.oElements[sId] = e;
		return e;
	},
	
	getElement: function(sId) {
		return this.oElements[sId];
	},
	
	render: function() {
		var sId = '';
		for (sId in this.oElements) {
			this.oElements[sId].render();
		}
	}
});

O2.createClass('UI.HUDElement', {
	oCanvas: null,
	oContext: null,
	oClientCanvas: null,
	oClientContext: null,
	x: 0,
	y: 0,
	fAlpha: 1,
	oGame: null,
	
	getTile: function(sTile) {
		return this.oGame.oRaycaster.oHorde.oTiles[sTile].oImage;
	},
	
	setSize: function(w, h) {
		this.oCanvas = O876.CanvasFactory.getCanvas();
		this.oCanvas.width = w;
		this.oCanvas.height = h;
		this.oContext = this.oCanvas.getContext('2d');
	},
	
	setCanvas: function(c) {
		this.oClientCanvas = c;
		this.oClientContext = c.getContext('2d');
	},
	
	moveTo: function(x, y) {
		if (x < 0) {
			x = this.oClientCanvas.width - this.oCanvas.width + x;
		}
		if (y < 0) {
			y = this.oClientCanvas.height - this.oCanvas.height + y;
		}
		this.x = x;
		this.y = y;
	},
	
	getContext: function() {
		return this.oContext;
	},
	
	init: function() {
		
	},
	
	redraw: function() {
	},
	
	update: function() {
	},
	
	render: function() {
		if (this.fAlpha > 0) {
			if (this.fAlpha >= 1) {
				this.oClientContext.drawImage(this.oCanvas, this.x, this.y);
			} else {
				var g = this.oClientContext.globalAlpha;
				this.oClientContext.globalAlpha = this.fAlpha;
				this.oClientContext.drawImage(this.oCanvas, this.x, this.y);
				this.oClientContext.globalAlpha = g;
			}
		}
	},
});

/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * Icon : icone munie d'un compteur de stack.
 */

O2.extendClass('UI.Icon', H5UI.WinControl, {
	_sClass: 'UI.Icon',
	
	oImage: null,
	xStart: 0,
	yStart: 0,
	fZoom: 1,
	_bSelected: false,
	_bRedCross: false,
	
	setImage: function(oImage) {
		this.oImage = oImage;
		this.invalidate();
	},
	
	selected: function(b) {
		this._set('_bSelected', b);
	},
	
	drawImage: function() {
		this._oContext.drawImage(
			this.oImage, 
			this.xStart, 
			this.yStart, 
			this._nWidth, 
			this._nHeight, 
			0, 
			0, 
			this._nWidth * this.fZoom | 0, 
			this._nHeight * this.fZoom | 0
		);
	},
	
	
	setStackCounter: function(n) {
		var bStackable = n >= 1;
		var bHasCounter = this.getControlCount() > 0;
		var nMask = (bStackable ? 2 : 0) | (bHasCounter ? 1 : 0);
		var oBoxStackCounter;
		switch (nMask) {
			case 0: 
				break;
				
			case 1:
				this.clear();
				break;
				
			case 2:
				oBoxStackCounter = this.linkControl(new H5UI.Text());
				oBoxStackCounter.font.setFont('monospace');
				oBoxStackCounter.font.setSize(16);
				oBoxStackCounter.font.setStyle('bold');
				oBoxStackCounter.font.setColor('rgb(255, 255, 255)', 'rgb(0, 0, 0)');
				oBoxStackCounter.moveTo(4, 30); /* no break here */
				// pas de break pour pouvoir modifier le compteur
				
			case 3:			
				oBoxStackCounter = this.getControl(0);
				oBoxStackCounter.setCaption(n);
				oBoxStackCounter.render();
				break;
		}
	},

	
	
	renderSelf: function() {
		var c = this._oContext; 
		var w = this.getWidth();
		var h = this.getHeight();
		c.clearRect(0, 0, this.getWidth(), this.getHeight());
		this.drawImage();
		if (this._bSelected) {
			var sGCO = c.globalCompositeOperation;
			var fGA = c.globalAlpha;
			c.globalCompositeOperation = 'lighter';
			c.globalAlpha = 0.5;
			this.drawImage();
			c.globalCompositeOperation = sGCO;
			c.globalAlpha = fGA;
			c.strokeStyle = UI.clSELECT_BORDER;
			c.lineWidth = 4;
			c.strokeRect(0, 0, w, h);
		}
		if (this._bRedCross) {
			var w4 = w >> 3;
			var h4 = h >> 3;
			var w3 = w - w4;
			var h3 = h - h4;
			c.strokeStyle = '#FF0000',
			c.lineWidth = 4;
			c.beginPath();
			c.moveTo(w4, h4);
			c.lineTo(w3, h3);
			c.stroke();
			c.beginPath();
			c.moveTo(w3, h4);
			c.lineTo(w4, h3);
			c.stroke();
		}
	}
});


/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * Ecran d'affichage de l'interface graphique.
 * Cet écran accueille tout les autres widget de l'interface
 * Sa taille correspond aux dimension max de la zone d'affichage.
 * Il est muni d'un fond translucide
 */
O2.extendClass('UI.Screen', H5UI.WinControl, {
	_sClass: 'UI.Screen',
	fAlpha: 0.333,
	
	renderSelf: function() {
		this._oContext.clearRect(0, 0, this._nWidth, this._nHeight);
		if (this.fAlpha > 0) {
			this._oContext.fillStyle = 'rgba(0, 0, 0, ' + this.fAlpha.toString() + ')';
			this._oContext.fillRect(0, 0, this._nWidth, this._nHeight);
		}
	}
});

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

	__construct : function() {
		this.oScreen = new UI.Screen();
		this.oScreen .hide();
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

	eventScreenClick : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('Click', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenDblClick : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('Dblclick', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseMove : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseMove', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseDown : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseDown', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenMouseUp : function(e) {
		var oThis = this.__this;
		var x = e.offsetX || e.clientX - this.__x;
		var y = e.offsetY || e.clientY - this.__y;
		x = x / this.__ratio | 0;
		y = y / this.__ratio | 0;
		oThis.doMouseEvent('MouseUp', x - oThis._x, y - oThis._y, e.which);
	},

	eventScreenDOMMouseScroll : function(e) {
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
			oThis.doMouseEvent('MouseWheelUp', x - oThis._x, y - oThis._y, e.which);
		} else {
			oThis.doMouseEvent('MouseWheelDown', x - oThis._x, y - oThis._y, e.which);
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

/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 */
O2.createObject('UI', {
	clWINDOW: '#999',
	clWINDOW_BORDER: '#000',
	clDARK_WINDOW: '#666',
	clFONT: '#000',
	clBAR: 'vgrad #03B #06F #03B',
	clSELECT_BORDER: '#00D',
	clSELECT_WINDOW: '#88F',
	
	INV_ICON_SIZE: 48,
	ALT_ICON_SIZE: 48
});


function checkLogin(sLogin) {
	// checking login name
	if (sLogin.length < 2) {
		return false;
	} else {
		return true;
	}
}	


function startGame(sLogin) {
	screenResize();
	window.addEventListener('resize', screenResize, true);
	var g = new MW.Game();
	window.G = g;
	

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	} else {
		document.getElementById('info').innerHTML = 'No PointerLock AP available on this browser';
	}
	
	g.csLogin(sLogin);
}

/**
 * Entre en mode pointerlock
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer(oElement) {
	if (!G.oRaycaster.oCamera || !G.oRaycaster.oCamera.oThinker) {
		return false;
	}
	if (O876_Raycaster.PointerLock.locked()) {
		return false;
	}
	if (CONFIG.game.fullscreen) {
		O876_Raycaster.FullScreen.changeEvent = function() {
			if (O876_Raycaster.FullScreen.isFullScreen()) {
				O876_Raycaster.PointerLock.requestPointerLock(oElement);
				O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
			}
		};
		O876_Raycaster.FullScreen.enter(oElement);
	} else {
		O876_Raycaster.PointerLock.requestPointerLock(oElement);
		O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
	}
	return true;
}



/**
 * Calcule la position d'un élément par rapport au coin superieur gauche de la fenêtre du navigateur
 * Cette fonction n'existe pas sur firefox.
 * @param oElement élément dont on cherche la position
 * @return array of int
 */
function getElementPos(oElement) {
	return UI.System.prototype.getElementPos(oElement);
}

function screenResize(oEvent) {
	var nPadding = 24;
	var h = innerHeight;
	var w = innerWidth;
	var r = (h - nPadding) / w;
	var oCanvas = document.getElementById(CONFIG.raycaster.canvas);
	var xy = getElementPos(oCanvas);
	oCanvas.__x = xy[0];
	oCanvas.__y = xy[1];
	oCanvas.__mozMaximizeCheck = true;
	var rBase = oCanvas.height / oCanvas.width; 
	if (r < rBase) { // utiliser height
		h -= nPadding;
		oCanvas.style.width = '';
		oCanvas.style.height = h.toString() + 'px';
		oCanvas.__ratio = h / oCanvas.height;		
	} else { // utiliser width
		oCanvas.style.width = w.toString() + 'px';
		oCanvas.style.height = '';
		oCanvas.__ratio = w / oCanvas.width;		
	}
}

function howToPlay() {
	var htp = new MW.HowToPlay();
	htp.run();
}

function loginForm() {
	XHR.get('/mwstatus/', document.getElementById('status'));
	var oNickname = document.getElementById('nickname');
	var oConnect = document.getElementById('connect');
	var oLogo = document.getElementById('logo');
	var oLogin = document.getElementById('login');
	var oScreen = document.getElementById('screen');
	var oError = document.getElementById('error');
	// options section
	// getting all option stuff
	var oOpt = { 
		sw: document.getElementById('options_switch'),
		sw_val: false,
		opt: document.getElementById('options'),
		hires: document.getElementById('opt_hires')
	};
	// clicking on "show options" will toggle display
	oOpt.sw.addEventListener('click', function(oEvent) {
		oOpt.opt.style.display = oOpt.sw_val ? 'none' : 'block';
		oOpt.sw.innerHTML = oOpt.sw_val ? 'Show options' : 'Hide options';
		oOpt.sw_val = !oOpt.sw_val;
	});
	
	// "how to play" section
	// clicking on how to play will display a small window
	document.getElementById('htp_switch').addEventListener('click', howToPlay);
	
	var doLogin = function() {
		var sLogin = oNickname.value;
		if (!checkLogin(sLogin)) {
			oError.innerHTML = 'Invalid nickname.';
			return;
		}
		oLogo.style.display = 'none';
		oLogin.style.display = 'none';
		if (oOpt.hires && oOpt.hires.checked) {
			oScreen.width = 800;
			oScreen.height = 500;
		}
		oScreen.style.display = '';
		startGame(sLogin);
	};
	oScreen.style.display = 'none';
	oNickname.addEventListener('keypress', function(oEvent) {
		oError.innerHTML = '&nbsp;';
		if (oEvent.keyCode == 13) {
			doLogin();
		}
	});
	oConnect.addEventListener('click', doLogin);
	oNickname.focus();
}


function main() {
	loginForm();
}

window.addEventListener('load', main);

O2.extendClass('H5UI.Box', H5UI.WinControl, {
	_sClass : 'Box',
	_sColor : '#FFFFFF',
	_sColorOutside : '#FF6666',
	_sColorInside : '#FFBBBB',
	_sColorBorder : '#000000',
	_sColorBorderOutside : '#000000',
	_sColorBorderInside : '#000000',
	_nBorderWidth : 8,

	_xGradStart : 0,
	_yGradStart : 0,
	_xGradEnd : 0,
	_yGradEnd : 0,
	_nGradOrientation : 0,
	

	setColor : function(sNormal, sHighlight) {
		if (sHighlight === undefined) {
			sHighlight = sNormal;
		}
		this._sColorInside = sHighlight;
		this._set('_sColor', this._sColorOutside = sNormal);
	},

	setBorder : function(n, sOut, sIn) {
		if (sOut === undefined) {
			sOut = '#000000';
		}
		if (sIn === undefined) {
			sIn = sOut;
		}
		if (n) {
			this._set('_sColorBorderOutside', sOut);
			this._set('_sColorBorderInside', sIn);
			this._set('_sColorBorder', sOut);
		}
		this._set('_nBorderWidth', n);
	},

	onMouseIn : function(x, y, b) {
		this._set('_sColorBorder', this._sColorBorderInside);
		this._set('_sColor', this._sColorInside);
	},

	onMouseOut : function(x, y, b) {
		this._set('_sColorBorder', this._sColorBorderOutside);
		this._set('_sColor', this._sColorOutside);
	},

	computeGradientOrientation : function() {
		switch (this._nGradOrientation) {
		case 1: // Vertical
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.getHeight() - 1;
			break;

		case 2: // Horiz
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.getWidth() - 1;
			this._yGradEnd = 0;
			break;
	
		case 3: // Diag 1
			this._xGradStart = 0;
			this._yGradStart = 0;
			this._xGradEnd = this.getWidth() - 1;
			this._yGradEnd = this.getHeight() - 1;
			break;
	
		case 4: // Diag 2
			this._xGradStart = this.getWidth() - 1;
			this._yGradStart = 0;
			this._xGradEnd = 0;
			this._yGradEnd = this.getHeight() - 1;
			break;
		}
	},

	getFillStyle : function() {
		var s = this.getSurface();
		var aGrad = this._sColor.split(' ');
		var xFillStyle;
		if (aGrad.length === 1) {
			xFillStyle = this._sColor;
		} else {
			// Le gradient contient il un mot clé permettant d'influencer le
			// type de gradient ?
			switch (aGrad[0]) {
				case 'hgrad':
					this._nGradOrientation = 2;
					break;
	
				case 'vgrad':
					this._nGradOrientation = 1;
					break;
	
				case 'd1grad':
					this._nGradOrientation = 3;
					break;
	
				case 'd2grad':
					this._nGradOrientation = 4;
					break;
	
				default:
					this._nGradOrientation = 0;
					break;
			}
			if (this._nGradOrientation) {
				aGrad.shift();
			}
			this.computeGradientOrientation();
			var oGrad = s.createLinearGradient(this._xGradStart, this._yGradStart,
					this._xGradEnd, this._yGradEnd);
			for ( var iGrad = 0; iGrad < aGrad.length; iGrad++) {
				oGrad.addColorStop(iGrad / (aGrad.length - 1), aGrad[iGrad]);
			}
			xFillStyle = oGrad;
		}
		return xFillStyle;
	},

	renderSelf : function() {
		this._oContext.fillStyle = this.getFillStyle();
		this._oContext.fillRect(0, 0, this.getWidth(), this.getHeight());
		if (this._nBorderWidth) {
			this._oContext.strokeStyle = this._sColorBorder;
			this._oContext.lineWidth = this._nBorderWidth;
			this._oContext.strokeRect(0, 0, this.getWidth(), this.getHeight());
		}
	}
});

/**
 * Ce composant est un bouton cliquable avec un caption de texte Le bouton
 * change de couleur lorsque la souris passe dessus Et il possède 2 état
 * (normal/surbrillance)
 */
O2.extendClass('H5UI.Button', H5UI.Box, {
	oText : null,
	_sColorNormal : '#999',
	_sColorOver : '#BBB',
	_sColorSelect : '#DDD',
	_sColorBorder : '#000',

	__construct : function() {
		__inherited();
		this.setSize(64, 24);
		this.setColor(this._sColorNormal, this._sColorOver);
		this.setBorder(1, this._sColorBorder);
		this.oText = this.linkControl(new H5UI.Text());
		this.oText.font.setFont('Arial');
		this.oText.font.setSize(12);
		this.oText.font.setColor('#000');
		this.oText.moveTo(4, 4);
		this.oText.setCaption('Button');
		this.oText.align('center');
	},

	setCaption : function(sCaption) {
		this.oText.setCaption(sCaption);
		this.realignControls();
	},

	getCaption : function() {
		return this.oText._sCaption;
	},

	highlight : function(b) {
		if (b) {
			this.setColor(this._sColorSelect, this._sColorOver);
		} else {
			this.setColor(this._sColorNormal, this._sColorOver);
		}
	}
});

O2.extendClass('H5UI.Image', H5UI.WinControl, {
	_oTexture: null,
	_bAutosize: true,
	onLoad: null,
	
	_loadEvent: function(oEvent) {
		var i = oEvent.target.__image;
		oEvent.target.__image = null;
		if (i.onLoad) {
			i.onLoad();
		} else {
			i.invalidate();
		}
	},
	
	setSource: function(sSrc) {
		if (!this._oTexture) {
			this._oTexture = new Image();
		}
		this._oTexture.src = sSrc;
		this._oTexture.__image = this;
		this._oTexture.addEventListener('load', this._loadEvent, true);
		this.invalidate();
	},
	
	setImage: function(oImage) {
		if (this._oTexture != oImage) {
			this._oTexture = oImage;
			this._oTexture.__image = this;
			this._oTexture.addEventListener('load', this._loadEvent, true);
			this.invalidate();
		}
	},
	
	
	renderSelf: function() {
		var s = this.getSurface();
		if (this._oTexture && this._oTexture.complete) {
			if (this._bAutosize) {
				this.setSize(this._oTexture.width, this._oTexture.height);
				s.drawImage(this._oTexture,	0, 0);						
			} else {
				s.clearRect(0, 0, this.getWidth(), this.getHeight());
				s.drawImage(
					this._oTexture,
					0, 
					0, 
					this._oTexture.width, 
					this._oTexture.height,
					0, 
					0, 
					this.getWidth(),
					this.getHeight()
				);
			}
		}
	}
});

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
		}
		return o;
	},

	/**
	 * Renvoie l'instance du controleur interne Construit le conteneur interne
	 * on the fly en cas de besoin
	 * 
	 * @return ScrollBoxContainer
	 */
	getContainer : function() {
		if (this._oContainer === null) {
			this._oContainer = this.linkControl(new H5UI.WinControl(), true);
			this._oContainer._sClass = 'ScrollBoxContainer';
		}
		return this._oContainer;
	},

	/**
	 * Déplace la position de scrolling
	 * 
	 * @param x,
	 *            y nouvelle position de scroll
	 */
	scrollTo : function(x, y) {
		if (x != this._xScroll || y != this._yScroll) {
			this._xScroll = x;
			this._yScroll = y;
			this.getContainer().moveTo(-x, -y);
			this.invalidate();
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
			w = Math.max(w, o._x + o.getWidth());
			h = Math.max(h, o._y + o.getHeight());
		}
		c.setSize(w, h);
	}
});


/**
 * Un composant simple qui affiche un texte Penser à redimensionner correctement
 * le controle, sinon le texte sera invisible
 */
O2.extendClass('H5UI.Text', H5UI.WinControl, {
	_sClass : 'Text',
	_sCaption : '',
	_bAutosize : true,
	_bWordWrap: false,
	_nTextWidth: 0,	
	_nLineHeight: 0,
	_yLastWritten: 0,
	

	// propriété publique
	font : null,

	__construct : function() {
		__inherited();
		this.font = new H5UI.Font(this);
	},

	/**
	 * Modification du caption
	 * 
	 * @param s
	 *            nouveau caption
	 */
	setCaption : function(s) {
		this._set('_sCaption', s);
		if (this._bAutosize && this._bInvalid) {
			this.font.update();
			var oMetrics = this.getSurface().measureText(this._sCaption);
			this.setSize(oMetrics.width, this.font._nFontSize + 1);
		}
	},

	/**
	 * Définition du flag autosize quand ce flag est actif, le control prend la
	 * dimension du texte qu'il contient
	 */
	setAutosize : function(b) {
		this._set('_bAutosize', b);
	},

	/**
	 * Définition du flag wordwrap, quand ce flag est actif, la taille est fixe
	 * et le texte passe à la ligne si celui-ci est plus long que la longeur.
	 */
	setWordWrap : function(b) {
		this._set('_bWordWrap', b);
	},

	renderSelf : function() {
		var oSurface = this.getSurface();
		var oMetrics;
		// Redimensionnement du texte
		oSurface.clearRect(0, 0, this.getWidth(), this.getHeight());
		if (this._bWordWrap){
			this.font.update();
			var aWords;
			var sLine = '', sWord, x = 0, y = 0;
			var sSpace;
			oSurface.textBaseline = 'top';
			var aParas = this._sCaption.split('\n');
			for (var iPara = 0; iPara < aParas.length; iPara++) {
				aWords = aParas[iPara].split(' ');
				while (aWords.length) {
					sWord = aWords.shift();
					sSpace = sLine ? ' ' : '';
					oMetrics = oSurface.measureText(sLine + sSpace + sWord);
					if (oMetrics.width >= this.getWidth()) {
						// flush
						x = 0;
						if (this.font._bOutline) {
							oSurface.strokeText(sLine, x, y);
						}		
						oSurface.fillText(sLine, x, y);
						y += this.font._nFontSize + this._nLineHeight;
						sLine = sWord;
					} else {
						sLine += sSpace + sWord;
						x += oMetrics.width;
					}
				}
				x = 0;
				if (this.font._bOutline) {
					oSurface.strokeText(sLine, x, y);
				}		
				oSurface.fillText(sLine, x, y);
				y += this.font._nFontSize + this._nLineHeight;
				sLine = '';
				this._yLastWritten = y;
			}
		} else {
			if (this._bAutosize) {
				this.font.update();
				oMetrics = oSurface.measureText(this._sCaption);
				this.setSize(oMetrics.width, this.font._nFontSize + 1);
			} else {
			}
			oSurface.textBaseline = 'middle';
			if (this.font._bOutline) {
				oSurface.strokeText(this._sCaption, 0, this.getHeight() >> 1);
			}		
			oSurface.fillText(this._sCaption, 0, this.getHeight() >> 1);
		}
	}
});


/**
 * Grille d'image (petites images)
 * 
 */
O2.extendClass('H5UI.TileGrid', H5UI.WinControl, {
	_oTexture : null,
	
	_nCellWidth: 8,
	_nCellHeight: 8,
	_nCellPadding: 0,
	
	_aCells: null,
	_aInvalidCells: null,
	
	_bTransparent: true,  // true: considère les Tile comme transparentes (nécessitant un clearRect)
	
	
	/** Modification de la taille de la grille
	 * @param w int largeur (nombre de cellule en X)
	 * @param h int hauteur (nombre de cellule en Y)
	 */
	setGridSize: function(w, h, nPadding) {
		this._nCellPadding = nPadding | 0;
		this._aCells = [];
		var x, y, aRow;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				aRow.push(-1);
			}
			this._aCells.push(aRow);
		}
		this._aInvalidCells = {};
		var wTotal = (this._nCellWidth + this._nCellPadding) * w;
		var hTotal = (this._nCellHeight + this._nCellPadding) * h;
		this.setSize(wTotal, hTotal);
	},
	
	/** Fabrique une clé à partir des coordonnées transmise
	 * utilisé pour déterminer la liste des case qui ont été modifiées
	 * @param x
	 * @param y coordonnée de la celluel dont on cherche la clé
	 * @return string
	 */
	getCellKey: function(x, y) {
		return x.toString() + ':' + y.toString(); 
	},
	
	
	/** Modifie le code d'une cellule
	 * @param x 
	 * @param y coordonnées de la cellule
	 * @param n nouveau code de la cellule
	 */
	setCell: function(x, y, n) {
		if (this._aCells[y][x] !== n) {
			this._aCells[y][x] = n;
			var sKey = this.getCellKey(x, y);
			if (!(sKey in this._aInvalidCells)) {
				this._aInvalidCells[sKey] = [x, y];
				this.invalidate();
			}
		}
	},
	
	renderCell: function(x, y, n) {
		this.getSurface().drawImage(
			this._oTexture, 
			n * this._nCellWidth, 
			0, 
			this._nCellWidth, 
			this._nCellHeight, 
			x * (this._nCellWidth + this._nCellPadding), 
			y * (this._nCellHeight + this._nCellPadding), 
			this._nCellWidth, 
			this._nCellHeight
		);
	},
	
	renderSelf: function() {
		var h = this._aCells.length; 
		if (h === 0) {
			return;
		}
		var w = this._aCells[0].length;
		if (w === 0) {
			return;
		}
		if (this._nCellWidth * this._nCellHeight === 0) {
			return;
		}
		if (this._oTexture === null) {
			return;
		}
		var oCell, n, x, y;
		var s = this.getSurface();
		var b = false;
		for (var sKeyCell in this._aInvalidCells) {
			b = true;
			oCell = this._aInvalidCells[sKeyCell];
			x = oCell[0];
			y = oCell[1];
			n = this._aCells[y][x];
			if (this._bTransparent) {
				s.clearRect(x * (this._nCellWidth + this._nCellPadding), y * (this._nCellHeight + this._nCellPadding), this._nCellWidth + this._nCellPadding, this._nCellHeight + this._nCellPadding);
			}
			this.renderCell(x, y, n);
		}
		if (b) {
			this._aInvalidCells = {};			
		}
	}
});

O2.extendClass('O876_Raycaster.Engine', O876_Raycaster.Transistate, {
	// Juste une copie du TIME_FACTOR du raycaster
	TIME_FACTOR : 50, // Doit être identique au TIME_FACTOR du raycaster

	oRaycaster : null,
	oKbdDevice : null,
	oMouseDevice : null,
	oThinkerManager : null,
	oObjectIndex : null,
	
	oFrameCounter: null,

	nLastTimeStamp : 0,
	nShadedTiles : 0,
	nShadedTileCount : 0,
	
	__construct : function() {
		__inherited('stateInitialize');
		this.resume();
	},

	initRequestAnimationFrame : function() {
		if ('requestAnimationFrame' in window) {
			return true;
		}
		var RAF = null;
		if ('requestAnimationFrame' in window) {
			RAF = window.requestAnimationFrame;
		} else if ('webkitRequestAnimationFrame' in window) {
			RAF = window.webkitRequestAnimationFrame;
		} else if ('mozRequestAnimationFrame' in window) {
			RAF = window.mozRequestAnimationFrame;
		}
		if (RAF) {
			window.requestAnimationFrame = RAF;
			return true;
		} else {
			return false;
		}
	},
	
	initDoomLoop: function() {
		__inherited();
		this.nLastTimeStamp = Date.now();
	},

	/**
	 * Déclenche un évènement
	 * 
	 * @param sEvent
	 *            nom de l'évènement
	 * @param oParam
	 *            paramètre optionnels à transmettre à l'évènement
	 * @return retour éventuel de la fonction évènement
	 */
	_callGameEvent : function(sEvent) {
		if (sEvent in this && this[sEvent]) {
			var pFunc = this[sEvent];
			var aParams = Array.prototype.slice.call(arguments, 1);
			return pFunc.apply(this, aParams);
		}
		return null;
	},

	/**
	 * Arret du moteur et affichage d'une erreur
	 * 
	 * @param sError
	 *            Message d'erreur
	 */
	_halt : function(sError, oError) {
		if (('console' in window) && ('log' in window.console) && (sError)) {
			console.log(sError);
			if (oError) {
				console.log(oError.toString());
			}
		}
		this.pause();
		this.setDoomloop('stateEnd');
		if (this.oKbdDevice) {
			this.oKbdDevice.unplugEvents();
		}
		if (this.oMouseDevice) {
			this.oMouseDevice.unplugEvents();
		}
	},

	/**
	 * Renvoie une instance du périphérique clavier
	 * 
	 * @return KeyboardDevice
	 */
	_getKeyboardDevice : function() {
		if (this.oKbdDevice === null) {
			this.oKbdDevice = new O876_Raycaster.KeyboardDevice();
			this.oKbdDevice.plugEvents();
		}
		return this.oKbdDevice;
	},

	_getMouseDevice : function(oElement) {
		if (this.oMouseDevice === null) {
			if (oElement === undefined) {
				throw new Error('no target element specified for the mouse device');
			}
			this.oMouseDevice = new O876_Raycaster.MouseDevice();
			this.oMouseDevice.plugEvents(oElement);
		}
		return this.oMouseDevice;
	},
	
	/**
	 * Renvoie le temps actuel en millisecondes
	 * @return int
	 */
	getTime: function() {
		return this.nLastTimeStamp;
	},

	// ////////// METHODES PUBLIQUES API ////////////////

	/**
	 * Charge un nouveau niveau et ralnce la machine. Déclenche l'évènement
	 * onExitLevel avant de changer de niveau. Utiliser cet évènement afin de
	 * sauvegarder les données utiles entre les niveaux.
	 * 
	 * @param sLevel
	 *            référence du niveau à charger
	 */
	enterLevel : function(sLevel) {
		this._callGameEvent('onExitLevel');
		this.setDoomloop('stateStartRaycaster');
	},

	/**
	 * Active un effet d'ouverture de porte ou passage secret sur un block
	 * donné. L'effet d'ouverture inclue la modification temporaire de la
	 * propriété du block permettant ainsi le libre passage des mobiles le temps
	 * d'ouverture (ce comportement est codé dans le GXDoor). Le bloc doit
	 * comporte un code physique correspondant à une porte : Un simple mur (code
	 * 1) ne peut pas faire office de porte
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bStayOpen
	 *            désactive autoclose et garde la porte ouverte
	 * 
	 */
	openDoor : function(x, y, bStayOpen) {
		var nPhys = this.oRaycaster.getMapXYPhysical(x, y);
		var o = null;
		switch (nPhys) {
			case 2: // Raycaster::PHYS_FIRST_DOOR
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8: // Raycaster::PHYS_LAST_DOOR
				if (!Marker.getMarkXY(this.oRaycaster.oDoors, x, y)) {
					o = new O876_Raycaster.GXDoor(this.oRaycaster);
					o.x = x;
					o.y = y;
					if (bStayOpen) {
						o.setAutoClose(0);
					}
					this.oRaycaster.oEffects.addEffect(o);
				}
				break;
	
			case 9: // Raycaster::PHYS_SECRET_BLOCK
				if (!Marker.getMarkXY(this.oRaycaster.oDoors, x, y)) {
					o = new O876_Raycaster.GXSecret(this.oRaycaster);
					o.x = x;
					o.y = y;
					this.oRaycaster.oEffects.addEffect(o);
				}
				break;
		}
		return o;
	},

	/**
	 * Fermeture manuelle d'une porte à la position X Y Utilisé avec les portes
	 * sans autoclose. S'il n'y a pas de porte ouverte en X Y -> aucun effet
	 * 
	 * @param x
	 *            coordonnées du bloc-porte
	 * @param y
	 *            coordonnées du bloc-porte
	 * @param bForce
	 *            force la fermeture même en case de présence de mobile
	 */
	closeDoor : function(x, y, bForce) {
		var oDoor = Marker.getMarkXY(this.oRaycaster.oDoors, x, y);
		if (oDoor) {
			oDoor.setAutoClose(1);
			oDoor.close();
		}
		return oDoor;
	},

	/**
	 * Permet d'indexé un objet, de lui attribuer un identifiant afin de le
	 * retrouver plus facilement plus tard Ceci est utilisé dans le cadre des
	 * parties en réseaux dans lesquelles le serveur tient un registre d'objet
	 * qu'il partage avec ses clients.
	 * 
	 * @param oObject
	 *            objet (généralement mobile)
	 * @param id
	 *            identifiant
	 * @return objet
	 */
	setObjectIndex : function(oObject, id) {
		this.oObjectIndex[id] = oObject;
	},

	/**
	 * Supprime l'index précédemment attribué d'un objet, ne supprime pas
	 * l'objet
	 * 
	 * @param id
	 */
	clearObjectIndex : function(id) {
		delete this.oObjectIndex[id];
	},

	/**
	 * Retrouve un objet à partir de son id
	 * 
	 * @param id
	 * @return objet retrouvé grace à l'id, ou null si aucun objet trouvé
	 * @throws Error
	 *             si objet non trouvé
	 */
	getObjectIndex : function(id) {
		if (id in this.oObjectIndex) {
			return this.oObjectIndex[id];
		} else {
			throw new Error('game.getObjectIndex: object (' + id + ') not found.');
		}
	},

	/**
	 * Création d'un nouveau mobile à la position spécifiée
	 * 
	 * @param sBlueprint
	 *            blueprint de l'objet à créer
	 * @param x
	 *            coordonnées initiales
	 * @param y
	 * @param fAngle
	 *            angle initial
	 * @return objet créé
	 */
	spawnMobile : function(sBlueprint, x, y, fAngle) {
		return this.oRaycaster.oHorde.spawnMobile(sBlueprint, x, y, fAngle);
	},
	
	// /////////// EVENEMENTS /////////////

	// onInitialize: null,

	// onRequestLevelData: null,

	// onLoading: null,

	// onEnterLevel: null,

	// onMenuLoop: null,

	// onDoomLoop: null,

	// onFrameRendered: null,

	// ////////////// ETATS ///////////////

	/**
	 * Initialisation du programme Ceci n'intervient qu'une fois
	 */
	stateInitialize : function() {
		// Evènement initialization
		this._callGameEvent('onInitialize');

		this.TIME_FACTOR = this.nInterval = CONFIG.game.interval;

		switch (CONFIG.game.doomloop) {
		case 'interval':
			this.stateRunning = this.stateRunningInt;
			break;

		case 'raf':
			if (this.initRequestAnimationFrame()) {
				this.stateRunning = this.stateRunningRAF;
			} else {
				this.stateRunning = this.stateRunningInt;
			}
			break;
		}
		this.setDoomloop('stateMenuLoop');
		this.resume();
	},

	/**
	 * Attend le choix d'une partie. Le programme doit afficher un menu ou un
	 * écran d'accueil. Pour lancer la partie, l'évènement onMenuLoop doit
	 * retourner la valeur 'true';
	 */
	stateMenuLoop : function() {
		if (this._callGameEvent('onMenuLoop')) {
			this.setDoomloop('stateStartRaycaster');
		}
	},

	/**
	 * Initialisation du Raycaster Ceci survient à chaque chargement de niveau
	 */
	stateStartRaycaster : function() {
		if (this.oRaycaster) {
			this.oRaycaster.finalize();
		} else {
			this.oRaycaster = new O876_Raycaster.Raycaster();
			this.oRaycaster.TIME_FACTOR = this.TIME_FACTOR;
		}
		this.oRaycaster.setConfig(CONFIG.raycaster);
		this.oObjectIndex = {};
		this.oRaycaster.initialize();
		this.oThinkerManager = this.oRaycaster.oThinkerManager;
		this.oThinkerManager.oGameInstance = this;
		this._callGameEvent('onLoading', 'lvl', 0, 2);
		this.setDoomloop('stateBuildLevel');
	},

	/**
	 * Prépare le chargement du niveau. RAZ de tous les objets.
	 */
	stateBuildLevel : function() {
		// Evènement chargement de niveau
		var oData = this._callGameEvent('onRequestLevelData');
		if (typeof oData != 'object') {
			this._halt('no world data : without world data I can\'t build the world. (onRequestLevelData did not return object)');
		}
		this.oRaycaster.defineWorld(oData);
		this._callGameEvent('onLoading', 'lvl', 1, 2);
		this.oRaycaster.buildLevel();
		this._callGameEvent('onLoading', 'lvl', 2, 2);
		this.setDoomloop('stateLoadComplete');
	},

	/**
	 * Patiente jusqu'à ce que les ressource soient chargée
	 */
	stateLoadComplete : function() {
		if (this.oRaycaster.oImages.complete()) {
			// calculer le nombre de shading à faire
			this.nShadedTileCount = 0;
			var iStc = '';
			for (iStc in this.oRaycaster.oHorde.oTiles) {
				if (this.oRaycaster.oHorde.oTiles[iStc].bShading) {
					++this.nShadedTileCount;
				}
			}
			this.oRaycaster.backgroundRedim();
			this._callGameEvent('onLoading', 'shd', this.nShadedTiles = 0, this.nShadedTileCount);
			this.setDoomloop('stateShading');
		} else {
			this._callGameEvent('onLoading', 'gfx', this.oRaycaster.oImages.countLoaded(), this.oRaycaster.oImages.countLoading());
		}
	},

	/**
	 * Procède à l'ombrage des textures
	 */
	stateShading : function() {
		this._callGameEvent('onLoading', 'shd', ++this.nShadedTiles, this.nShadedTileCount);
		if (!this.oRaycaster.shadeProcess()) {
			return;
		}
		// this._callGameEvent('onLoading', 'shd', 1, 1);
		this.nLastTimeStamp = Date.now();
		this.oFrameCounter = new O876_Raycaster.FrameCounter();
		this.oFrameCounter.start(this.nLastTimeStamp);
		this.setDoomloop('stateRunning');
		this._callGameEvent('onLoading', 'end', 1, 1);
		this._callGameEvent('onEnterLevel');
	},

	/**
	 * Déroulement du jeu
	 */
	stateRunning : null,

	/**
	 * Déroulement du jeu
	 */
	stateRunningInt : function() {
		var nNowTimeStamp = Date.now();
		var nFrames = 0;
		while (this.nLastTimeStamp < nNowTimeStamp) {
			this.oRaycaster.frameProcess();
			this._callGameEvent('onDoomLoop');
			this.nLastTimeStamp += this.nInterval;
			nFrames++;
		}
		if (nFrames) {
			this.oRaycaster.frameRender();
			this._callGameEvent('onFrameRendered');
			if (this.oFrameCounter.check(nNowTimeStamp)) {
				this._callGameEvent('onFrameCount', this.oFrameCounter.nFPS, this.oFrameCounter.getAvgFPS(), this.oFrameCounter.nSeconds);
			}
		}
	},

	/**
	 * Déroulement du jeu
	 */
	stateRunningRAF : function(nTime) {
		var E = window.__transistateMachine;
		requestAnimationFrame(E.stateRunning);
		var nNowTimeStamp = Date.now();
		var nFrames = 0;
		while (E.nLastTimeStamp < nNowTimeStamp) {
			E.oRaycaster.frameProcess();
			E._callGameEvent('onDoomLoop');
			E.nLastTimeStamp += E.nInterval;
			nFrames++;
		}
		if (nFrames) {
			E.oRaycaster.frameRender();
			E._callGameEvent('onFrameRendered');
			if (E.oFrameCounter.check(nNowTimeStamp)) {
				E._callGameEvent('onFrameCount', this.oFrameCounter.nFPS, this.oFrameCounter.getAvgFPS(), this.oFrameCounter.nSeconds);
			}
		}
	},

	/**
	 * Fin du programme
	 * 
	 */
	stateEnd : function() {
		this.pause();
	}
});

/** Effet spécial temporisé
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet
 * Cet effet gère l'ouverture et la fermeture des portes, ce n'est pas un effet visuel a proprement parlé
 * L'effet se sert de sa référence au raycaster pour déterminer la présence d'obstacle génant la fermeture de la porte
 * C'est la fonction de temporisation qui est exploitée ici, même si l'effet n'est pas visuel.
 */
O2.extendClass('O876_Raycaster.GXDoor', O876_Raycaster.GXEffect, {
	sClass : 'Door',
	nPhase : 0, // Code de phase : les porte ont 4 phases : 0: fermée(init), 1: ouverture, 2: ouverte et en attente de fermeture, 3: en cours de fermeture, 4: fermée->0
	oRaycaster : null, // Référence au raycaster        
	x : 0, // position de la porte
	y : 0, // ...
	fOffset : 0, // offset de la porte
	
	nMaxTime : 3000, // temps d'ouverture max en ms
	nTime : 3000, // temps restant avant fermeture
	nAutoClose : 0, // Flag autoclose 1: autoclose ; 0: stay open

	fSpeed : 0, // vitesse d'incrémentation/décrémentation de la porte
	nLimit : 0, // limite d'incrément de l'offset (reduit par 2 pour les porte double)
	nCode : 0, // Code physique de la porte

	__construct: function(r) {
		__inherited(r);
		this.setAutoClose(true);
	},
	
	isOver : function() {
		return this.nPhase > 3;
	},

	process : function() {
		var r = this.oRaycaster;
		switch (this.nPhase) {
			case 0: // init
				Marker.markXY(r.oDoors, this.x, this.y, this);
				this.nCode = r.getMapXYPhysical(this.x, this.y);
				switch (this.nCode) {
					case r.PHYS_DOOR_SLIDING_DOUBLE:
						this.fSpeed = r.TIME_FACTOR * 60 / 1000;
						this.nLimit = 32;
						break;
			
					case r.PHYS_DOOR_SLIDING_LEFT:
					case r.PHYS_DOOR_SLIDING_RIGHT:
						this.fSpeed = r.TIME_FACTOR * 120 / 1000;
						this.nLimit = r.nPlaneSpacing;
						break;
			
					default:
						this.fSpeed = r.TIME_FACTOR * 120 / 1000;
						this.nLimit = 96;
						break;
				}
				this.nPhase++;	/** no break on the next line */

			case 1: // la porte s'ouvre jusqu'a : offset > limite
				this.fOffset += this.fSpeed;
				if (this.fOffset >= this.nLimit) {
					this.fOffset = this.nLimit - 1;
					r.setMapXYPhysical(this.x, this.y, 0);
					this.nPhase++;
				}
				break;

			case 2: // la porte attend avant de se refermer   
				this.nTime -= this.nAutoclose;
				if (this.nTime <= 0) {
					// Recherche de sprites solides empechant de refermer la porte
					if (r.oMobileSectors.get(this.x, this.y).length) {
						this.nTime = this.nMaxTime >> 1;
					} else {
						r.setMapXYPhysical(this.x, this.y, this.nCode);
						this.nPhase++;
					}
				}
				break;
		
			case 3: // la porte se referme
				this.fOffset -= this.fSpeed;
				if (this.fOffset < 0) {
					this.terminate();
				}
				break;
		}
		r.setMapXYOffset(this.x, this.y, this.fOffset | 0);
	},

	/** Fermeture de la porte
	 * @param bForce force la fermeture en cas de présence de mobile
	 */
	close : function(bForce) {
		this.nTime = 0;
		if (bForce && this.nPhase == 2) {
			this.nPhase++;
		}
	},
	
	/** Position le flag autoclose
	 * @param n nouvelle valeur du flag
	 * 0: pas d'autoclose : la porte reste ouverte
	 * 1: autoclose : la porte se referme après le délai normal imparti
	 */
	setAutoClose : function(n) {
		this.nAutoclose = n ? this.oRaycaster.TIME_FACTOR : 0;
	},
	
	terminate : function() {
		// en phase 0 rien n'a vraiment commencé : se positionner en phase 4 et partir
		if (this.nPhase === 0) {
			this.nPhase = 4;
			Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
			return;
		}
		this.fOffset = 0;
		Marker.clearXY(this.oRaycaster.oDoors, this.x, this.y);
		this.nPhase = 4;
		this.oRaycaster.setMapXYOffset(this.x, this.y, 0);
		this.oRaycaster.setMapXYPhysical(this.x, this.y, this.nCode);
	}
});

/**
 * Ce thinker permet de bouger un mobile en définissant un vecteur de vitesse.
 * Il ne dispose d'aucune intelligence artificielle Ce thinker a été conçu pour
 * être utilisé comme Thinker de base dans un environnement réseau. Le thinker
 * propose les fonction suivantes : - setSpeed(x, y) : définiiton de la vitesse
 * du mobile selon les axes X et Y - die() : le mobile passe à l'état DEAD (en
 * jouant l'animation correspondante - disable() : le mobile disparait -
 * restore() : le mobile réapparait dans la surface de jeux
 */
O2.extendClass('O876_Raycaster.CommandThinker', O876_Raycaster.Thinker, {

	fma : 0, // Moving Angle
	fms : 0, // Moving Speed

	nDeadTime : 0,
	

	ANIMATION_STAND : 0,
	ANIMATION_WALK : 1,
	ANIMATION_ACTION : 2,
	ANIMATION_DEATH : 3,

	setMovement : function(a, s) {
		if (this.fma != a || this.fms != s) {
			this.fma = a;
			this.fms = s;
			var oSprite = this.oMobile.oSprite;
			var nAnim = oSprite.nAnimationType;
			var bStopped = s === 0;
			switch (nAnim) {
				case this.ANIMATION_ACTION:
				case this.ANIMATION_STAND:
					if (!bStopped) {
						oSprite.playAnimationType(this.ANIMATION_WALK);
					}
				break;
				
				case this.ANIMATION_WALK:
					if (bStopped) {
						oSprite.playAnimationType(this.ANIMATION_STAND);
					}
				break;
			}
		}
	},

	die : function() {
		this.setMovement(this.fma, 0);
		this.oMobile.oSprite.playAnimationType(this.ANIMATION_DEATH);
		this.oMobile.bEthereal = true;
		this.nDeadTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
		this.think = this.thinkDying;
	},

	disable : function() {
		this.thinkDisable();
	},

	restore : function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
	},

	think : function() {
		this.restore();
	},

	thinkAlive : function() {
		var m = this.oMobile;
		m.move(this.fma,this.fms);
		if (this.oGame.oRaycaster.clip(m.x, m.y, 1)) {
			m.rollbackXY();
		}
	},

	thinkDisable : function() {
		this.oMobile.bEthereal = true;
		this.nDeadTime = 0;
		this.think = this.thinkDying;
	},

	thinkDying : function() {
		this.nDeadTime -= this.oGame.TIME_FACTOR;
		if (this.nDeadTime <= 0) {
			this.oMobile.gotoLimbo();
			this.think = this.thinkDead;
		}
	},

	thinkDead : function() {
		this.oMobile.bActive = false;
	}
});

/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile
 */
O2.extendClass('O876_Raycaster.KeyboardThinker', O876_Raycaster.Thinker, {
  oKeyboard: null,
  aKeys: null,
  aCommands: null,

  defineKeys: function(a) {
    this.aKeys = {};
    this.aCommands = {};
    for (var k in a) {
      this.aKeys[k] = [a[k], 0];
      this.aCommands[a[k]] = false;
    }
  },
  
  getCommandStatus: function(sKey) {
    return this.aCommands[sKey];
  },

  updateKeys: function() {
    var sKey = '', nKey, sProc, pProc;
    for (sKey in this.aKeys) {
      nKey = this.aKeys[sKey][0];
      sProc = '';
      switch (this.oKeyboard.aKeys[nKey]) {
        case 1: // down
          if (this.aKeys[sKey][1] === 0) {
            sProc = sKey + 'Down';
            this.aCommands[sKey] = true;
            this.aKeys[sKey][1] = 1;
          }
        break;

        case 2: // Up
          if (this.aKeys[sKey][1] == 1) {
            sProc = sKey + 'Up';
            this.aCommands[sKey] = false;
            this.aKeys[sKey][1] = 0;
          }
        break;
      }
      if (sProc in this) {
        pProc = this[sProc];
        pProc.apply(this, []);
      }
    }
    for (sKey in this.aCommands) {
      if (this.aCommands[sKey]) {
        sProc = sKey + 'Command';
        if (sProc in this) {
          pProc = this[sProc];
          pProc.apply(this, []);
        }
      }
    }
  }
});


/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière lineaire, à l'aide d'indication de vitesse
 * Utile lorsqu'on a une indication de vitesse, mais pas de point de destination précis
 */
O2.extendClass('O876_Raycaster.LinearThinker', O876_Raycaster.Thinker, {
	nTime : 0,
	nCurrentTime: 0,
	
	xStart: 0,
	yStart: 0,
	aStart: 0,

	xDelta : 0,
	yDelta : 0,
	
	__construct : function() {
		this.nTime = 0;
	},

	think : function() {
		this.think = this.thinkInit;
	},
	
	setMove: function(x, y, a, dx, dy, t) {
		if (x !== null && x !== undefined) {
			this.xStart = x;
		} else {
			this.xStart = this.oMobile.x;
		}
		if (y !== null && y !== undefined) {
			this.yStart = y;
		} else {
			this.yStart = this.oMobile.y;
		}
		if (a !== null && a !== undefined) {
			this.aStart = a;
		} else {
			this.aStart = this.oMobile.fTheta;
		}
		if (dx !== null && dx !== undefined) {
			this.xDelta = dx;
		}
		if (dy !== null && dy !== undefined) {
			this.yDelta = dy;
		}
		if (t !== null && t !== undefined) {
			this.nTime = t;
		}
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.oMobile.setXY(this.xStart, this.yStart);
		this.oMobile.setAngle(this.aStart);
		this.nCurrentTime = 0;
		this.think = this.thinkDeltaMove;
	},

	thinkDeltaMove : function() {
		this.oMobile.slide(this.xDelta, this.yDelta);
		this.nCurrentTime++;
		if (this.nCurrentTime > this.nTime) {
			this.think = this.thinkStop;
		}
	},
	
	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});

/** Classe de déplacement automatisé et stupidité artificielle des mobiles
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * 
 * Classe spécialisée dans le déplacement des missile
 * Un missile possède deux animation 0: die 1: go
 * Ce thinker gère le dispenser.
 * Réécrire les methode advance et thinkHit pour personnaliser les effets
 */
O2.extendClass('O876_Raycaster.MissileThinker', O876_Raycaster.Thinker, {
  oOwner: null,				// Mobile a qui appartient ce projectile
  nExplosionTime: 0,		// Compteur d'explosion
  nExplosionMaxTime: 4,		// Max du compteur d'explosion (recalculé en fonction de la durée de l'anim)
  bExiting: true,			// Temoin de sortie du canon pour eviter les fausse collision avec le tireur
  oLastHitMobile: null,		// Dernier mobile touché
  nStepSpeed: 4,			// Nombre de déplacement par frame
  
  ANIMATION_EXPLOSION: 0,
  ANIMATION_MOVING: 1,
  
  nLifeOut: 0,
  
  __construct: function() {
    this.think = this.thinkIdle;
  },

  /** Renvoie true si le missile collisionne un objet ou un mur
   */
  isCollisioned: function() {
    var bWallCollision = this.oMobile.oWallCollision.x != 0 || this.oMobile.oWallCollision.y != 0;  // collision murale
    var bMobileCollision = this.oMobile.oMobileCollision !== null;                        // collision avec un mobile
    var nTargetType = bMobileCollision ? this.oMobile.oMobileCollision.getType() : 0;
    var bOwnerCollision = this.oMobile.oMobileCollision == this.oOwner;                   // collision avec le tireur
    var bSolidCollision = bMobileCollision &&                                             // collision avec un mobile solide (non missile, et non item)
      nTargetType != RC.OBJECT_TYPE_MISSILE &&
      nTargetType != RC.OBJECT_TYPE_ITEM;

    if (bWallCollision) {
      this.oMobile.oMobileCollision = null;
      return true;
    }

    if (bOwnerCollision && !this.bExiting) {
      return true;
    }

    if (this.bExiting) {
      this.bExiting = bOwnerCollision;
      return false;
    }

    if (bSolidCollision) {
      return true;
    }
    return false;
  },
  
  advance: function() {
    this.oMobile.moveForward();
  },
  
  explode: function() {
    this.oLastHitMobile = this.oMobile.oMobileCollision;
    this.oMobile.rollbackXY();
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_EXPLOSION);
    this.nExplosionTime = 0;
    this.nExplosionMaxTime = this.oMobile.oSprite.oAnimation.nDuration * this.oMobile.oSprite.oAnimation.nCount;
    this.oMobile.bEthereal = true;
    this.think = this.thinkHit;
  },

  extinct: function() {
    this.oMobile.bEthereal = true;
    this.oMobile.gotoLimbo();
    this.oMobile.oSprite.playAnimationType(-1);
    this.think = this.thinkIdle;
  },

  fire: function(oMobile) {
    this.bExiting = true;
    this.oOwner = oMobile;
    this.oMobile.oSprite.playAnimationType(this.ANIMATION_MOVING);
    this.oMobile.bSlideWall = false;
    this.oMobile.bEthereal = false;
    this.think = this.thinkGo;
    this.advance();
  },

  thinkGo: function() {
	if (this.nLifeOut < this.oGame.nTime) {
      this.extinct();
      return;
	}
    for (var i = 0; i < this.nStepSpeed; i++) {
      this.advance();
      if (this.isCollisioned()) {
        this.explode();
        break;
      }
    }
  },

  thinkHit: function() {
    this.nExplosionTime += this.oGame.TIME_FACTOR;
    if (this.nExplosionTime >= this.nExplosionMaxTime) {		
      this.oMobile.gotoLimbo();
      this.think = this.thinkIdle;
    }
  },

  thinkIdle: function() {
    this.oMobile.bActive = false;
  }
});

/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile
 */
O2.extendClass('O876_Raycaster.MouseKeyboardThinker', O876_Raycaster.Thinker, {
	oKeyboard : null,
	oMouse : null,
	aKeys : null,
	aCommands : null,

	defineKeys : function(a) {
		this.aKeys = {};
		this.aCommands = {};
		for ( var k in a) {
			this.aKeys[k] = [ a[k], 0 ];
			this.aCommands[a[k]] = false;
		}
	},
	
	getCommandStatus : function(sKey) {
		return this.aCommands[sKey];
	},

	updateKeys : function() {
		var sKey = '', nKey, sProc, pProc, aButton;
		for (sKey in this.aKeys) {
			nKey = this.aKeys[sKey][0];
			sProc = '';
			switch (this.oKeyboard.aKeys[nKey]) {
				case 1: // down
					if (this.aKeys[sKey][1] === 0) {
						sProc = sKey + 'Down';
						this.aCommands[sKey] = true;
						this.aKeys[sKey][1] = 1;
					}
					break;
		
				case 2: // Up
					if (this.aKeys[sKey][1] == 1) {
						sProc = sKey + 'Up';
						this.aCommands[sKey] = false;
						this.aKeys[sKey][1] = 0;
					}
					break;
				default:
					sProc = '';
					break;
			}
			if (sProc in this) {
				pProc = this[sProc];
				pProc.apply(this, []);
			}
		}
		while (aButton = this.oMouse.inputMouse()) {
			nKey = aButton[3];
			sKey = 'button' + nKey;
			switch (aButton[0]) {
				case 1: // button down
					sProc = sKey + 'Down';
					this.aCommands[sKey] = true;
					break;
					
				case 0: // button up
					sProc = sKey + 'Up';
					this.aCommands[sKey] = false;
					break;

				case 3:
					sProc = 'wheelUp';
					break;
					
				case -3:
					sProc = 'wheelDown';
					break;
					
				default:
					sProc = '';
					break;
			}
			if (sProc in this) {
				pProc = this[sProc];
				pProc.apply(this, []);
			}
		}
		for (sKey in this.aCommands) {
			if (this.aCommands[sKey]) {
				sProc = sKey + 'Command';
				if (sProc in this) {
					pProc = this[sProc];
					pProc.apply(this, []);
				}
			}
		}
	}
});

/** Interface de controle des mobile 
 * O876 Raycaster project
 * @date 2013-03-04
 * @author Raphaël Marandet 
 * Fait bouger le mobile de manière non-lineaire
 * Avec des coordonnée de dépat, d'arriver, et un temps donné
 * L'option lineaire est tout de même proposée.
 */
O2.extendClass('O876_Raycaster.NonLinearThinker', O876_Raycaster.Thinker, {
	nTime : 0,
	nCurrentTime: 0,
	
	xStart: 0,
	yStart: 0,
	aStart: 0,
	
	xEnd: 0,
	yEnd: 0,
	
	fWeight: 1,
	
	sFunction: 'smoothstepX2',
	
	__construct : function() {
		this.nTime = 0;
	},
	
	processTime: function() {
		this.nCurrentTime++;
		if (this.nCurrentTime > this.nTime) {
			this.think = this.thinkStop;
		}
	},
	
	setMove: function(x, y, a, dx, dy, t) {
		if (x !== null && x !== undefined) {
			this.xStart = x;
		} else {
			this.xStart = this.oMobile.x;
		}
		if (y !== null && y !== undefined) {
			this.yStart = y;
		} else {
			this.yStart = this.oMobile.y;
		}
		if (a !== null && a !== undefined) {
			this.aStart = a;
		} else {
			this.aStart = this.oMobile.fTheta;
		}
		if (dx !== null && dx !== undefined) {
			this.xEnd = dx;
		}
		if (dy !== null && dy !== undefined) {
			this.yEnd = dy;
		}
		if (t !== null && t !== undefined) {
			this.nTime = t;
		}
	},

	think : function() {
		this.think = this.thinkInit;
	},

	// Déplacement à la position de départ
	thinkInit : function() {
		this.oMobile.setXY(this.xStart, this.yStart);
		this.oMobile.setAngle(this.aStart);
		this.nCurrentTime = 0;
		this.think = this.thinkMove;
	},
	
	thinkMove: function() {
		var x, y;
		
		var v = this[this.sFunction](this.nCurrentTime / this.nTime);
		
		x = this.xEnd * v + (this.xStart * (1 - v));
		y = this.yEnd * v + (this.yStart * (1 - v));
		
		this.oMobile.setXY(x, y);
		this.processTime();
	},
	
	linear: function(v) {
		return v;
	},
	
	smoothstep: function(v) {
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX2: function(v) {
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	smoothstepX3: function(v) {
		v = v * v * (3 - 2 * v);
		v = v * v * (3 - 2 * v);
		return v * v * (3 - 2 * v);
	},
	
	squareAccel: function(v) {
		return v * v;
	},
	
	squareDeccel: function(v) {
		return 1 - (1 - v) * (1 - v);
	},
	
	cubeAccel: function(v) {
		return v * v * v;
	},
	
	cubeDeccel: function(v) {
		return 1 - (1 - v) * (1 - v) * (1 - v);
	},
	
	sine: function(v) {
		return Math.sin(v * 3.14159265 / 2);
	},
	
	cosine: function(v) {
		return 0.5 - Math.cos(-v * 3.14159265) * 0.5;
	},
	
	weightAverage: function(v) {
		return ((v * (this.nTime - 1)) + this.fWeight) / this.nTime;
	},
	
	thinkStop: function() {
	},
	
	thinkIdle: function() {
	}
});

O2.extendClass('MW.Game', O876_Raycaster.Engine, {
	oData : null,
	oSoundSystem : null,
	oClientSocket : null,
	oPluginSystem : null,
	sClientName : '',
	idClient : 0,
	idEntity : 0,
	nMenuState : 0,
	bMapReady : false,
	aEntities : null,
	aInvisibles : null, // liste des entités invisibles
	sAudioType : 'ogg',
	aDoorsOpen : null, // liste des portes ouvertes au chargement
	sBossModeTitle : '', // sauvegarde du titre de la fenetre en mode boss
	nWeaponChargeTime: 3000,
	nInstanceId: 0,
	

	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////
	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////
	// //// GAME PROCEDURES ////// GAME PROCEDURES ////// GAME PROCEDURES //////

	gpRespawn : function() {
		this.sendSignal('ui_close');
		this.send('RR', {});
	},

	/**
	 * Relancer le jeu (totalement, car il a planté ou déconnecté)
	 */
	gpReboot : function() {
		location.reload();
	},
	
	
	gpEndGame: function() {
		this.setPlayerControllable(false);
		this.nMenuState = 2;
		this.setDoomloop('stateMenuLoop');
	},
	
	/**
	 * Reconnects to the previously joined instance
	 */	
	gpReconnect: function() {
		this.nMenuState = 0;
		this.sendSignal('ui_close');
		this.csGameJoin(this.nInstanceId);
	},
	
	/**
	 * Display message in HTML
	 * @param sTitle title of window
	 * @param sHTML content of window
	 */
	gpDisplayHTMLMessage: function(sTitle, sHTML) {
		MW.Microsyte.openInfoForm(sTitle, sHTML);
	},

	



	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////
	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////
	// //// MESSAGES CLIENT -> SERVER ////// MESSAGES CLIENT -> SERVER //////

	/**
	 * <proxy> Envoi de message au serveur
	 * 
	 * @param string
	 *            sMessage
	 * @param object
	 *            xData
	 */
	send : function(sMessage, xData) {
		this.oClientSocket.send(sMessage, xData);
	},

	/**
	 * Envoie un message de debug
	 */
	csDebug : function(sMessage) {
		this.send('ZZ', {
			m : sMessage
		});
	},

	csChatMessage : function(sMessage) {
		this.send('CM', {
			m : sMessage
		});
	},

	/**
	 * LI { n: client-name } Soumettre un nom d'utilisateur au serveur.
	 */
	csLogin : function(sLogin) {
		this.send('LI', {
			n : sLogin
		});
	},

	/**
	 * GJ { i: instance id } Demande de rejoindre une partie hébéergée par le
	 * serveur
	 */
	csGameJoin : function(idGame) {
		this.nInstanceId = idGame;
		this.send('GJ', {
			i : idGame
		});
	},

	/**
	 * RY Indique au serveur qu'on est pret à jouer
	 */
	csReady : function() {
		this.send('RY', {});
	},

	/**
	 * Mise à jour du mobile du client
	 */
	csMyUpdate : function(f, x, y, ma, ms) {
		this.send('UD', {
			t : this.getTime(),
			x : x,
			y : y,
			a : f, // angle de vue
			ma : ma, // angle de mouvement
			ms : ms
		// vitesse
		});
	},

	/**
	 * Activation d'un pan de mur
	 * 
	 * @param x
	 *            ...
	 * @param y
	 *            coordonnées du mur activé
	 */
	csActivateWall : function(x, y) {
		this.send('WA', {
			x : x,
			y : y
		});
	},

	/**
	 * Tir de missile
	 */
	csAttack : function(nTime) {
		this.send('PA1', {
			t : nTime
		});
	},

	/**
	 * Utilisation d'objet
	 */
	csUse : function(n) {
		this.send('PA2', {
			i : n
		});
	},
	
	/**
	 * Jeter un objet
	 */
	csDrop: function(n) {
		this.send('PAD', {
			i: n
		});
	},
	
	csPluginMessage: function(m) {
		this.send('PM', m);
	},

	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////
	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////
	// //// MESSAGES SERVER -> CLIENT ////// MESSAGES SERVER -> CLIENT //////

	/**
	 * Active les gestionnaires de messages reseau. Les gestionnaire sont les
	 * fonction don le nom commence par "sc"
	 */
	activateNetworkListeners : function() {
		this.setSocketHandler('disconnect');
		Object.keys(Object.getPrototypeOf(this)).filter(function(x) {
			return x.match(/^sc[0-9A-Z]{2}$/);
		}).map(function(x) {
			return x.substr(2);
		}).forEach(this.setSocketHandler.bind(this));
	},

	/**
	 * Définition d'un gestionnaire de mesage réseau
	 * 
	 * @param string
	 *            sEvent nom de l'évènement
	 */
	setSocketHandler : function(sEvent) {
		var sHandler = 'sc' + sEvent;
		var pHandler = this[sHandler];
		var pBound = pHandler.bind(this);
		this.oClientSocket.setSocketHandler(sEvent, pBound);
	},

	/**
	 * Deconnection forcée du client
	 */
	scdisconnect : function() {
		this.oClientSocket.disconnect();
		this.dialogDisconnect();
	},

	/**
	 * ID { n: client-name, i: client-id } Le serveur accepte le login de
	 * l'utilsateur et lui transmet son identifiant Normalement les données du
	 * niveau vont suivre Ou bien une liste des differentes parties enregistrées
	 * sur le serveur
	 */
	scID : function(xData) {
		this.sClientName = xData.n;
		this.idClient = xData.i;
		this.csGameJoin(1);
	},

	/**
	 * MD { m: game-data } Map Data : Le serveur envoie les données d'un niveau
	 */
	scMD : function(xData) {
		this.oData = xData.m;
		this.aDoorsOpen = xData.d;
		this.oData.tiles = MW.TILES_DATA;
		this.oData.blueprints = MW.BLUEPRINTS_DATA;
		this.bMapReady = true;
		this.aEntities = [];
		this.aInvisibles = [];
	},

	/**
	 * YO { i: identifiant, x: position x, y: position y, a: angle initial }
	 * Your Object : Le serveur indique au client l'objet dont il a la charge
	 */
	scYO : function(xData) {
		var id = xData.i;
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var b = xData.b;
		var p = this.getPlayer();
		p.nSize = this.oRaycaster.aWorld.blueprints[b].width >> 1;
		p.setXY(x, y);
		p.setAngle(a);
		p.setData('idEntity', id);
		p.setData('name', xData.n);
		if ('w' in xData) {
			this.scYW(xData.w);
		}
		this.idEntity = id;
		this.aEntities[id] = p;
	},
	
	scYW: function(xData) {
		this.popupMessage(STRINGS._('~item_equip', ['~itm_' + xData.n]));
		this.nWeaponChargeTime = xData.c;
	},

	/**
	 * OC { i: identifiant, x: position x, y: position y, a: angle initial, b:
	 * blueprint } Object create : Le serveur indique la créatiob d'un objet
	 */
	scOC : function(xData) {
		var id = xData.i;
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var sBP = xData.b;
		var m = this.spawnMobile(sBP, x, y, a);
		m.getThinker().restore();
		m.setData('idEntity', id);
		if ('n' in xData && xData.n) {
			// entity has a name
			m.setData('name', xData.n);
		}
		this.aEntities[id] = m;
	},

	/**
	 * OD {i: identifiant x: last position x, y: last position y} Object Destroy :
	 * Supprimer un objet si l'objet n'existe pas, rien ne se produit L'objet
	 * est positionné avant d'etre détruit
	 */
	scOD : function(xData) {
		this.destroyObject(xData.i, xData.x, xData.y);
	},

	/**
	 * OU {i: identifiant x: position x, y: position y, a: angle de vue, ma:
	 * angle de déplacement, ms: vitesse de déplacement} Object Update : Mise a
	 * jour d'entité de l'instance L'angle de vue est angle vers lequel le
	 * mobile regarde L'angle de déplacement est la direction empruntée par le
	 * mobile ors de son déplacement
	 */
	scOU : function(xData) {
		var nLen, i, id, x, y, ma, ms, a, m, sm;
		var D;
		nLen = xData.length;
		for (i = 0; i < nLen; ++i) {
			D = xData[i];
			id = D.i;
			if (id == this.idEntity) {
				continue;
			}
			if (!this.aEntities[id]) {
				continue;
			}
			m = this.aEntities[id];
			x = D.x;
			y = D.y;
			a = D.a;
			ma = D.ma;
			ms = D.ms;
			sm = D.sm;
			m.setAngle(a);
			m.getThinker().setMovement(ma, ms * sm);
			m.setXY(x, y);
		}
	},

	/**
	 * Notre entité subit des changement d'attributs
	 */
	scOS_me : function(xData) {
		var n;
		var oPlayer = this.getPlayer();
		var oPlayerThinker = oPlayer.getThinker();
		for ( var s in xData) {
			n = xData[s];
			switch (s) {
				case 'vitality': // hp max
					this.sendSignal('hud_update', 'life', null, n);
					break;
	
				case 'hp': // hp
					this.sendSignal('hud_update', 'life', n, null);
					break;
	
				case 'dhp': // dhp : difference de hp
					if (n < -20) {
						this.gxFlash('#D00', 0.75);
					} else if (n < -4) { // dégâts
						this.gxFlash('#D00', 0.5);
					} else if (n < 0) { // dégâts
						this.gxFlash('#D00', 0.2);
					} else if (n > 0) { // soins
						this.gxFlash('#0D0', 0.5);
					}
					break;
	
				case 'esp':
					if (n > 0) {
						this.aInvisibles.forEach(function(e) {
							e.bVisible = true;
							e.oSprite.bTranslucent = true;
						});
					} else {
						this.aInvisibles.forEach(function(e) {
							e.bVisible = false;
							e.oSprite.bTranslucent = false;
						});
					}
					oPlayerThinker.setupEffect(s, n);
					break;
					
				case 'clairvoyance':
					if (G.oRaycaster.oMinimap) {
						G.oRaycaster.oMinimap.bRestricted = n <= 0;
					}
					break;
				
				default:
					oPlayerThinker.setupEffect(s, n);
					break;
			}
		}
		this.sendSignal('hud_update', 'attributes', oPlayerThinker.oAttributes);
	},

	/**
	 * Une entité (pas la notre) subit des changement d'attributs
	 */
	scOS_other : function(oGuy, xData) {
		var nParam, oPlayer;
		for (var s in xData) {
			nParam = xData[s];
			switch (s) {
				case 'invisible':
					if (nParam > 0) {
						oPlayer = this.getPlayer();
						// le guy devient invisible
						if (this.aInvisibles.indexOf(oGuy) < 0) {
							this.aInvisibles.push(oGuy);
						}
						if (oPlayer.oThinker.oAttributes['esp'] > 0) {
							// mais j'ai l'ESP
							oGuy.bVisible = true;
							oGuy.oSprite.bTranslucent = true;
						} else {
							// et j'ai pas l'ESP
							oGuy.bVisible = false;
						}
					} else {
						// le guy redevient visible
						var nInvis = this.aInvisibles.indexOf(oGuy);
						if (nInvis >= 0) {
							this.aInvisibles.splice(nInvis, 1);
						}
						oGuy.bVisible = true;
						oGuy.oSprite.bTranslucent = false;
					}
	
					this.spawnVisualEffect('o_smoke_white', oGuy.x, oGuy.y);
					break;

				default:
					oGuy.oThinker.setHaze(s, nParam);
					break;
			}
		}
	},

	/**
	 * Transmission des changement d'états logique des entités
	 */
	scOS : function(xData) {
		var nLen, i, id;
		var D;
		nLen = xData.length;
		for (i = 0; i < nLen; ++i) {
			D = xData[i];
			id = D.i;
			delete D.i;
			if (id == this.idEntity) {
				this.scOS_me(D);
			} else if (this.aEntities[id]) {
				this.scOS_other(this.aEntities[id], D);
			}
		}
	},

	/**
	 * DO : {x, y} Door Open Commande l'ouverture d'une porte
	 */
	scDO : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var oDoor = this.openDoor(xData.x, xData.y, true);
		if (!oDoor) {
			return;
		}
		var rc = this.oRaycaster;
		var ps = rc.nPlaneSpacing;
		var ps2 = ps >> 1;
		var nSound = 0;
		switch (rc.getMapXYPhysical(x, y)) {
		case rc.PHYS_CURT_SLIDING_UP:
		case rc.PHYS_CURT_SLIDING_DOWN:
			nSound = 1;
			break;

		case rc.PHYS_SECRET_BLOCK:
			nSound = 2;
			break;
		}
		var xDoor = xData.x * ps + ps2;
		var yDoor = xData.y * ps + ps2;
		var sOpenSound = MW.SOUND_DATA.DOOR_OPEN[nSound];
		var sCloseSound = MW.SOUND_DATA.DOOR_CLOSE[nSound];
		if (sOpenSound) {
			this.playSound(sOpenSound, xDoor, yDoor);
		}
		if (sCloseSound) {
			oDoor.done = (function() {
				this.playSound(sCloseSound, xDoor, yDoor);
			}).bind(this);
		}
	},

	/**
	 * DC : {x, y} Door Close Commande de fermeture de la porte
	 */
	scDC : function(xData) {
		if (!this.closeDoor(xData.x, xData.y)) {
			// surement un passage secret
			this.oRaycaster.setMapXYPhysical(xData.x, xData.y, this.oRaycaster.PHYS_SECRET_BLOCK);
			this.oRaycaster.setMapXYOffset(xData.x, xData.y, 0);
		}
	},

	/**
	 * MC { i: identifiant, x: position x, y: position y, a: angle initial, b:
	 * blueprint } Missile create : Le serveur indique la créatiob d'un missile
	 */
	scMC : function(xData) {
		if (Array.isArray(xData)) {
			for (var i = 0; i < xData.length; ++i) {
				this.scMC(xData[i]);
			}
		} else {
			var id = xData.i;
			var x = xData.x;
			var y = xData.y;
			var a = xData.a;
			var sBP = xData.b;
			var m = this.spawnMobile(sBP, x, y, a);
			m.getThinker().restore();
			m.setData('idEntity', id);
			this.aEntities[id] = m;
		}
	},

	/**
	 * Une entity en a buté une autre
	 */
	scPK : function(xData) {
		var p = this.getPlayer();
		p.setData('killer', xData.k);
		p.getThinker().die();
		this.setPlayerControllable(false);
	},

	/**
	 * Player Respawn
	 */
	scPR : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var a = xData.a;
		var p = this.getPlayer();
		p.setXY(x, y);
		p.setAngle(a);
		p.getThinker().revive();
		this.setPlayerControllable(true);
	},

	/**
	 * Map modification
	 */
	scMM : function(xData) {
		var x = xData.x;
		var y = xData.y;
		var b = xData.b;
		var t = xData.t;
		// la map modification peut s'accopagner d'un effet spécial
		// visuel ou sonore
		if (t in MW.SOUND_DATA) {
			var ps = this.oRaycaster.nPlaneSpacing;
			var ps2 = ps >> 1;
			var xSound = x * ps + ps2;
			var ySound = y * ps + ps2;
			this.playSound(MW.SOUND_DATA[t], xSound, ySound);
		}
		this.oRaycaster.setMapXY(x, y, b);
	},

	// Réception d'un nouvel état de l'inventaire
	scNM_inv : function(xData) {
		var sInv = xData.i;
		this.sendSignal('hud_update', 'spells', sInv);
	},

	// mise à jour du HUD par un plugin
	scNM_hud : function(xData) {
		var sHud = xData.h;
		var aArgs = xData.d;
		aArgs.unshift(sHud);
		aArgs.unshift('hud_update');
		this.sendSignal.apply(this, aArgs);
	},
	
	/**
	 * Renseigne sur le cooldown d'un objet
	 */
	scNM_cooldown: function(xData) {
		var nItem = xData.i;
		var nCooldown = xData.n;
		this.sendSignal('hud_update', 'spells', null, 'cooldown', nItem, nCooldown);
	},

	/**
	 * Production d'un effet visuel
	 * 
	 * @param xData
	 * @returns
	 */
	scNM_vfx : function(xData) {
		var sBlueprint = xData.b;
		var x = xData.x;
		var y = xData.y; // position
		this.spawnVisualEffect(sBlueprint, x, y);
	},

	/**
	 * L'objet spécifié est déplacé sur une nouvelle position (téléportation) Ce
	 * message à un caractère modificationel à cause d'une regle (téléportation,
	 * reflection...) Cela diffère du message 'OU' qui a un caractère
	 * correctionnel.
	 */
	scNM_pos : function(xData) {
		var id = xData.i;
		if (!this.aEntities[id]) {
			return;
		}
		var m = this.aEntities[id];
		m.setXY(xData.x, xData.y);
		if ('a' in xData) {
			m.setAngle(xData.a);
		}
		if (('ma' in xData) && ('ms' in xData)) {
			m.getThinker().setMovement(xData.ma, xData.ms);
		}
	},
	
	/**
	 * Un simple message popup
	 */
	scNM_msg: function(xData) {
		this.popupMessage(STRINGS._('~' + xData.s, xData.p), MW.ICONS[xData.i], null, xData.a);
	},

	/**
	 * Un changement d'animation
	 */
	scNM_ani: function(xData) {
		var eid = xData.i;
		var nAnim = xData.a;
		if (!this.aEntities[eid]) {
			return;
		}
		var m = this.aEntities[eid];
		m.oSprite.playAnimationType(nAnim);
	},

	scNM : function(xData) {
		var sMeth = 'scNM_' + xData.m;
		if (sMeth in this) {
			this[sMeth](xData);
		}
	},

	// Chat message
	scCM : function(xData) {
		this.sendSignal('hud_update', 'chat', xData.n + ': ' + xData.m, this.getTime());
	},
	
	// Fin de l'instance
	scEG: function(xData) {
		this.gpEndGame();
	},

	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////
	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////
	// //// RAYCASTER ENGINE EVENTS ////// RAYCASTER ENGINE EVENTS //////

	/**
	 * Evènement apellé lors de l'initialisation du jeu Appelé une seule fois.
	 */
	onInitialize : function() {
		// Sound system
		this.oSoundSystem = new SoundSystem();
		this.oSoundSystem.addChans(8);

		// client socket
		this.oClientSocket = new MW.ClientSocket();
		this.oClientSocket.connect();
		this.activateNetworkListeners();

		// plugin system
		var ps = new O876.Mediator.Mediator();
		this.oPluginSystem = ps;
		ps.setApplication(this);
		ps.addPlugin(new MW.UIPlugin());
		ps.addPlugin(new MW.DialogPlugin());
		ps.addPlugin(new MW.HUDPlugin());
		ps.addPlugin(new MW.PopupPlugin());
		this.sendSignal = ps.sendPluginSignal.bind(ps);
	},

	/**
	 * Cette évènement doit renvoyer TRUE pour pouvoir passer à l'étape suivante
	 * 
	 * @return bool
	 */
	onMenuLoop : function() {

		switch (this.nMenuState) {
		case 0: // start game
			if (this.sClientName) {
				this.sendSignal('startgame');
				this.nMenuState = 1;
			}
			break;

		case 1: // waiting for map to be ready
			if (this.bMapReady) {
				this.nMenuState = 0;
				O876_Raycaster.PointerLock.exitPointerLock();
				return true;
			}
			break;

		case 2: // ending game init
			this.sendSignal('exitlevel');
			this.nTime = 0;
			this.nMenuState = 3;
			break;

		case 3: // ending game / fade out
			++this.nTime;
			this.sendSignal('render');
			if (this.nTime >= 10) {
				this.nMenuState = 4;
			}
			break;

		case 4: // game has ended
			this.sendSignal('render');
			this.bMapReady = false;
			this.oData = null;
			this.idEntity = 0;
			this.aEntities = null;
			this.aInvisibles = null;
			this.aDoorsOpen = null;
			this.oCamera = null;
			break;
		}
		return false;
	},

	/**
	 * Evènement appelé lors du chargement d'un niveau, cet évènement doit
	 * renvoyer des données au format du Raycaster.
	 * 
	 * @return object
	 */
	onRequestLevelData : function() {
		this.oData.objects.map(function(o) {
			return o.blueprint;
		}).forEach(function(s) {
			this.oData.tiles[s] = MW.TILES_DEC_DATA[s];
			this.oData.blueprints[s] = MW.BLUEPRINTS_DEC_DATA[s];
		}, this);
		return this.oData;
	},

	/**
	 * Evènement appelé quand une ressource et chargée sert à faire des barres
	 * de progressions
	 */
	onLoading : function(s, n, nMax) {
		var oCanvas = this.oRaycaster.oCanvas;
		var oContext = this.oRaycaster.oContext;
		oContext.clearRect(0, 0, oCanvas.width, oCanvas.height);
		var sMsg = STRINGS._('~load_' + s);
		var y = oCanvas.height >> 1;
		var nPad = 96;
		var xMax = oCanvas.width - (nPad << 1);
		oContext.font = '10px monospace';
		oContext.fillStyle = 'white';
		oContext.fillText(sMsg, nPad, oCanvas.height >> 1);
		oContext.fillStyle = 'rgb(48, 0, 0)';
		oContext.fillRect(nPad, y + 12, xMax, 8);
		oContext.fillStyle = 'rgb(255, 48, 48)';
		oContext.fillRect(nPad, y + 12, n * xMax / nMax, 8);
	},

	/**
	 * Evènement appelé lorsqu'un niveau a été chargé Permet l'initialisation
	 * des objet nouvellement créés (comme la caméra)
	 */
	onEnterLevel : function() {
		var oRC = this.oRaycaster;
		oRC.bSky = true;
		oRC.bFlatSky = true;
		oRC.nPlaneSpacing = 64;
		var oCT = new MW.PlayerThinker();
		oCT.oMouse = this._getMouseDevice(oRC.oCanvas);
		oCT.oKeyboard = this._getKeyboardDevice();
		oCT.oGame = this;
		oRC.oCamera.setThinker(oCT);
		// Tags data
		if ('tags' in oRC.aWorld) {
			var iTag, oTag;
			var aTags = oRC.aWorld.tags;
			this._oTagData = Marker.create();
			for (iTag = 0; iTag < aTags.length; ++iTag) {
				oTag = aTags[iTag];
				Marker.markXY(this._oTagData, oTag.x, oTag.y, oTag.tag);
			}
		}
		// decals
		if ('decals' in oRC.aWorld) {
			oRC.aWorld.decals.forEach(function(d) {
				var x = d.x;
				var y = d.y;
				var nSide = d.side;
				var sImage = d.tile;
				oRC.cloneWall(x, y, nSide, function(rc, oCanvas, xw, yw, sw) {
					var oImage = rc.oHorde.oTiles[sImage].oImage;
					var wt = rc.oHorde.oTiles[sImage].nWidth;
					var ht = rc.oHorde.oTiles[sImage].nHeight;
					oCanvas.getContext('2d').drawImage(oImage, 0, 0, wt, ht, (rc.xTexture - wt) >> 1, (rc.yTexture - ht) >> 1, wt, ht);
				});
			});
		}
		// ouvertures des portes
		var oThis = this;
		this.aDoorsOpen.forEach(function(dxy) {
			var x = dxy[0];
			var y = dxy[1];
			var b = dxy[2];
			oRC.setMapXY(x, y, b);
			var oDoorEffect = oThis.openDoor(x, y, true);
			oDoorEffect.fOffset = 1024;
		});
		this.aDoorsOpen = null;
		oRC.oCamera.getThinker().fNormalSpeed = oRC.oCamera.fSpeed = 4;
		this.gxFadeIn();
		this.csReady();
		this.sendSignal('enterlevel');
	},

	/**
	 * Evènement appelé par le processeur Ici on lance les animation de textures
	 */
	onDoomLoop : function() {
		this.processKeys();
		this.oRaycaster.textureAnimation();
	},

	/**
	 * Evènement appelé à chaque rendu de frame
	 */
	onFrameRendered : function() {
		this.sendSignal('render');
	},
	
	onFrameCount: function(nFPS, nAVG, nTime) {
		if (nTime > 5 && this.oRaycaster.oCanvas.width > 400 && nAVG < CONST.MINIMUM_FPS) {
			this.oRaycaster.downgrade();
			this.sendSignal('ui_resize');
			window.screenResize(null);
			this.popupMessage(STRINGS._('~alert_wtf_tooslow'), MW.ICONS.wtf_alert, null, 'amb_chat');
		}
	},

	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////
	// //// COMMANDS ////// COMMANDS ////// COMMANDS ////// COMMANDS //////

	/**
	 * Déclenche une attaque.
	 * 
	 * @param int
	 *            nTime temps de charge de l'attaque
	 */
	gm_attack : function(nTime) {
		this.csAttack(nTime * (1 + this.getPlayer().oThinker.oAttributes['energy'] / 100) | 0);
	},

	/**
	 * Déclenche la début de la charge
	 * 
	 * @param int
	 *            nTime temps de charge si 0 alors on remet la charge à zero
	 */
	gm_charge : function(nTime) {
		this.sendSignal('hud_update', 'charge', nTime * (1 + this.getPlayer().oThinker.oAttributes['energy'] / 100) | 0, this.nWeaponChargeTime);
	},

	/**
	 * Activation du mur d'en face
	 */
	gm_activateWall : function() {
		var m = this.getPlayer();
		var b = m.getFrontCellXY();
		this.csActivateWall(b.x, b.y);
	},

	gm_wheelUp : function() {
		this.sendSignal('hud_update', 'spells', null, 'left');
	},

	gm_wheelDown : function() {
		this.sendSignal('hud_update', 'spells', null, 'right');
	},

	/**
	 * Utilise l'objet actuellement selectionné
	 */
	gm_useItem : function() {
		var oSpells = this.oPluginSystem.getPlugin('HUD').getElement('spells');
		var nItem = oSpells.nDisplayed;
		var sItemId = oSpells.aGiven[nItem];
		var nCooldown = oSpells.aCooldown[nItem] || 0;
		if ((sItemId in MW.FEEDBACK) &&  (nCooldown < oSpells.nCurrentTime)) {
			var oFeedback = MW.FEEDBACK[sItemId];
			if ('flash' in oFeedback) {
				for (var iFlash = 0; iFlash < oFeedback.flash.length; iFlash += 3) {
					this.gxFade(oFeedback.flash[iFlash], oFeedback.flash[iFlash + 1] / 100, -oFeedback.flash[iFlash + 2] / 100);
				}
			}
			if ('sound' in oFeedback) {
				this.playSound(oFeedback.sound);
			}
		}
		this.csUse(nItem);
		// this.sendSignal('playercmd_useitem', nItem);
	},

	/**
	 * Transmission du mouvement du mobile controllé par le client
	 * 
	 * @param float
	 *            f angle de vue
	 * @param float
	 *            x position x
	 * @param float
	 *            y position y
	 * @param float
	 *            xs vitesse en x
	 * @param float
	 *            ys vitesse en y
	 */
	gm_movement : function(f, x, y, ma, ms) {
		this.csMyUpdate(f, x, y, ma, ms);
	},

	/**
	 * Renvoie l'instance du mobile controlé par le client (caméra)
	 */
	getPlayer : function() {
		return this.oRaycaster.oCamera;
	},

	/**
	 * Renvoie le premier MOB qui se trouve pile en face de la camera Renvoie
	 * null s'il n'y a pas de MOB visible pile en face de la caméra (dans la
	 * trajectoire d'un eventuel tir)
	 */
	getFirstMobInSight : function() {
		var oPlayer = this.getPlayer();
		if (!oPlayer) {
			return null;
		}
		var oRaycaster = this.oRaycaster;
		var oMobileRegister = oRaycaster.oMobileSectors;
		var oVisibles = oRaycaster.fastCastRay(oPlayer.x, oPlayer.y, oPlayer.fTheta);
		var x = 0, y = 0, aSector, i, nLen, oObject, nType;
		for (x in oVisibles) {
			for (y in oVisibles[x]) {
				aSector = oMobileRegister.get(x, y);
				nLen = aSector.length;
				for (i = 0; i < nLen; ++i) {
					oObject = aSector[i];
					nType = oObject.getType();
					if ((nType == RC.OBJECT_TYPE_PLAYER || nType == RC.OBJECT_TYPE_MOB) && oObject.bVisible && oObject.oSprite.bVisible) {
						return oObject;
					}
				}
			}
		}
		return null;
	},

	/**
	 * Active ou désactive le controle clavier de la caméra
	 * 
	 * @param b
	 *            true : camera controlable
	 * @returns
	 */
	setPlayerControllable : function(b) {
		var p = this.getPlayer();
		if (p && p.oThinker) {
			p.oThinker.bActive = b;
		}
		if (b) {
			this._getMouseDevice().nSecurityDelay = 8;
		}
	},

	/**
	 * Destruction d'un objet ayant un thinker avec une methode die();
	 * 
	 * @param nId
	 *            identifiant
	 * @param x
	 *            ...
	 * @param y
	 *            position finale de l'objet (optionel)
	 */
	destroyObject : function(nId, x, y) {
		if (nId === this.idEntity) {
			return;
		}
		var oMob = this.aEntities[nId];
		if (oMob) {
			if (x !== undefined && y != undefined) {
				oMob.setXY(x, y);
			}
			oMob.getThinker().die();
		}
		this.aEntities[nId] = null;
	},
	
	/**
	 * Activation d'un mur On envoie un message au serveur pour l'occasion C'est
	 * le serveur qui decide quoi faire ensuite...
	 */
	activateWall : function(oMobile) {
		var oBlock = oMobile.getFrontCellXY();
		var x = oBlock.x;
		var y = oBlock.y;
		this.openDoor(x, y);
	},

	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////
	// //// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE ////// INTERFACE //////

	dialogDisconnect : function() {
		if (this.oRaycaster === null) {
			
		} else {
			this.sendSignal('ui_dialog', STRINGS._('~dlg_disconnected_title'), STRINGS._('~dlg_disconnected_message'), [ [ STRINGS._('~dlg_button_reboot'), this.gpReboot.bind(this), 1 ] ]);
		}
	},

	dialogRespawn : function() {
		this.sendSignal('ui_dialog', STRINGS._('~dlg_youdied_title'), STRINGS._('~dlg_youdied_message', [ this.getPlayer().getData('killer') ]), [ [ STRINGS._('~dlg_button_respawn'),
				this.gpRespawn.bind(this), 1 ] ]);
	},

	dialogEndGame : function() {
		this.sendSignal('ui_dialog', STRINGS._('~dlg_endgame_title'), STRINGS._('~dlg_endgame_message', []), [ [ STRINGS._('~dlg_button_continue'), this.gpReboot.bind(this), 1 ],
				[ STRINGS._('~dlg_button_scores'), this.gpReboot.bind(this), 1 ] ]);
	},
	

	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////
	// //// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES ////// RAYCASTER UTILITIES //////

	processKeys : function() {
		var nKey = this._getKeyboardDevice().inputKey();
		if (nKey) {
			var oKey = {
				k : nKey
			};
			this.sendSignal('key', oKey);
			switch (oKey.k) {
			case KEYS.ALPHANUM.B:
				// touche boss
				var oBody = document.getElementsByTagName('body')[0];
				if (this.bBoss) {
					this.oRaycaster.oCanvas.style.display = '';
					oBody.style.backgroundColor = '';
					oBody.style.color = '';
					oBody.removeChild(this.oBossMsg);
					this.oSoundSystem.unmute();
					this.bBoss = false;
					document.title = this.sBossModeTitle;
				} else {
					O876_Raycaster.PointerLock.exitPointerLock();
					this.oRaycaster.oCanvas.style.display = 'none';
					oBody.style.backgroundColor = 'white';
					oBody.style.color = 'black';
					this.oBossMsg = document.createElement('div');
					this.oBossMsg.appendChild(document.createTextNode(STRINGS._('~boss_msg')));
					oBody.appendChild(this.oBossMsg);
					this.oSoundSystem.mute();
					this.bBoss = true;
					this.sBossModeTitle = document.title;
					document.title = STRINGS._('~boss_title');
				}
				break;

			case KEYS.ENTER:
				MW.Microsyte.openChatForm();
				break;
				
			case KEYS.TAB: 
				this.sendSignal('hud_update', 'spells', null, 'next');
				break;
				
			case KEYS.BACKSPACE:
				var oSpells = this.oPluginSystem.getPlugin('HUD').getElement('spells');
				var nItem = oSpells.nDisplayed;
				if (nItem >= 0) {
					this.csDrop(nItem);
					var aItemData = oSpells.getItemName(nItem);
					if (aItemData) {
						var sName = aItemData[0];
						var nIcon = aItemData[1];
						this.popupMessage(STRINGS._('~item_drop', [sName]), nIcon);
					}
				}
			}
		}
	},

	/**
	 * Affiche un message popup
	 * 
	 * @param string
	 *            sMessage contenu du message
	 */
	popupMessage : function(sMessage, nIcon, sTile, sSound) {
		this.sendSignal('popup', sMessage, nIcon, sTile, sSound);
	},

	/**
	 * permet de définir l'apparence des popups l'objet spécifié peut contenir
	 * les propriété suivantes : - background : couleur de fond - border :
	 * couleur de bordure - text : couleur du texte - shadow : couleur de
	 * l'ombre du texte - width : taille x - height : taille y - speed : vitesse
	 * de frappe - font : propriété de police - position : position y du popup
	 */
	setPopupStyle : function(oProp) {
		var sProp = '';
		var gmxp = O876_Raycaster.GXMessage.prototype.oStyle;
		for (sProp in oProp) {
			gmxp[sProp] = oProp[sProp];
		}
	},

	/**
	 * Lecture d'un son à la position x, y Le son est modifié en amplitude en
	 * fonction de la distance séparant le point sonore avec la position de la
	 * caméra
	 * 
	 * @param sFile
	 *            fichier son à jouer
	 * @param x
	 *            position de la source du son
	 * @param y
	 */
	playSound : function(sFile, x, y) {
		sFile = 'resources/snd/' + this.sAudioType + '/' + sFile + '.' + this.sAudioType;
		var nChan = this.oSoundSystem.getFreeChan(sFile);
		var fDist = 0;
		if (x !== undefined) {
			var oPlayer = this.getPlayer();
			fDist = MathTools.distance(oPlayer.x - x, oPlayer.y - y);
		}
		var fVolume = 1;
		var nMinDist = 64;
		var nMaxDist = 512;
		if (fDist > nMaxDist) {
			fVolume = 0;
		} else if (fDist <= nMinDist) {
			fVolume = 1;
		} else {
			fVolume = 1 - (fDist / nMaxDist);
		}
		if (fVolume > 1) {
			fVolume = 1;
		}
		var nTime = this.getTime();
		if (fVolume > 0.01) {
			if (this.oSoundSystem.worthPlaying(nTime, sFile, fVolume)) {
				this.oSoundSystem.play(sFile, nChan, fVolume);
			}
		}
	},

	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////
	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////
	// //// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS ////// GRAPHIC EFFECTS //////

	gxFade : function(sStyle, fAlpha, fSpeed) {
		var rc = this.oRaycaster;
		var gx = new O876_Raycaster.GXFade(rc);
		gx.oColor = GfxTools.buildStructure(sStyle);
		gx.fAlpha = fAlpha;
		gx.fAlphaFade = fSpeed;
		rc.oEffects.addEffect(gx);
	},

	gxFlash : function(sColor, nPower) {
		this.gxFade(sColor, nPower, -0.1);
	},

	gxFadeIn : function() {
		this.gxFade('#000', 1, -0.1);
	},

	/**
	 * Place un effet visuel sur le terrain.
	 * 
	 * @param sBlueprint string blueprint de l'effet
	 * @param x float position en "pixel"
	 * @param y float
	 */
	spawnVisualEffect : function(sBlueprint, x, y) {
		switch (sBlueprint) {
			case 'GXQuake':
				var p = this.getPlayer();
				var d = MathTools.distance(x - p.x, y - p.y) >> 6;
				d = Math.max(0, 10 - d);
				if (d) {
					var rc = this.oRaycaster;
					var gx = new MW.GXQuake(rc);
					gx.fAmp = d;
					rc.oEffects.addEffect(gx);
				}
			break;
			
			default:
				var oMob = this.spawnMobile(sBlueprint, x, y, 0);
				oMob.oSprite.playAnimationType(0, true);
				var oThinker = oMob.getThinker();
				oThinker.start();
				oMob.bEthereal = true;
				var oSounds = oMob.getData('sounds');
				if (oSounds && ('spawn' in oSounds)) {
					this.playSound(oSounds.spawn, x, y);
				}
			break;
		}
	},

	/**
	 * Coller un haze sur un sprite
	 */
	setSpriteHaze : function(oMob, nOverlay) {
		if (nOverlay !== null) {
			oMob.oSprite.oOverlay = this.oRaycaster.oHorde.oTiles.e_hazes;
			oMob.oSprite.nOverlayFrame = nOverlay;
		} else {
			oMob.oSprite.oOverlay = null;
			oMob.oSprite.nOverlayFrame = null;
		}
	},

	sendChatMessage : function(sMsg) {
		var r = sMsg.match(/^ *\/([a-z0-9]+) *(.*)$/i);
		if (r) {
			var sMeth = 'cmd_' + r[1];
			if (sMeth in this) {
				this[sMeth](r[2]);
			}
			return;
		} else {
			this.csChatMessage(sMsg);
		}
		var oChat = this.oPluginSystem.getPlugin('HUD').getElement('chat');
		if (oChat) {
			oChat.nLastTimestamp = this.getTime();
		}
	},

	cmd_debug : function(a) {
		this.csDebug(a);
	}
});

O2.extendClass('MW.HUDChat', UI.HUDElement, {
	
	nFontSize: 10,
	oText: null,
	aMessages: null,
	nMaxHeight: 512,
	nLastTimestamp: 0,
	nMessageCount: 12,
	

	autoFadeout: function(nTime) {
		var nChatTime;
		if (MW.Microsyte.bOpen) {
			nChatTime = 0;
		} else {
			nChatTime = nTime - this.nLastTimestamp;
		}
		if (nChatTime < 10000) {
			this.fAlpha = 1;
		} else if (nChatTime < 10500) {
			this.fAlpha = 1 - ((nChatTime - 10000) / 500);
		} else {
			this.fAlpha = 0;
		}
	},
	
	setSize: function(w, h) {
		__inherited(w, h);
		this.nMessageCount = (this.oCanvas.height / 10 | 0) - 1;
		this.aMessages = [];
		for (i = 0; i < this.nMessageCount; ++i) {
			this.aMessages.push('');
		}
	},
	
	
	update: function(sMessage, nTimeMs) {
		var c = this.oContext;
		if (sMessage === null) {
			this.autoFadeout(nTimeMs);
			return;
		} else {
			this.nLastTimestamp = nTimeMs;
		}
		// calculate max number of messages in the window
		if (this.aMessages === null) {
			c.font = '10px monospace';
			this.nMessageCount = (this.oCanvas.height / 10 | 0) - 1;
			this.aMessages = [];
			for (i = 0; i < this.nMessageCount; ++i) {
				this.aMessages.push('');
			}
		}
		// pushing the message and shift the oldest one
		this.aMessages.push(sMessage);
		this.aMessages.shift();
		this.redraw();
	},
	
	redraw: function() {
		var i;
		var c = this.oContext;
		if (this.oText === null) {
			this.oText = new H5UI.Text();
			this.oText.setAutosize(false);
			this.oText.setWordWrap(true);
		}
		this.oText.setSize(this.oCanvas.width, this.nMaxHeight);
		var nLen = this.aMessages.length;
		var y = this.oCanvas.height - 4;
		c.clearRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		c.fillStyle = 'rgba(0, 0, 0, 0.25)';
		c.strokeStyle = 'rgba(0, 0, 0, 0.5)';
		c.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		c.strokeRect(0, 0, this.oCanvas.width, this.oCanvas.height);
		for (i = 0; i < this.nMessageCount; ++i) {
			this.oText.setCaption(this.aMessages[nLen - i - 1]);
			this.oText.render();
			y -= this.oText._yLastWritten;
			c.drawImage(this.oText._oCanvas, 0, y);
		}
	}
});

O2.extendClass('MW.HUDCrosshair', UI.HUDElement, {
	
	redraw: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		c.beginPath();
		c.moveTo(0, h >> 1);
		c.lineTo(w, h >> 1);
		c.stroke();
		c.moveTo(w >> 1, 0);
		c.lineTo(w >> 1, h);
		c.stroke();
	},
	
	update: function() {
		this.redraw();
	}
});

O2.extendClass('MW.HUDIconPad', UI.HUDElement, {
	
	sLastIconPrint: '',
	oIcons: null,
	oAttributes: null,
	
	/**
	 * Afficher les icones vertes correspondant aux attributs positif
	 * et les icones rouges correspondant aux attributs négatif
	 */
	update: function(oAttributes) {
		var sLIP = '', sAttr = '';
		for (sAttr in oAttributes) {
			sLIP += '[' + sAttr + '/' + oAttributes[sAttr] + ']';
		}
		if (this.oIcons === null) {
			this.oIcons = this.oGame.oRaycaster.oHorde.oTiles.i_icons16.oImage;
		}
		if (sLIP !== this.sLastIconPrint) {
			this.sLastIconPrint = sLIP;
			this.oAttributes = oAttributes;
			this.redraw();
		}
	},
	
	redraw: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var oAttributes = this.oAttributes;
		c.clearRect(0, 0, w, h);
		var ad = null, xCol = 0;
		for (var sAttr in oAttributes) {
			ad = null;
			if (oAttributes[sAttr] > 0) {
				ad = MW.ATTRIBUTES_DATA[sAttr].pos;
			} else if (oAttributes[sAttr] < 0) {
				ad = MW.ATTRIBUTES_DATA[sAttr].neg;
			}
			if (ad !== null && ad.icon != null) {
				c.drawImage(this.oIcons, ad.icon << 4, ad.color << 4, 16, 16, xCol, 0, 16, 16);
				xCol += 16;
			}
		}
	}
});

O2.extendClass('MW.HUDImage', UI.HUDElement, {
	
	oImage: null,
	
	redraw: function() {
		if (this.oImage) {
			var c = this.oContext;
			var w = this.oCanvas.width;
			var h = this.oCanvas.height;
			c.drawImage(this.oImage, 0, 0, this.oImage.width, this.oImage.height, 0, 0, w, h);
		}
	},
	
	update: function(oImage) {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		if (!oImage) {
			this.oImage = null;
			c.clearRect(0, 0, w, h);
			return;
		}
		this.oImage = oImage;
		if (this.oImage.complete) {
			this.redraw();
		} else {
			this.oImage.addEventListener('load', this.redraw.bind(this));
		}
	}
});

O2.extendClass('MW.HUDLifeBar', UI.HUDElement, {
	
	n: 0,
	nMax: 0,
	
	sBGColor: 'rgba(0, 0, 0, 0.5)',
	sFGColor: 'rgb(255, 0, 0)',
	
	
	/**
	 * Redraw function
	 */
	redraw: function() {
		var nMax = this.nMax;
		var n = this.n;
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		c.fillStyle = this.sBGColor;
		c.clearRect(0, 0, w, h);
		c.fillRect(0, 0, w, h);
		c.fillStyle = this.sFGColor;
		c.fillRect(1, 1, n * (w - 2) / nMax | 0, h - 2);
	},
	
	
	/**
	 * mise à jour de la barre de vie
	 * @param n Point de vie en cour, si n est null cela signifie qu'on ne veut modifier que
	 * le nombre max de point de vie
	 * @param nMax nombre max de point de vie si ce nombre est null cela signifie que
	 * l'on veut modifier que le nombre courrant de point de vie
	 */
	update: function(n, nMax) {
		if (n === null) {
			n = this.n;
		}
		if (nMax === null) {
			nMax = this.nMax;
		}
		if (nMax && (this.n != n || this.nMax != nMax)) {
			this.nMax = nMax;
			this.n = n;
			this.redraw();
		}
	}
});

O2.extendClass('MW.HUDPing', UI.HUDElement, {

	aPings: null,

	redraw: function() {
		var aPings = this.aPings;
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var nValue;
		c.clearRect(0, 0, w, h);
		var nMax = Math.max.apply(null, aPings);
		var yMax = 2;
		var nRed = 0;
		var nGreen = 255;
		if (nMax > 64) {
			++yMax;
			nRed = 192;
		}
		if (nMax > 128) {
			++yMax;
			nRed = 255;
		}
		if (nMax > 256) {
			++yMax;
			nGreen = 128; 
		}
		if (nMax > 512) {
			++yMax;
			nGreen = 0; 
		}
		c.strokeStyle = 'rgb(' + nRed + ', ' + nGreen + ', 0)';
		c.fillStyle = '#FFF';
		c.textBaseLine = 'top';
		c.font = '9px monospace';
		var nSum = 0;
		for (var i = 0; i < aPings.length && i < w; ++i) {
			nValue = Math.min(16, aPings[i] >> yMax);
			nSum += aPings[i];
			c.beginPath();
			c.moveTo(i, 15);
			c.lineTo(i, 15 - nValue);
			c.stroke();
		}
		nSum /= aPings.length;
		nSum |= 0;
		c.strokeStyle = '#000';
		c.strokeText(nSum, 0, 10);
		c.fillText(nSum, 0, 10);
	},
	
	update: function(aPings) {
		this.aPings = aPings;
		this.redraw();
	}
});

O2.extendClass('MW.HUDTarget', UI.HUDElement, {
	
	nFontSize: 16,
	sName: '',
	aFGColor: null,
	aSGColor: null,
	bOver: false,
	
	__construct: function() {
		this.aFGColor = {r: 255, g: 255, b: 255, a: 1};
		this.aSGColor = {r: 0, g: 0, b: 0, a: 1};
	},
	
	setAlpha: function(fAlpha) {
		this.fAlpha = Math.min(1, Math.max(0, fAlpha));
		// var f = Math.min(1, Math.max(0, fAlpha));
		//this.aFGColor.a = f;
		//this.aSGColor.a = f;
	},
	
	getAlpha: function() {
		return this.fAlpha;		
	},
	
	fadeOut: function(f) {
		this.setAlpha(this.getAlpha() - f);
		return this.getAlpha() > 0;
	},
	
	setName: function(sName) {
		this.sName = sName;
		this.redraw();
	},
	
	redraw: function() {
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var sName = this.sName;
		c.clearRect(0, 0, w, h);
		c.font = 'bold ' + this.nFontSize + 'px courier';
		c.fillStyle = GfxTools.buildRGBA(this.aFGColor);
		c.strokStyle = GfxTools.buildRGBA(this.aSGColor);
		var nWidth = c.measureText(sName).width;
		c.textBaseLine = 'middle';
		var x = (w - nWidth) >> 1;
		var y = h >> 1;
		c.strokeText(sName, x, y);
		c.fillText(sName, x, y);
	},
	
	update: function(sName) {
		if (sName == this.sName) {
			// régénérer alpha au besoin
			if (this.getAlpha() < 1) {
				this.setAlpha(1);
				//this.redraw();
			}
		} else {
			// pas le même nom : mettre à jour
			if (sName == '') {
				// nouveau nom vide : faire fade out sur l'ancien
				this.fadeOut(0.1);
				this.redraw();
				if (this.getAlpha() === 0) {
					this.setName(sName);
				}
			} else {
				// nouveau nom
				this.setName(sName);
				this.setAlpha(1);
				this.redraw();
			}
		}
	}
});

/**
 * Thinker des mob controlés par le serveur
 */

O2.extendClass('MW.MobThinker', O876_Raycaster.CommandThinker, {

	oHazes: null,
	bDying: false,

	
	restore: function() {
		__inherited();
		this.bDying = false;
		var m = this.oMobile;
		m.oSprite.playAnimationType(this.ANIMATION_STAND);
		var oSounds = m.getData('sounds');
		if (oSounds && oSounds.spawn) {
			this.oGame.playSound(oSounds.spawn, m.x, m.y);
		}
	},

	die: function() {
		if (this.bDying) {
			return;
		}
		this.clearHaze();
		var m = this.oMobile;
		m.bVisible = true;
		m.oSprite.bTranslucent = false;
		var oSounds = m.getData('sounds');
		this.oGame.playSound(oSounds.die, m.x, m.y);
		this.bDying = true;
		__inherited();
	},
	
	/**
	 * Supprime tous les hazes
	 */
	clearHaze: function() {
		this.oHazes = null;
		this.oGame.setSpriteHaze(this.oMobile, null);
	},
	
	/**
	 * Applique un effet de Haze au mobile
	 * @param sHaze correspond au status qui génére le haze
	 * voir la table des HAZE_DATA
	 */
	setHaze: function(sHaze, nSet) {
		var aOverlay = [];
		var h, iHaze = '';
		if (this.oHazes === null) {
			h = {};
			this.oHazes = h;
			for (iHaze in MW.ATTRIBUTES_DATA) {
				h[iHaze] = 0;
			}
		} else {
			h = this.oHazes;
		}
		h[sHaze] = nSet;
		var hi, ad;
		for (iHaze in h) {
			if (iHaze in MW.ATTRIBUTES_DATA) {
				hi = h[iHaze];
				ad = MW.ATTRIBUTES_DATA[iHaze];
				if (hi > 0 && ad.pos.haze !== null) {
					aOverlay.push(ad.pos.haze);
				} else if (hi < 0 && ad.neg.haze !== null) {
					aOverlay.push(ad.neg.haze);
				}
			}
		}
		if (aOverlay.length) {
			this.oGame.setSpriteHaze(this.oMobile, aOverlay);
		} else {
			this.oGame.setSpriteHaze(this.oMobile, null);
		}
	}
});

/**
 * Thinker du personnage controlé par le joueur
 */

O2.extendClass('MW.PlayerThinker', O876_Raycaster.MouseKeyboardThinker, {
	
	VEIL_NONE: 0,
	VEIL_SNARE: 1,
	VEIL_ROOT: 2,
	VEIL_HOLD: 3,
	VEIL_REFLECT: 4,
	VEIL_CLOACKED: 5,
	VEIL_BLIND: 6,
	VEIL_VAMPYRE: 7,
	VEIL_POWER: 8,
	VEIL_WEAKNESS: 9,
	VEIL_MAGNET: 10,
	VEIL_DEFENSE: 11,
	
	fLastMovingAngle: 0,
	fLastMovingSpeed: 0,
	fLastTheta: 0,
	nLastUpdateTime: 0,
	xLast: 0,
	yLast: 0,

	fNormalSpeed: 0,
	nDeadTime: 0,
	nChargeStartTime: 0,
	nChargeTime: 0,
	oDeathVeil: null,
	oEffectVeil: null,
	oConfuseVeil: null,
	oBlindVeil: null,
	sKillerInfo: null, // information sur le mec qui nous a tué (son pseudo)
		
	oAttributes: null,
	
	bActive: true,
	
	__construct : function() {
		this.oAttributes = {};
		for (var sAttr in MW.ATTRIBUTES_DATA) {
			this.oAttributes[sAttr] = 0;
		}
		this.defineKeys( {
			forward : KEYS.ALPHANUM.Z,
			forward_w : KEYS.ALPHANUM.W,
			backward : KEYS.ALPHANUM.S,
			left : KEYS.ALPHANUM.Q,
			left_a : KEYS.ALPHANUM.A,
			right : KEYS.ALPHANUM.D,
			right_e : KEYS.ALPHANUM.E,
			use : KEYS.SPACE
		});
		this.think = this.thinkAlive;
	},

	
	/**
	 * Exprime les différents effet appliqués au mobile
	 * ordre de priorité
	 * 1: hold : paralysie complete
	 * 2: root : déplacement nul
	 * 3: snare : déplacement ralenti
	 */
	setupEffect: function(sAttribute, nValue) {
		if (sAttribute) {
			this.oAttributes[sAttribute] = nValue;
		}
		// SNARE & HASTE
		var nVeil = 0;
		var nSpeedModifier = this.oAttributes['speed'] | 0;
		var fSpeed = this.fNormalSpeed * Math.max(0, 1 + nSpeedModifier / 100);
		if (nSpeedModifier < 0) {
			nVeil = this.VEIL_SNARE;
		}
		// BLIND
		if (this.oAttributes['blind'] > 0) {
			if (this.oBlindVeil === null) {
				this.oBlindVeil = this.oGame.oRaycaster.oEffects.addEffect(new MW.GXBlind(this.oGame.oRaycaster));
			}
		} else {
			if (this.oBlindVeil !== null) {
				this.oBlindVeil.terminate();
				this.oBlindVeil = null;
			}
		}

		// CONFUSED
		if (this.oAttributes['confused'] > 0) {
			if (this.oConfuseVeil === null) {
				this.oConfuseVeil = this.oGame.oRaycaster.oEffects.addEffect(new MW.GXConfused(this.oGame.oRaycaster));
			}
		} else {
			if (this.oConfuseVeil !== null) {
				this.oConfuseVeil.terminate();
				this.oConfuseVeil = null;
			}
		}
		
		// DEFENSE
		if (this.oAttributes['defense'] > 0 || this.oAttributes['immortal'] > 0) {
			nVeil = this.VEIL_DEFENSE;
		} else if (this.oAttributes['defense'] < 0) {
			nVeil = this.VEIL_WEAKNESS;
		}
		
		
		// REFLECT
		if (this.oAttributes['reflect'] > 0) {
			nVeil = this.VEIL_REFLECT;
		}
		
		// INVISIBLE
		if (this.oAttributes['invisible'] > 0) {
			nVeil = this.VEIL_CLOAKED;
		}
		
		// VAMPYRE
		if (this.oAttributes['vampyre'] > 0) {
			nVeil = this.VEIL_VAMPYRE;
		}
		
		// POWER
		if (this.oAttributes['power'] > 0) {
			nVeil = this.VEIL_POWER;
		} else if (this.oAttributes['power'] < 0) {
			nVeil = this.VEIL_WEAKNESS;
		}
		
		// MAGNET
		if (this.oAttributes['magnet'] > 0) {
			nVeil = this.VEIL_MAGNET;
		}
		
		// ROOT
		if (this.oAttributes['root'] > 0) {
			fSpeed = 0;
			nVeil = this.VEIL_ROOT;
		}

		// HOLD
		if (this.oAttributes['hold'] > 0) {
			fSpeed = 0;
			nVeil = this.VEIL_HOLD;
		}
		
		this.oMobile.fSpeed = fSpeed;
		this.setupVeil(nVeil);
	},
	
	setupVeil: function(nEffect) {
		var r = this.oGame.oRaycaster;
		if (this.oEffectVeil !== null) {
			this.oEffectVeil.terminate();
			this.oEffectVeil = null;
		}
		switch (nEffect) {
			case this.VEIL_HOLD:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupHold();
				break;

			case this.VEIL_SNARE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupSnare();
				break;

			case this.VEIL_ROOT:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupRoot();
				break;
				
			case this.VEIL_BLIND:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXBlind(r));
				break;

			case this.VEIL_REFLECT:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupReflect();
				break;

			case this.VEIL_CLOAKED:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupInvisible();
				break;

			case this.VEIL_VAMPYRE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupVampyre();
				break;

			case this.VEIL_POWER:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupPower();
				break;

			case this.VEIL_WEAKNESS:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupWeakness();
				break;

			case this.VEIL_MAGNET:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupMagnet();
				break;

			case this.VEIL_DEFENSE:
				this.oEffectVeil = r.oEffects.addEffect(new MW.GXColorVeil(r));
				this.oEffectVeil.setupDefense();
				break;
		}
	},

	readMouseMovement: function(x, y) {
		if (this.isFree()) {
			this.oMobile.rotate(x / 166);
		}
	},
	
	/**
	 * Retransmet les mouvements au Game
	 * Pour qu'il les renvoie au serveur
	 */
	transmitMovement: function() {
		var bUpdate = false;
		var m = this.oMobile;
		// angle de caméra
		var f = m.fTheta;
		// position
		var x = m.x;
		var y = m.y;
		// vitesse
		var fms = m.fMovingSpeed;
		var fma = m.fMovingAngle;
		var nLUD = this.oGame.getTime() - this.nLastUpdateTime;
		if (nLUD > 500) {
			if (x != this.xLast || y != this.yLast) {
				this.xLast = x;
				this.yLast = y;
				bUpdate = true;
			}
		}
		if (bUpdate || this.fLastMovingSpeed != fms || this.fLastMovingAngle != fma || this.fLastTheta != f) {
			this.fLastMovingSpeed = fms;
			this.fLastMovingAngle = fma;
			this.fLastTheta = f;
			bUpdate = true;
		}
		if (bUpdate) {
			this.oGame.gm_movement(f, x, y, fma, fms);
			this.nLastUpdateTime = this.oGame.getTime();
		}
	},

	/**
	 * WTF on peux pas bouger !!!
	 */
	wtfRoot: function() {
		this.oGame.popupMessage(STRINGS._('~alert_wtf_root'), MW.ICONS.wtf_root);
	},
	
	wtfHeld: function() {
		this.oGame.popupMessage(STRINGS._('~alert_wtf_held'), MW.ICONS.wtf_held);
	},
	
	thinkAlive: function() {
		var m = this.oMobile;
		if (this.bActive) {
			this.updateKeys();
		}
		var nMask = 
			(this.aCommands.forward || this.aCommands.forward_w ? 8 : 0) |
			(this.aCommands.backward ? 4 : 0) |
			(this.aCommands.right || this.aCommands.right_e ? 2 : 0) |
			(this.aCommands.left || this.aCommands.left_a ? 1 : 0);
		if (nMask) {
			if (this.isHeld()) {
				this.wtfHeld();
				nMask = 0;
			} else if (this.isRooted()) {
				this.wtfRoot();
				nMask = 0;
			}
		}
		m.fMovingSpeed = 0;
		switch (nMask) {
			case 1: // left
				m.move(m.fTheta - PI / 2, m.fSpeed);
				this.checkCollision();
				break;
				
			case 2: // right
				m.move(m.fTheta + PI / 2, m.fSpeed);
				this.checkCollision();
				break;
				
			case 4: // backward
			case 7:
				m.move(m.fTheta, -m.fSpeed);
				this.checkCollision();
				break;

			case 5: // backward left
				m.move(m.fTheta - 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 6: // backward right
				m.move(m.fTheta + 3 * PI / 4, m.fSpeed);
				this.checkCollision();
				break;

			case 8: // forward
			case 11:
				m.move(m.fTheta, m.fSpeed);
				this.checkCollision();
				break;

			case 9: // forward-left
				m.move(m.fTheta - PI / 4, m.fSpeed);
				this.checkCollision();
				break;
				
			case 10: // forward-right
				m.move(m.fTheta + PI / 4, m.fSpeed);
				this.checkCollision();
				break;
		}
		this.transmitMovement();
	},

	/**
	 * Gestion des collision inter-mobile
	 */
	checkCollision: function() {
	  if (this.oMobile.oMobileCollision !== null) {
	    var oTarget = this.oMobile.oMobileCollision;
	    if (oTarget.getType() != RC.OBJECT_TYPE_MISSILE) {
	    	this.oMobile.rollbackXY();
	    	// augmenter la distance entre les mobiles qui collisionnent
	    	var me = this.oMobile;
	    	var mo = this.oMobile.oMobileCollision;
			var xme = me.x;
			var yme = me.y;
			var xmo = mo.x;
			var ymo = mo.y;
			var dx = xme - xmo;
			var dy = yme - ymo;
			var a = Math.atan2(dy, dx);
			var sdx = me.xSpeed;
			var sdy = me.ySpeed;
			me.move(a, 1);
			me.xSpeed += sdx;
			me.ySpeed += sdy;
	    }
	  }
	},
	
	/**
	 * Renvoie true si l'entity n'est pas sous l'emprise d'une paralysize complete
	 */
	isFree: function() {
		return this.oAttributes['hold'] <= 0;
	},
	
	isHeld: function() {
		return this.oAttributes['hold'] > 0;
	},
	
	/**
	 * Renvoie true si l'entity est rootée
	 */
	isRooted: function() {
		return this.oAttributes['root'] > 0;
	},


	button0Down: function() {
		if (this.isFree()) {
			this.oGame.gm_attack(0);
		} else {
			this.wtfHeld();
		}
		this.nChargeStartTime = this.oGame.getTime();
	},
	
	button0Up: function() {
		// charge time : maximum 10 seconds
		var nCharge = this.oGame.getTime() - this.nChargeStartTime;
		if (nCharge > 500) {
			if (this.isFree()) {
				this.oGame.gm_attack(this.oGame.getTime() - this.nChargeStartTime);
			} else {
				this.wtfHeld();
			}
		}
		this.oGame.gm_charge(0);
	},
	
	button0Command: function() {
		var nCharge = this.oGame.getTime() - this.nChargeStartTime;
		this.oGame.gm_charge(nCharge);
	},
	
	button2Down: function() {
		if (this.isFree()) {
			this.oGame.gm_useItem();
		} else {
			this.wtfHeld();
		}
	},

	useDown: function() {
		if (this.isFree()) {
			this.oGame.gm_activateWall();
		} else {
			this.wtfHeld();
		}
	},
	
	wheelUp: function() {
		this.oGame.gm_wheelUp();
	},

	wheelDown: function() {
		this.oGame.gm_wheelDown();
	},
	
	
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////
	////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH ////// LIFE AND DEATH //////

	die : function() {
		this.oMobile.xSpeed = 0;
		this.oMobile.ySpeed = 0;
		this.oMobile.bEthereal = true;
		this.think = this.thinkDying;
		this.nDeadTime = 18;
		var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
		oFadeOut.oColor = {
			r : 128,
			g : 0,
			b : 0
		};
		oFadeOut.fAlpha = 0;
		oFadeOut.fAlphaFade = 0.05;
		this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
	},
	
	revive: function() {
		this.oMobile.bEthereal = false;
		this.think = this.thinkAlive;
		if (this.oDeathVeil) {
			this.oDeathVeil.terminate();
			this.oDeathVeil = null;
		}
		this.sKillerInfo = '';
		this.aCommands[KEYS.MOUSE.BUTTONS.LEFT] = false;
		this.oGame.gm_charge(0);
	},
	
	thinkDying : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkDead;
			this.nDeadTime = 40;
			if (!this.oDeathVeil) {
				var oFadeOut = new O876_Raycaster.GXFade(this.oGame.oRaycaster);
				oFadeOut.oColor = {
					r : 128,
					g : 0,
					b : 0
				};
				oFadeOut.fAlpha = 0.95;
				oFadeOut.fAlphaFade = 0;
				this.oGame.oRaycaster.oEffects.addEffect(oFadeOut);
				this.oDeathVeil = oFadeOut;
			}
		}
	},
	
	thinkDead : function() {
		--this.nDeadTime;
		if (this.nDeadTime <= 0) {
			this.think = this.thinkWaitForRespawn;
			this.oGame.dialogRespawn();
			var ree = this.oGame.oRaycaster.oEffects.aEffects;
			var reei;
			for (var i = 0; i < ree.length; ++i) {
				reei = ree[i];
				if (reei.sClass) {
					if (reei.sClass === 'ColorVeil' || reei.sClass === 'Blind' || reei.sClass === 'Confused') {
						reei.terminate();
						reei.done();
					}
				}
			}
		}
	},
	
	thinkWaitForRespawn : function() {
	},
	
});

/**
 * Ce composant est un bouton cliquable avec un caption de texte Le bouton
 * change de couleur lorsque la souris passe dessus Et il possède 2 état
 * (normal/surbrillance)
 */
O2.extendClass('UI.Button', H5UI.Button, {

	__construct : function() {
		__inherited();
		this.oText.font.setFont('monospace');
		this.oText.font.setSize(8);
		this.setCaption(this.getCaption());
	}
});

O2.extendClass('UI.HUDClient', UI.HUDElement, {
	
	_sClass: '',
	
	sendData: function(action, data) {
		data.mod = this._sClass;
		data.action = action;
		this.oGame.csPluginMessage(data);
	}
});

/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * ProgressBar: barre de progression
 */

O2.extendClass('UI.ProgressBar', H5UI.Box, {
	_sClass: 'UI.ProgressBar',
	nMax: 100,
	nProgress: 0,
	oBar: null,
	sCaption: '',
	oCaption: null,
	
	__construct: function(oParams) {
		__inherited();
		this.setColor(UI.clDARK_WINDOW, UI.clDARK_WINDOW);
		this.setBorder(1, UI.clWINDOW_BORDER, UI.clWINDOW_BORDER);
		this.oBar = this.linkControl(new H5UI.Box());
		this.setBarColor(UI.clBAR);
		this.oCaption = this.linkControl(new H5UI.Text());
		this.oCaption.font.setFont('monospace');
		this.oCaption.font.setSize(12);
		this.oCaption.font.setColor(UI.clFONT);
		this.oCaption.setCaption(this.sCaption);
		this.oCaption.moveTo(8, 8);
	},

	/**
	 * Modifie la couleur de la barre
	 * @param c string couleur au format html5
	 * la bordure reste toutjour de la même couelur
	 */	
	setBarColor: function(c) {
		this.oBar.setColor(c, c);
		this.oBar.setBorder(1, UI.clWINDOW_BORDER, UI.clWINDOW_BORDER);
	},
	
	/**
	 * Défini la valeur max de la barre de progression
	 * @param n int
	 */
	setMax: function(n) {
		this._set('nMax', n);
	},
	
	/**
	 * Défini la progression en cour
	 * @param n int de 0 à nMax
	 */
	setProgress: function(n) {
		this._set('nProgress', n);
		this.oBar.setSize(Math.max(1, this.getWidth() * this.nProgress / this.nMax | 0), this.getHeight());
	},

	/**
	 * Défini le texte à afficher dans la barre de progression	
	 * @param sCaption string
	 */
	setCaption: function(sCaption) {
		this.oCaption.setCaption(sCaption);
	}
});


/** 
 * UI : Interface utilisateur
 * @author raphael marandet
 * @date 2013-01-01
 *
 * Window : Fenêtre d'affichage de base
 * Equippée d'un titre et d'une statusbar.
 */

O2.extendClass('UI.Window', H5UI.Box, {
	_sClass: 'UI.Window',
	_oStatusBar: null,
	_oCaptionBar: null,
	_nStatusBarHeight: 16,
	_fStatusBarFontFactor: 0.75,
	_nButtonWidth: 60,
	_nButtonPadding: 4,
	_aCmdButtons: null,
	
	/** 
	 * Les paramètres puvent contenir :
	 *   caption: string // titre de la fenetre
	 */
	__construct: function(oParams) {
		__inherited();
		this.setColor(UI.clWINDOW, UI.clWINDOW);
		this.setBorder(4, UI.clWINDOW_BORDER, UI.clWINDOW_BORDER);
		var oCaption = this.linkControl(new H5UI.Text());
		oCaption.font.setFont('monospace');
		oCaption.font.setStyle('bold');
		oCaption.font.setSize(12);
		oCaption.font.setColor(UI.clFONT);
		oCaption.setCaption(oParams.caption);
		oCaption.moveTo(8, 8);
		this._oCaptionBar = oCaption;
		this._aCmdButtons = [];
	},
	
	close: function() {
		G.ui_close();
	},

	/**
	 * Modification du titre
	 * @param s string
	 */	
	setTitleCaption: function(s) {
		this._oCaptionBar.setCaption(s);
	},
	
	/**
	 * Modification de la status bar
	 * La status bar sert à afficher des info complémentaire sur l'état de la fenetre
	 * Courrament utilisé pour afficher les touche de raccourci
	 * @param s string nouveau contenu du titre
	 */
	setStatusCaption: function(s) {
		if (this._oStatusBar === null) {
			var oMsg = this.linkControl(new H5UI.Text());
			oMsg._bWordWrap = false;
			oMsg._bAutosize = true;
			oMsg.font.setSize(this._nStatusBarHeight * this._fStatusBarFontFactor | 0);
			oMsg.font.setFont('arial');
			oMsg.font.setColor('#333333');
			this._oStatusBar = oMsg;
			this._oStatusBar.moveTo(8, this.getHeight() - this._nStatusBarHeight);
		}
		this._oStatusBar.setCaption(s);
		this.invalidate();
		this._oStatusBar.render();
	},
	
	/** 
	 * Ajoute une bar de command en bas de la fenetre
	 * un click sur un bouton lance la function "command"
	 */
	setCommands: function(a) {
		var aColors = [
		    [ UI.clWINDOW, '#BBBBBB' ], // gray
		    [ '#6666DD', '#BBBBFF' ], // blue
		    [ '#44DD44', '#BBFFBB' ], // green
		    [ '#44DDDD', '#BBFFFF' ], // cyan
		    [ '#DD4444', '#FFBBBB' ], // red
		    [ '#DD44DD', '#FFBBFF' ], // purple
		    [ '#DDDD44', '#FFFFBB' ] // yellow
		];
		var b, aColor, x = 0;
		for (var i = 0; i < a.length; ++i) {
			if (a[i] === null) {
				x += 16;
				continue;
			}
			b = this.linkControl(new UI.Button());
			b.setCaption(a[i][0]);
			b.setSize(this._nButtonWidth, this._nStatusBarHeight);
			b.oText.font.setSize(10);
			b.moveTo(x + this._nButtonPadding, this.getHeight() - this._nStatusBarHeight - this._nButtonPadding);
			aColor = aColors[a[i][2]];
			b.setColor(aColor[0], aColor[1]);
			b.onClick = a[i][1];
			x += this._nButtonWidth + this._nButtonPadding;
			this._aCmdButtons.push(b);
		}
	},
	
	/**
	 * Renvoie le bouton correspondant au param spécifié
	 * 0 = premier bouton, 1 = deuxième etc...
	 * @param n Numero du bouton
	 * @return objet Button
	 */
	getCommandButton: function(n) {
		return this._aCmdButtons[n];
	},
	
	
	
	/**
	 * Modifier la taille conduit à déplacer la status bar
	 */
	setSize: function(w, h) {
		__inherited(w, h);
		if (this._oStatusBar) {
			this._oStatusBar.moveTo(8, this.getHeight() - this._nStatusBarHeight);
		}
	}
});


O2.extendClass('O876_Raycaster.CameraKeyboardThinker', O876_Raycaster.KeyboardThinker,
{
	nRotationTime : 0,
	nRotationMask : 0,
	nRotationLeftTime : 0,
	nRotationRightTime : 0,
	
	fRotationSpeed: 0.1,

	ROTATION_MASK_LEFT : 0,
	ROTATION_MASK_RIGHT : 1,
	ROTATION_MASK_FORWARD : 2,
	ROTATION_MASK_BACKWARD : 3,

	__construct : function() {
		this.defineKeys( {
			forward : KEYS.UP,
			backward : KEYS.DOWN,
			left : KEYS.LEFT,
			right : KEYS.RIGHT,
			use : KEYS.SPACE,
			strafe : KEYS.ALPHANUM.C
		});
	},

	setRotationMask : function(nBit, bValue) {
		var nMask = 1 << nBit;
		var nNotMask = 255 ^ nMask;
		if (bValue) {
			this.nRotationMask |= nMask;
		} else {
			this.nRotationMask &= nNotMask;
			if (this.nRotationMask === 0) {
				this.nRotationTime = 0;
			}
		}
	},

	think: function() {
		this.updateKeys();
	},

	checkCollision: function() {
	  if (this.oMobile.oMobileCollision !== null) {
	    var oTarget = this.oMobile.oMobileCollision;
	    if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
	      this.oMobile.rollbackXY();
	    }
	  }
	},

	forwardCommand: function() {
		this.processRotationSpeed();
		this.oMobile.moveForward();
		this.checkCollision();
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},

	leftCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
		if (this.bStrafe) {
			this.oMobile.strafeLeft();
			this.checkCollision();
		} else {
			this.oMobile.rotateLeft();
		}
	},

	rightCommand: function() {
		this.processRotationSpeed();
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
		if (this.bStrafe) {
			this.oMobile.strafeRight();
			this.checkCollision();
		} else {
			this.oMobile.rotateRight();
		}
	},

	strafeDown: function() {
		this.bStrafe = true;
	},

	strafeUp: function() {
		this.bStrafe = false;
	},

	backwardCommand: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
		this.oMobile.moveBackward();
		this.checkCollision();
	},




	forwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	backwardDown: function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, true);
	},
	
	leftDown: function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, true);
	},
	
	rightDown: function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, true);
	},

	forwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	backwardUp : function() {
		this.setRotationMask(this.ROTATION_MASK_FORWARD, false);
	},

	leftUp : function() {
		this.setRotationMask(this.ROTATION_MASK_LEFT, false);
	},

	rightUp : function() {
		this.setRotationMask(this.ROTATION_MASK_RIGHT, false);
	},

	processRotationSpeed : function() {
		if (this.nRotationMask !== 0) {
			this.nRotationTime++;
			switch (this.nRotationTime) {
			case 1:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 4;
				break;

			case 4:
				this.oMobile.fRotSpeed = this.fRotationSpeed / 2;
				break;

			case 8:
				this.oMobile.fRotSpeed = this.fRotationSpeed;
				break;
			}
		}
	}
});

O2.extendClass('O876_Raycaster.CameraMouseKeyboardThinker', O876_Raycaster.MouseKeyboardThinker,
{
	nRotationTime : 0,
	nRotationMask : 0,
	nRotationLeftTime : 0,
	nRotationRightTime : 0,
	
	fRotationSpeed: 0.1,

	ROTATION_MASK_LEFT : 0,
	ROTATION_MASK_RIGHT : 1,
	ROTATION_MASK_FORWARD : 2,
	ROTATION_MASK_BACKWARD : 3,
	

	__construct : function() {
		this.defineKeys( {
			forward : KEYS.ALPHANUM.Z,
			forward2 : KEYS.ALPHANUM.W,
			backward : KEYS.ALPHANUM.S,
			left : KEYS.ALPHANUM.Q,
			left2 : KEYS.ALPHANUM.A,
			right : KEYS.ALPHANUM.D,
			use : KEYS.SPACE
		});
	},

	readMouseMovement: function(x, y) {
		this.oMobile.rotate(x / 166);
	},

	think: function() {
		this.updateKeys();
	},

	checkCollision: function() {
	  if (this.oMobile.oMobileCollision !== null) {
	    var oTarget = this.oMobile.oMobileCollision;
	    if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
	      this.oMobile.rollbackXY();
	    }
	  }
	},

	forwardCommand: function() {
		this.oMobile.moveForward();
		this.checkCollision();
	},

	leftCommand: function() {
		this.oMobile.strafeLeft();
		this.checkCollision();
	},

	forward2Command: function() {
		this.oMobile.moveForward();
		this.checkCollision();
	},

	left2Command: function() {
		this.oMobile.strafeLeft();
		this.checkCollision();
	},

	rightCommand: function() {
		this.oMobile.strafeRight();
		this.checkCollision();
	},

	backwardCommand: function() {
		this.oMobile.moveBackward();
		this.checkCollision();
	}
});

/** Interface de controle des mobile par clavier
 * O876 Raycaster project
 * @date 2012-01-01
 * @author Raphaël Marandet 
 * Se sert d'un device keyboard pour bouger le mobile.
 * Permet de tester rapidement la mobilité d'un mobile
 */
O2.extendClass('O876_Raycaster.KbdArrowThinker', O876_Raycaster.KeyboardThinker, {
	
	__construct: function() {
		this.defineKeys( {
			forward : KEYS.UP,
			backward : KEYS.DOWN,
			left : KEYS.LEFT,
			right : KEYS.RIGHT
		});
		
	},
	
	think: function() {
		this.oMobile.fSpeed = 4;
		this.oMobile.fRotSpeed = 0.1;
		this.updateKeys();
	},

	checkCollision: function() {
		  if (this.oMobile.oMobileCollision !== null) {
		    var oTarget = this.oMobile.oMobileCollision;
		    if (oTarget.oSprite.oBlueprint.nType != RC.OBJECT_TYPE_MISSILE) {
		      this.oMobile.rollbackXY();
		    }
		  }
	},

	forwardDown: function() {
		this.oMobile.oSprite.playAnimationType(1);
	},

	forwardUp: function() {
		this.oMobile.oSprite.playAnimationType(0);
	},
	
	forwardCommand: function() {
		this.oMobile.moveForward();
		this.checkCollision();
	},

	leftCommand: function() {
		this.oMobile.rotateLeft();
	},

	rightCommand: function() {
		this.oMobile.rotateRight();
	},

	backwardCommand: function() {
		this.oMobile.moveBackward();
		this.checkCollision();
	},
	
});


/** 
 * Fenetre de dialogue
 * les paramètre attendu sont :
 * message : contenu du message.
 * buttons : tableau de libellé de boutons
 * noescape : true -> la fenetre ne peut etre fermée par escape
 */
O2.extendClass('UI.DialogWindow', UI.Window, {
	nWidth: 256,
	nHeight: 128,
	nFontSize: 10,
	nPadding: 16,
	oParams: null,
	yText: 32,
	oText: null,
	
	__construct: function(oParams) {
		__inherited({caption: oParams.title});
		this.oParams = oParams;
		this.buildWindowContent();
	},
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(this.nPadding, this.yText);
		oText.setSize(this.nWidth - (this.nPadding * 2), this.nHeight - this.yText - this.nPadding);
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('monospace');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		this.oText.setCaption(this.oParams.message);
		this.setCommands(this.oParams.buttons);
	}
});


/**
 * HUDE Barre de chargement
 * C'est comme une barre de vie mais avec des couleur différente 
 * et un petit clignotement lorsque la barre est au maximum
 */
O2.extendClass('MW.HUDChargeBar', MW.HUDLifeBar, {
	
	/**
	 * mise à jour de la barre.
	 * Les quantités spécifiée sont compilé pour en faire une jolie barre de progression. 
	 * @param int n quantité actuelle
	 * @param int nMax quantité maximum 
	 */
	update: function(n, nMax) {
		if (n < nMax) {
			this.sFGColor = 'rgb(192, 64, 255)';
			__inherited(n, nMax);
		} else {
			var x = (64 * Math.sin(n / 50) + 64) | 0;
			this.sFGColor = 'rgb(192, ' + x.toString() + ', 255)';
			this.n = 0;
			__inherited(nMax, nMax);
		}
	}
});

O2.extendClass('MW.HUDSpellSelector', UI.HUDClient, {
	
	/**
	 * Le spell selector doit permettre de selectionner facilement et
	 * rapidement un sort dans une palette.
	 * La palette étant remplie de manière totalement aléatoire, le
	 * joueur ne peut pas se souvenir de l'ordre des sort et doit pouvoir voir
	 * l'ensemble de sort
	 */
	
	oImage: null,
	oText: null,
	aData: null,
	nIconSize: 32,
	aGiven: null,
	aCooldown: null,
	nDisplayed : -1,
	nMaxDisp: 7,
	sCooldownText: '',
	nLastDrawnIcon: 0,
	
	nLastActiveTime: 0, // last active time
	nCurrentTime: 0, // current game time
	
	/*
	draw: function() {
		if (this.oImage) {
			var c = this.oContext;
			var w = this.oCanvas.width;
			var h = this.oCanvas.height;
			c.drawImage(this.oImage, 0, 0, this.oImage.width, this.oImage.height, 0, 0, w, h);
		}
	},*/
	
	redraw: function() {
		this.update_display(null);
	},
	
	getItemName: function(n) {
		var d = this.aData[this.aGiven[n]];
		if (!d) {
			return null;
		}
		var nIcon = d[0];
		var sName = d[1];
		return [sName, nIcon];
	},
	
	
	update_declare: function(nId, nIcon, sResRef, sName) {
		if (this.aData === null) {
			this.aData = {};
		}
		if (this.aGiven === null) {
			this.aCooldown = [];
		}
		if (this.aCooldown === null) {
			this.aCooldown = [];
		}
		this.aData[sResRef] = [nIcon, sName];
	},
	
	
	update_cooldown: function(bForce) {
		// le cooldown
		var c = this.oContext;
		var nId = this.nDisplayed;
		if (nId < this.aCooldown.length) { // ya bien un cooldown pour l'objet en cours
			var nCD = this.aCooldown[nId]; 
			if (nCD >= this.nCurrentTime) { // coolingdown ?
				var sText;
				var nSec = 1 + (nCD - this.nCurrentTime) / 1000 | 0;
				if (nSec < 60) {
					sText = nSec.toString();
				} else {
					sText = (nSec / 60 | 0).toString() + 'm';
				}
				if (bForce || sText != this.sCooldownText) {
					this.sCooldownText = sText;
					c.fillStyle = '#FAA';
					c.strokeStyle = '#000';
					var x = 6, y = 48, w = 16, h = 12;
					c.fillRect(x, y, w, h);
					c.strokeRect(x, y, w, h);
					c.textBaseline = 'middle';
					c.font = '10px monospace';
					c.fillStyle = '#000';
					c.fillText(sText, x + ((w - c.measureText(sText).width) >> 1), y + (h >> 1) + 1);
					return true;
				}
			} else 	if (this.sCooldownText != '0') {
				// redessiner l'icone
				var nIS = this.nIconSize;
				var xf = this.nLastDrawnIcon * nIS;
				var h = this.oCanvas.height;
				c.drawImage(this.oImage, xf, 0, nIS, nIS, 0, h - nIS, nIS, nIS);
				this.sCooldownText = '0';
			}
		}
		return false;
	},
	
	
	update_display: function(nId) {
		var bFadeOut = false;
		var fAlpha = 0;
		if (nId === null) {
			if (this.nCurrentTime - this.nLastActiveTime > 1000) {
				this.update_cooldown();
				return;
			}
			nId = this.nDisplayed;
			// mais faire un fade out
			bFadeOut = true;
			var a1 = this.nCurrentTime - this.nLastActiveTime;
			fAlpha = (1000 - (a1 << 1) + 1000) / 1000;
			fAlpha = Math.max(0, Math.min(1, fAlpha));
		}
		var c = this.oContext;
		var w = this.oCanvas.width;
		var h = this.oCanvas.height;
		var nIS = this.nIconSize; 
		var nIS2 = nIS >> 1;
		var nIS22 = nIS2 + 2;
		
		c.clearRect(0, 0, w, h);
		
		if (!this.aGiven) {
			return;
		}

		// afficher dans le coin inferieur gauche l'icone
		nId = Math.max(0, Math.min(this.aGiven.length - 1, nId));
		if (!this.aData) {
			return;
		}
		var d = this.aData[this.aGiven[nId]];
		if (!d) {
			return;
		}
		var nIcon = d[0];
		var sName = d[1];
		var xf;
		var yBar = 10;
		var nOffset = 0;
		
		if (bFadeOut) {
			c.globalAlpha = fAlpha;
		}

		if (this.aGiven.length > this.nMaxDisp) {
			nOffset = Math.min(
					this.aGiven.length - this.nMaxDisp,
					Math.max(0, nId - (this.nMaxDisp >> 1))
			);
		}
		
		
		if (nId >= 0) {
			xf = nIS22 * (nId - nOffset) - 2;
			c.fillStyle = 'rgba(0, 0, 255, 0.666)';
			c.fillRect(xf, yBar - 2, nIS2 + 4, nIS2 + 4);
		}
		for (var iGiven = 0; iGiven < this.aGiven.length; ++iGiven) {
			xf = nIS * this.aData[this.aGiven[iGiven]][0];
			c.drawImage(this.oImage, xf, 0, nIS, nIS, (iGiven - nOffset) * nIS22, yBar, nIS2, nIS2);
		}
		if (bFadeOut) {
			c.globalAlpha = 1;
		}
		if (this.oText === null) {
			this.oText = new H5UI.Text();
			this.oText.setAutosize(false);
			this.oText.setWordWrap(true);
			this.oText.font.setFont('monospace');
			this.oText.font.setSize(10);
			this.oText.setSize(w - nIS - 4, nIS);
			this.oText.font._bOutline = true;
		}
		this.oText.setCaption(sName);
		this.oText.render();
		if (nId < 0) {
			return;
		}
		xf = nIS * nIcon;
		c.drawImage(this.oImage, xf, 0, nIS, nIS, 0, h - nIS, nIS, nIS);
		this.nLastDrawnIcon = nIcon;
		this.update_cooldown(true);
		
		c.drawImage(this.oText._oCanvas, nIS + 4, h - nIS);
		this.nDisplayed = nId;
	},
	
	update_display_next: function() {
		if (!this.aGiven) {
			return;
		}

		if (this.nDisplayed + 1 < this.aGiven.length) {
			this.update_display(this.nDisplayed + 1);
		} else {
			this.update_display(0);
		}
	},
	
	update_display_left: function() {
		this.update_display(this.nDisplayed - 1);
	},
	
	update_display_right: function() {
		this.update_display(this.nDisplayed + 1);
	},
	
	// commandes possibles
	// display int : affiche le spell spécifié
	// image obj : définition de l'image
	// declare int str : déclare le spell avec numéro d'indice et image
	update: function(sData, sCommand, nParam, nParam2) {
		if (sData) {
			var g = [];
			var oData = JSON.parse(sData);
			var aInv = oData.inv;
			var aNew = oData.newones;
			aInv.forEach(function(s) { 
				if (s) {
					g.push(s); // le resref de l'objet
				}
			});
			// GLOBALE G
			aNew.forEach(function(s) {
				G.popupMessage(STRINGS._('~item_pickup', [STRINGS._('~itm_' + s)]), MW.ICONS[s]);
			});
			this.aGiven = g;
			this.nLastActiveTime = this.nCurrentTime;
			this.update_display(this.nDisplayed);
			return;
		}
		switch (sCommand) {
			case 'next':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_next();
				break;
				
			case 'left':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_left();
				break;

			case 'right':
				this.nLastActiveTime = this.nCurrentTime;
				this.update_display_right();
				break;
				
			case 'time':
				this.nCurrentTime = nParam;
				this.update_display(null);
				break;
				
			case 'cooldown':
				this.aCooldown[nParam] = this.nCurrentTime + nParam2;
				break;
		}
	}
});

O2.extendClass('MW.MagicMissileThinker', MW.MobThinker, {
	ANIMATION_DEATH: 0,
	ANIMATION_WALK: 1,
	ANIMATION_STAND: 1,
	ANIMATION_ACTION: 1,
	
	restore: function() {
		__inherited();
		var m = this.oMobile;
		m.bEthereal = true;
		m.bSlideWall = false;
	},
	
	
	thinkAlive: function() {
		__inherited();
		var m = this.oMobile;
		var wc = m.oWallCollision;
		if (wc.x != 0 ||  wc.y != 0) {
			m.rollbackXY();
			this.die();
		}
	},
});
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
O2.extendClass('MW.ModAlchemy', UI.HUDClient, {
	
	aComponents: ['Viridian Leaf', 'Toadstool', 'Ruby Dust', 'Mandrake'],
	
	redraw: function() {
	},
	
	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ici : update(fAcc)  parce que le plugin-serveur appelle Instance::updateHud([entities], "accuracy", fAcc);
	 */
	update: function(action, data) {
		this['action_' + action](data);
	},
	
	action_start: function(data) {
		var w = new MW.WinAlchemy({
			components: data.components,
			onBrew: this.brew.bind(this)
		});
		this.oGame.sendSignal('ui_open', w);
	},
	
	action_loot: function(xData) {
		var nLoot = xData.n;
		var sLoot = this.aComponents[nLoot];
		this.oGame.popupMessage(STRINGS._('~item_pickup', [sLoot]), nLoot, 'alchemy_icons');
	},
	
	action_fail: function(xData) {
		switch (xData.w) {
			case 'invalid' :
				this.oGame.popupMessage('This is not a valid recipe. Try something else.', 6, 'alchemy_icons');
				break;
	
			case 'nocomp':
				this.oGame.popupMessage('You don\'t have the required components to craft this object.', 6, 'alchemy_icons');
				break;
		}
	},
	
	keyPress: function(k) {
		switch (k) {
			case KEYS.ALPHANUM.P:
				this.sendData('start', {});
			break;
		}
	},
	
	brew: function(nRecipe) {
		this.sendData('brew', {r: nRecipe});
		this.oGame.sendSignal('ui_close');
	}
});
O2.extendClass('MW.WinAlchemy', UI.Window, {
	nWidth: 256,
	nHeight: 128,
	oText: null,
	nPadding: 8,
	yText: 26,
	nFontSize: 9,
	
	oOptions: null,
	
	oCompGrid: null,

	__construct: function(oOptions) {
		__inherited({caption: 'Alchemy'});
		this.oOptions = oOptions;
		this.buildWindowContent();
	},
	
	
	buildWindowContent: function() {
		this.setSize(this.nWidth, this.nHeight);
		var oText = this.linkControl(new H5UI.Text());
		oText._bWordWrap = true;
		oText._bAutosize = false;
		oText.moveTo(this.nPadding, this.yText);
		oText.setSize(this.nWidth - this.nPadding - this.nPadding, this.nFontSize * 2 + 4);
		oText.font.setSize(this.nFontSize);
		oText.font.setFont('monospace');
		oText.font.setColor('#000000');
		oText._nLineHeight = 4;
		this.oText = oText;
		this.oText.setCaption('Select the components you want to mix, and click on "Brew".');
		
		var oComponents = new MW.CompGrid();
		var c = this.oOptions.components;
		oComponents._aCounters = [];
		for (var iComp in c) {
			oComponents._aCounters.push(c[iComp]);
		}
		this.linkControl(oComponents);
		oComponents.moveTo((this.nWidth - oComponents.getWidth()) >> 1, 56);
		this.oCompGrid = oComponents;
		
		this.setCommands([
		      ['Close', function() { G.sendSignal('ui_close'); }, 1],
		      ['Brew', this.brew.bind(this), 5]
		]);
	},
	
	brew: function() {
		var c = this.oCompGrid._aSelectedComp;
		
		var nBrew = c.reduce(function(nPrevious, nValue, x) {
			return nPrevious | ((nValue & 2) << x);
		}) >> 1;
		
		this.oOptions.onBrew(nBrew);
	}
});
O2.createObject('MW.PLUGINS_DATA.ModAlchemy', { 
	// ici "accuracy" est l'identifiant HUD utilisé par le plugin server pour donner des ordres au Widget
	className: 'MW.ModAlchemy', // classe HUDElement qui doit être utilisée 
	hud: { // position et dimension du widget
		x: 150,
		y: 0,
		width: 64, // taille de la surface de dessin
		height: 24
	},
	tiles: { // liste des ressources graphique (images, icones) utilisée par le widget
		alchemy_icons: {
			src: 'resources/gfx/icons/alchemy_icons.png',	// fichier image
			width: 32,	// taille de l'image
			height: 32,
			frames: 6,	// nombre de frames
			noshading: true // pas d'ombrage : économise la mémoire
		}
	}
});
O2.extendClass('MW.ModArena', UI.HUDClient, {
	
	aScores: null,
	
	displayScores: function() {
		var aData = this.aScores;
		if (!aData) {
			return;
		}
		aTable = aData.map(function(o) {
			return '<th class="name">' + o[0] + '</th>' + '<td class="kills">' + o[1] + '</td>' + '<td class="deaths">' + o[2] + '</td>';
		});
		var sHTML = '<div id="scoreContainer">' +
			'<style type="text/css" scoped="scoped">' +
				'div#scoreContainer {' +
					'height: 340px;' +
					'width: 100%;' +
					'overflow: auto;' +
				'}' +

				'div#scoreContainer > table.scores {' +
					'width: 100%;' +
					'font-family: monospace;' +
				'}' +

				'div#scoreContainer > table.scores > tbody th.name,'+ 
				'div#scoreContainer > table.scores > tbody td.kills,'+
				'div#scoreContainer > table.scores > tbody td.deaths {'+
					'background-color: #AAAAAA;'+
					'text-align: right;'+
					'font-size: 150%;'+
					'padding-right: 16px;'+
					'padding-left: 16px;'+
				'}' +
				'div#scoreContainer > table.scores > tbody td.deaths {' +
					'color: #800' +
				'}' +
			'</style>' +
			'<table class="scores"><thead><tr><th>Player</th><th>Kills</th><th>Deaths</th>' + 
			'</tr></thead><tbody><tr>' + aTable.join('</tr><tr>') + '</tr>' +
			'</tbody></table></div>' + 
			'<div align="right"><button type="button" onclick="MW.Microsyte.close();">Close</button></div>';
		this.oGame.gpDisplayHTMLMessage('Scores', sHTML);
	},
	
	
	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ici : update(fAcc)  parce que le plugin-serveur appelle Instance::updateHud([entities], "accuracy", fAcc);
	 */
	update: function(aScores, sEvent, sParam) {
		switch (sEvent) {
			case 'playerJoined':
				this.oGame.popupMessage(STRINGS._('~pop_player_joined', [sParam]));
			break;
				
			case 'playerLeft':
				this.oGame.popupMessage(STRINGS._('~pop_player_left', [sParam]));
			break;
			
			case 'endGame':
				this.oGame.sendSignal(
					'ui_dialog', 
					STRINGS._('~dlg_endgame_title'), 
					STRINGS._('~dlg_endgame_message', []), 
					[ 
						[ STRINGS._('~dlg_button_continue'), this.oGame.gpReconnect.bind(this.oGame), 1 ],
						[ STRINGS._('~dlg_button_scores'), this.displayScores.bind(this), 6 ] 
					]
				);
			break;
		}
		this.aScores = aScores;
		this.redraw();
	},
	
	redraw: function() {
		var c = this.oContext;
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		c.clearRect(0, 0, w, h);
		c.strokeStyle = 'black';
		c.fillStyle = 'white';
		c.font = '10px monospace';
		this.aScores.forEach(function(s, i) {
			var wn = c.measureText(s[0]).width;
			var ws = c.measureText(s[1]).width;
			c.strokeText(s[0], 96 - wn, i * 10 + 10);
			c.fillText(s[0], 96 - wn, i * 10 + 10);
			c.strokeText(s[1], 126 - ws, i * 10 + 10);
			c.fillText(s[1], 126 - ws, i * 10 + 10);
		});
	}
});
O2.createObject('MW.PLUGINS_DATA.ModArena', { 
	// ici "accuracy" est l'identifiant HUD utilisé par le plugin server pour donner des ordres au Widget
	className: 'MW.ModArena', // classe HUDElement qui doit être utilisée 
	hud: { // position et dimension du widget
		x: -4,
		y: 4,
		width: 128, // taille de la surface de dessin
		height: 128
	},
	tiles: {}
});

STRINGS.en.dlg_endgame_title = 'Game over';
STRINGS.en.dlg_endgame_message = 'The server has ended the game. Are you ready for another game ?';
STRINGS.en.dlg_button_scores = 'See scores';
STRINGS.en.pop_player_joined = '$0 has joined the game.';
STRINGS.en.pop_player_left = '$0 has left the game.';
