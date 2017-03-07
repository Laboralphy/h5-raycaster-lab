/**
 * @class O876_Raycaster.ImageListLoader
 * Précharge une liste d'image
 * Surveille le chargement des images
 * Envoie un évènement final lorsque les images sont toutes chargées
 */
O2.createClass('O876_Raycaster.ImageListLoader', {
	aImg: null,
	bAllLoaded: false,

	__construct: function() {
		this.aImg = [];
	},

    /**
	 * Ajoute une image à la liste
     * @param sSrc url de l'image
     */
	addImage: function(sSrc) {
		this.aImg.push({
			src: sSrc,
			img: null
		});
	},

    /**
	 * Chargement d'une image
     * @param oImgItem.src source de l'image
	 * @param oImgItem.img HTMLImage qui recevra le cojntenu de l'image (quand celle ci sera chargée)
     */
	loadOne: function(oImgItem) {
		let sSrc = oImgItem.src;
		let oImg;
		if (sSrc instanceof HTMLImageElement) {
			oImg = sSrc;
		} else if (sSrc instanceof HTMLCanvasElement) {
			oImg = sSrc;
			oImg.complete = true;
		} else {
			oImg = new Image();
			oImg.src = sSrc; 
		}
		oImgItem.img = oImg;
		if (!oImg.complete) {
			oImg.addEventListener('load', e => this.imageLoaded(e));
		}
	},

    /**
	 * Charge toutes les images précédement ajoutée par addImage
     */
	loadAll: function() {
		this.aImg.forEach(i => this.loadOne(i));
		this.imageLoaded();
	},

    /**
	 * Callback appelé quand une image est chargée
     * @param oEvent
     */
	imageLoaded: function(oEvent) {
		if (this.bAllLoaded) {
			return;
		}
		if (this.aImg.every(i => i.img.complete)) {
			this.bAllLoaded = true;
			this.trigger('load', this.aImg.map(x => x.img));
		}
	}
});

O2.mixin(O876_Raycaster.ImageListLoader, O876.Mixin.Events);