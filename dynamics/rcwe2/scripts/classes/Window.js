/**
 * Widget de base
 */
O2.createClass('RCWE.Window', {

	_oContainer: null,
	_oBody: null,
	_oToolBar: null,
	
	/**
	 * Fabrique le container
	 * Défini le titre de la fenetre
	 */
	build: function(sTitle) {
		var $oContainer = $(
		'<table class="o876structure o876window">' +
		'	<tbody>' +
		'		<tr class="titlebar">' +
		'			<td><div><h1>' + sTitle + '</h1></div></td>' +
		'		</tr>' +
		'		<tr class="toolbar">' +
		'			<td><div></div></td>' +
		'		</tr>' +
		'		<tr class="body floatingHeight">' +
		'			<td class="floatingWidth">' +
		'				<div class="body">' +
		'				</div>' +
		'			</td>' +
		'		</tr>' +
		'	</tbody>' +
		'</table>');
		this._oContainer = $oContainer;
		this._oBody = $('div.body', $oContainer);
		this._oToolBar = $('tr.toolbar > td > div', $oContainer);
	},
	
	/**
	 * Renvoie le container.
	 * return jquery object
	 */
	getContainer: function() {
		return this._oContainer;
	},
	
	getBody: function() {
		return this._oBody;
	},

	/**
	 * Renvoie la tool bar de maniètre a pouvoir y ajouter des boutons
	 */
	getToolBar: function() {
		return this._oToolBar;
	},
	
	/**
	 * Change the widget size
	 * @param w string or int width in pixel or css format
	 * @param h string or int height in pixel or css format
	 */
	setSize: function(w, h) {
		if (h === '100%') {
			$('tr.body').addClass('floatingHeight');
		} else {
			$('tr.body').removeClass('floatingHeight');
		}
		if (typeof w === 'number') {
			w = w.toString() + 'px';
		}
		if (typeof h === 'number') {
			h = h.toString() + 'px';
		}
		this._oContainer.css({
			width: w,
			height: h
		});
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
