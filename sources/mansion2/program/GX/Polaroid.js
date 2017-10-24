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

    __construct: function(oRaycaster) {
        __inherited(oRaycaster);
        this.nPhase = 0;
        var cvs = O876.CanvasFactory.getCanvas(this.WIDTH, this.HEIGHT);
        var ctx = cvs.getContext("2d");
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.oCanvas = cvs;
    },

    setPhotos: function(oFromPhoto, oToPhoto) {
        this.oFromPhoto = oFromPhoto;
        this.oToPhoto = oToPhoto;
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
            console.log('phase', this.nPhase);
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
                    this.WIDTH,
                    this.HEIGHT
                );
                ctx.globalAlpha = this.fAlpha;
                ctx.drawImage(
                    this.oToPhoto,
                    0,
                    0,
                    this.oToPhoto.width,
                    this.oToPhoto.height,
                    0,
                    0,
                    this.WIDTH,
                    this.HEIGHT
                );
                this.fade(0.01);
                this.nextPhase(100);
                break;

            case this.PHASE_SECOND_TO_TRANS: // oToPhoto vers transparence
                this.nextPhase(1);
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

        switch (this.nPhase) {
            case this.PHASE_TRANS_TO_BLACK:
            case this.PHASE_SECOND_TO_TRANS:
                var fSaveAlpha = ctx.globalAlpha;
                ctx.globalAlpha = this.fAlpha;
                ctx.drawImage(cvs, (rcw - this.WIDTH) >> 1, (rch - this.HEIGHT) >> 1);
                ctx.globalAlpha = fSaveAlpha;
                break;

            case this.PHASE_BLACK_TO_FIRST:
            case this.PHASE_FIRST_TO_SECOND:
                ctx.drawImage(cvs, (rcw - this.WIDTH) >> 1, (rch - this.HEIGHT) >> 1);
                break;
        }



    },

    /** Fonction appelée lorsque l'effet se termine de lui même
     * ou stoppé par un clear() du manager
     */
    done: function() {
        this.terminate();
    },

    /** Permet d'avorter l'effet
     * Il faut coder tout ce qui est nécessaire pour terminer proprement l'effet
     * (restauration de l'état du laby par exemple)
     */
    terminate: function() {
        this.nPhase = 4;
    }
});

