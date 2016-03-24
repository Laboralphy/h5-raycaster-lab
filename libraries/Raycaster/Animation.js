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
			if (this.nLoop === 3) {
				this.nIndex = Math.random() * this.nCount | 0;
			} else {
				this.nIndex += this.nDirLoop;
			}
		}
		// pour les éventuels très gros dépassement de duration (pas de boucle)
		if (this.nTime >= this.nDuration) {
			this.nIndex += this.nDirLoop * (this.nTime / this.nDuration | 0);
			this.nTime %= this.nDuration;
		}
		
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
