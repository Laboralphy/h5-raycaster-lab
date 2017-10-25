/**
 * Created by ralphy on 19/05/17.
 */

O2.extendClass('UI.ScorePad', H5UI.Text, {
    _sClass: 'UI.ScorePad',
    nDispScore: null,

    __construct: function() {
        __inherited();
        this.setAutosize(true);
        this.setWordWrap(false);
        this.setFontColor('#FFF', '#000');
        this.setFontFace('monospace');
        this.setFontSize(12);
        this.setFontStyle('bold');
        this.setCaption('xxxxxxxxxx');
    },

    update: function(oLogic) {
        if (oLogic._nScore !== this.nDispScore) {
            if (Math.abs(this.nDispScore - oLogic._nScore) <= 2) {
                this.nDispScore = oLogic._nScore;
            } else {
                this.nDispScore = (this.nDispScore + oLogic._nScore) >> 1;
            }
            this.setCaption(this.nDispScore.toString().padStart(10, ' '));
        }
    }
});
