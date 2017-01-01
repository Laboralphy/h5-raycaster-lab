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
		this.oBar.setSize(Math.max(1, this.width() * this.nProgress / this.nMax | 0), this.height());
	},

	/**
	 * Défini le texte à afficher dans la barre de progression	
	 * @param sCaption string
	 */
	setCaption: function(sCaption) {
		this.oCaption.setCaption(sCaption);
	}
});

