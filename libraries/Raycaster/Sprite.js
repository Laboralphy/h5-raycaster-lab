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
	aLastRender: null, // mémorise les dernier paramètres de rendu


	/**
	 * Change l'animation en cours
	 * 
	 * @param n {Number} numero de la nouvelle animation
	 */
	playAnimation : function(n) {
		if (n === this.nAnimation) {
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
