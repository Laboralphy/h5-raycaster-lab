/**
 * Intro Effect
 * Display photos that hav been just taken
 */
O2.extendClass('MANSION.GX.Polaroid', O876_Raycaster.GXEffect, {
    sClass: 'Polaroid',
    nPhase: 0,
    nTime: 0,

    WIDTH: 256,
    HEIGHT: 160,

    oCanvas: null,
    oFromPhoto: null,
    oToPhoto: null,

    fAlpha: 0,

    PHASE_TRANS_TO_BLACK: 0,
    PHASE_BLACK_TO_FIRST: 1,
    PHASE_FIRST_TO_SECOND: 2,
    PHASE_SECOND_TO_TRANS: 3,

    aCircles: null,

    __construct: function(oRaycaster) {
        __inherited(oRaycaster);
        this.nPhase = 0;
        var cvs = O876.CanvasFactory.getCanvas(this.WIDTH, this.HEIGHT);
        var ctx = cvs.getContext("2d");
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.oCanvas = cvs;
        var fFactor = 0.5;
        this.aCircles = [
			{
				x: Math.random() * 100 | 0,
				y: Math.random() * 100 | 0,
				s: 1 * fFactor, // vitesse
				a: 0.08 * fFactor, // acceleration
				r: 0, // radius init
                d: 0
			},
			{
				x: Math.random() * 100 | 0,
				y: Math.random() * 100 | 0,
				s: 1 * fFactor, // vitesse
				a: 0.1 * fFactor, // acceleration
				r: 0, // radius init
				d: Math.random() * 10 + 10,
			},
			{
				x: Math.random() * 100 | 0,
				y: Math.random() * 100 | 0,
				s: 1 * fFactor, // vitesse
				a: 0.12 * fFactor, // acceleration
				r: 0, // radius init
				d: Math.random() * 10 + 15,
			},
			{
				x: Math.random() * 100 | 0,
				y: Math.random() * 100 | 0,
				s: 1 * fFactor, // vitesse
				a: 0.14 * fFactor, // acceleration
				r: 0, // radius init
				d: Math.random() * 10 + 20,
			},
        ];
    },

    setPhotos: function(oFromPhoto, oToPhoto) {
        this.oFromPhoto = oFromPhoto;
        this.oToPhoto = oToPhoto;
    },

	/**
     * La fonction spécifée se déclenche après la fin de l'effet
	 */
	whenDone: function(p) {
	    this.done = p;
    },

    /**
     * Cette fonction doit renvoyer TRUE si l'effet est fini
     * @return boolean
     */
    isOver: function() {
        return this.nPhase > this.PHASE_SECOND_TO_TRANS;
    },

    /**
     * Change l'alpha
     */
    fade: function(f) {
        this.fAlpha = Math.min(1, Math.max(0, this.fAlpha + f));
    },

    /**
     * Change de phase quand le timer atteint la valeur spécifiée
     * @param n
     */
    nextPhase: function(n) {
        if (++this.nTime >= n) {
            ++this.nPhase;
            this.nTime = 0;
            return true;
        } else {
            return false;
        }
    },


    /** Fonction appelée par le gestionnaire d'effet pour recalculer l'état de l'effet
     */
    process: function() {
        var cvs = this.oCanvas;
        var ctx = cvs.getContext('2d');
        var W = this.WIDTH;
        var H = this.HEIGHT;
        switch (this.nPhase) {
            case this.PHASE_TRANS_TO_BLACK: // transparent vers noir
                this.fade(0.1);
                this.nextPhase(10);
                break;

            case this.PHASE_BLACK_TO_FIRST: // noir vers oFromPhoto
                ctx.drawImage(
                    this.oFromPhoto,
                    0,
                    0,
                    this.oFromPhoto.width,
                    this.oFromPhoto.height,
                    0,
                    0,
                    this.WIDTH,
                    this.HEIGHT
                );
                ctx.fillStyle = 'rgba(0, 0, 0, ' + this.fAlpha.toString() + ')';
                ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                this.fade(-0.02);
                this.nextPhase(70);
                break;

            case this.PHASE_FIRST_TO_SECOND: // oFromPhoto vers oToPhoto
                ctx.drawImage(
                    this.oFromPhoto,
                    0,
                    0,
                    this.oFromPhoto.width,
                    this.oFromPhoto.height,
                    0,
                    0,
                    W,
                    H
                );
				ctx.strokeStyle = 'rgb(192, 0, 0)';
				ctx.lineWidth = 4;
				ctx.beginPath();
				this.aCircles.forEach(function(c) {
				    --c.d;
                });
				var aCircles = this.aCircles.filter(function(c) {
				    return c.d <= 0;
                });
				aCircles.forEach(function(c) {
					c.s += c.a;
					c.r += c.s;
					ctx.moveTo(W * c.x / 100 | 0, H * c.y / 100 | 0);
					ctx.arc(W * c.x / 100 | 0, H * c.y / 100 | 0, c.r + 2| 0, 0, Math.PI * 2);
				});
				ctx.stroke();
                ctx.save();
				ctx.beginPath();
                aCircles.forEach(function(c) {
                    ctx.moveTo(W * c.x / 100 | 0, H * c.y / 100 | 0);
                    ctx.arc(W * c.x / 100 | 0, H * c.y / 100 | 0, c.r | 0, 0, Math.PI * 2);
                });
                ctx.clip();
				ctx.drawImage(
					this.oToPhoto,
					0,
					0,
					this.oToPhoto.width,
					this.oToPhoto.height,
					0,
					0,
					W,
					H
				);
				ctx.restore();
                if (this.nextPhase(150)) {
                    this.fade(1);
                }
                break;

            case this.PHASE_SECOND_TO_TRANS: // oToPhoto vers transparence
				this.fade(-0.1);
				this.nextPhase(10);
                break;
        }
    },

    /** Fonction appelée par le gestionnaire d'effet pour le rendre à l'écran
     */
    render: function() {
        var cvs = this.oCanvas;
        var ctx = this.oRaycaster.getRenderContext();
        var rcvs = this.oRaycaster.getRenderCanvas();
        var rcw = rcvs.width;
        var rch = rcvs.height;

        // filler
		var fAlpha = this.fAlpha;
        var xs = (rcw - this.WIDTH) >> 1;
        var ys = (rch - this.HEIGHT) >> 1;
        var nPadding = 8;
		ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
		ctx.fillRect(0, 0, rcvs.width, rcvs.height);

		var fSaveAlpha;

        switch (this.nPhase) {
			case this.PHASE_TRANS_TO_BLACK:
				fSaveAlpha = ctx.globalAlpha;
				ctx.globalAlpha = fAlpha;
				ctx.fillStyle = 'rgba(255, 255, 255, ' + fAlpha + ' )';
				ctx.fillRect(xs - nPadding, ys - nPadding + (32 * (1 - fAlpha) | 0), cvs.width + nPadding * 2, cvs.height + nPadding * 2);
				ctx.clearRect(xs, ys + (32 * (1 - fAlpha) | 0), cvs.width, cvs.height);
				ctx.drawImage(cvs, xs, ys + (32 * (1 - fAlpha) | 0));
				ctx.globalAlpha = fSaveAlpha;
				break;

			case this.PHASE_BLACK_TO_FIRST:
            case this.PHASE_FIRST_TO_SECOND:
				ctx.fillStyle = 'rgb(255, 255, 255)';
				ctx.fillRect(xs - nPadding, ys - nPadding, cvs.width + nPadding * 2, cvs.height + nPadding * 2);
                ctx.drawImage(cvs, xs, ys);
                break;

			case this.PHASE_SECOND_TO_TRANS:
				fSaveAlpha = ctx.globalAlpha;
				ctx.globalAlpha = fAlpha;
				ctx.fillStyle = 'rgba(255, 255, 255, ' + fAlpha + ' )';
				ctx.fillRect(xs - nPadding, ys - nPadding + (32 * (1 - fAlpha) | 0), cvs.width + nPadding * 2, cvs.height + nPadding * 2);
				ctx.clearRect(xs, ys + (32 * (1 - fAlpha) | 0), cvs.width, cvs.height);
				ctx.drawImage(cvs, xs, ys + (32 * (1 - fAlpha) | 0));
				ctx.globalAlpha = fSaveAlpha;
				break;
		}
    },

    /** Fonction appelée lorsque l'effet se termine de lui même
     * ou stoppé par un clear() du manager
     */
    done: function() {},

    /** Permet d'avorter l'effet
     * Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
     * (restauration de l'état du laby par exemple)
     */
    terminate: function() {
        this.nPhase = 4;
    }
});

