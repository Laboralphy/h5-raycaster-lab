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
