/**
 * This Factory produces Image which are visual representation of tags
 */
O2.extendClass('RCWE.TagFactory', RCWE.Factory, {

	/**
	 * The factory key is the tag itself
	 * @param string tag
	 * @return string
	 */
	_getItemKey: function(sTag) {
		return sTag;
	},


	/**
	 * Render a tag
	 * @param string tag
	 */
	_draw: function(oCanvas, sTag) {
		if (sTag) {
            var oContext = oCanvas.getContext('2d');
            oContext.font = 'monospace 8px';


            // dessiner les signes complémentaires
            var bSign = false;

            sTag
                .split(';')
                .map(function(t) {
                    return t.trim();
                }).filter(function(t) {
                return t.substr(0, 1) === '#';
            }).map(function(t) {
                return t.substr(1);
            }).forEach(function(ht) {
                bSign = true;
                ht = ht.split(' ').shift();
                var sForm = ht.substr(0, 1);
                var sColor = ht.substr(1);
                sColor = sColor | 0;
                var aCOLORS = [
                    '#F00',
                    '#F80',
                    '#FF0',
                    '#8F0',
                    '#0F0',
                    '#0FF',
                    '#08F',
                    '#00F',
                    '#80F',
                    '#F0F',
                    '#F8F',
                    '#FFF'
                ];
                var w = oCanvas.width;
                var w2 = w >> 1;
                var w4 = w >> 2;
                var w8 = w >> 3;
                oContext.fillStyle = aCOLORS[sColor % aCOLORS.length];
                oContext.strokeStyle = aCOLORS[(sColor + (aCOLORS.length >> 1)) % aCOLORS.length];
                switch (sForm) {
                    case 'a': // cercle
                        oContext.beginPath();
                        oContext.arc(w2, w2, w4, 0, Math.PI * 2);
                        oContext.closePath();
                        oContext.fill();
                        oContext.stroke();
                        break;

                    case 'b': // carré
                        oContext.fillRect(w4, w4, w2, w2);
                        oContext.strokeRect(w4, w4, w2, w2);
                        break;

                    case 'c': // losange
                        oContext.beginPath();
                        oContext.moveTo(w2, w4 - w8);
                        oContext.lineTo(w2 + w4, w2);
                        oContext.lineTo(w2, w2 + w4 + w8);
                        oContext.lineTo(w4, w2);
                        oContext.closePath();
                        oContext.fill();
                        oContext.stroke();
                        break;

                    case 'd': // keyhole
                        oContext.beginPath();
                        oContext.moveTo(w2, w4 + w8);
                        oContext.lineTo(w2 + w4, w2 + w4 + w8);
                        oContext.lineTo(w4, w2 + w4 + w8);
                        oContext.lineTo(w2, w4 + w8);
                        oContext.arc(w2, w4 + w8, w8, 0, Math.PI * 2);
                        oContext.closePath();
                        oContext.fill();
                        oContext.stroke();
                        break;


                    case 'e': // +
                        oContext.fillRect(w4 + w8, w4, w4, w2);
                        oContext.fillRect(w4, w4 + w8, w2, w4);
                        break;
                }
            }, this);

            oContext.fillStyle = '#FFFF00';
            oContext.strokeStyle = '#000000';


            if (!bSign) {
                var aTag = sTag.split(' ');
                oContext.strokeText(aTag[0], 0, 10);
                oContext.fillText(aTag[0], 0, 10);
                var sTagLine = aTag.slice(1).join(' ');
                oContext.strokeText(sTagLine, 0, 22);
                oContext.fillText(sTagLine, 0, 22);
            }
		}
	}
});
