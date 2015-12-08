/**
 * Fenetre de base
 */
O2.createClass('RCWE.Window', {

	_oContainer: null,
	_oToolBar: null,
	
	/**
	 * Fabrique le container
	 * Défini le titre de la fenetre
	 */
	build: function(sTitle) {
		var $oContainer = $('<div class="window"><h1>' + sTitle + '</h1></div>');
		var $oToolBar = $('<div class="toolbar"></div>');

		$oContainer.append($oToolBar);
		
		this._oContainer = $oContainer;
		this._oToolBar = $oToolBar;
	},
	
	/**
	 * Renvoie le container.
	 * return jquery object
	 */
	getContainer: function() {
		return this._oContainer;
	},

	/**
	 * Renvoie la tool bar de maniètre a pouvoir y ajouter des boutons
	 */
	getToolBar: function() {
		return this._oToolBar;
	},
	
	/**
	 * Ajoute un bouton dans la barre de toolbar
	 * @param sCaption string texte affiché sur le bouton
	 * @param sHint info bulle associé au bouton
	 * @param pOnClick fonction associé au click du bouton
	 * @return objet Jquery créé
	 */
	addCommand: function(sCaption, sHint, pOnClick, sId) {
		var b = $('<button type="button"></button>');
		b.html(sCaption);
		b.attr('title', sHint);
		b.bind('click', pOnClick);
		if (sId) {
			b.attr('id', sId);
		}
		this.getToolBar().append(b);
		return b;
	},
});
