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
