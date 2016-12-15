/**
 * Surveille le chargement de diverse images
 * Envoiue un évènement final lorsque les images sont toutes chargées
 */
O2.createClass('O876_Raycaster.ImageListLoader', {
	aImg: null,
	bAllLoaded: false,

	__construct: function() {
		this.aImg = [];
	},

	addImage: function(sSrc) {
		this.aImg.push({
			src: sSrc,
			img: null
		});
	},

	loadOne: function(oImgItem) {
		var sSrc = oImgItem.src;
		var oImg;
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

	loadAll: function() {
		this.aImg.forEach(i => this.loadOne(i));
		this.imageLoaded();
	},

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