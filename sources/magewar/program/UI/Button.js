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
