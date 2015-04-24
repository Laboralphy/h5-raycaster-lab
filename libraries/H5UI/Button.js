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
