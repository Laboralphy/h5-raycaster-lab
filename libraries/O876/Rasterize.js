/**
 * This class will rasterize any XHTML document (including images
 * and stylesheets) into a canvas.
 * The document must be valid XHTML
 *
 * Some tags, referencing external resources, will be transformed :
 *
 * The <style> tag is allowed and will be "scoped"
 * If the <style> tag has an "src" attribute,pointing to an external file 
 * then the corresponding file will be ajaxed and included in the style tag.
 *
 * Same goes for the <img> tag. If an "src" attribute referencing external
 * image is present, then the corresponding image will be loaded, converted
 * to base 64 data url, and the "src" file will be updated.
 *
 * In order to properly rasterize a document, 
 * the following parameters must be specified
 * - the
 *
 */
O2.createClass('O876.Rasterize', {


	xhr: null,
	BASEPATH: '',

	__construct: function() {
		this.xhr = new O876.XHR();
	},

	_get: function(sFile, cb) {
		this.xhr.get(this.BASEPATH + sFile, cb);
	},


	_renderToCanvas: function(xElement, oCanvas, pDone) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var ctx = oCanvas.getContext('2d');
		var xs = new XMLSerializer();
		var sHTML = xs.serializeToString(xElement.documentElement);
		var sSVG = ([
	'	<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
	'		<foreignObject width="100%" height="100%">',
	'			<style scoped="scoped">',
	'div.rasterized-body {',
	'	width: 100%; ',
	'	height: 100%; ',
	'	overflow: hidden;',
	'	background-color: transparent;',
	'	color: black;',
	'	font-family: monospace;',
	'	font-size: 8px;',
	'}',
	'',
	'			</style>',
	'			<div class="rasterized-body" xmlns="http://www.w3.org/1999/xhtml">',
	             sHTML,
	           '</div>',
	         '</foreignObject>',
	       '</svg>'
	    ]).join('\n');
		var img = new Image();
		var svg = new Blob([sSVG], {type: 'image/svg+xml;charset=utf-8'});
		var url = URL.createObjectURL(svg);
		img.addEventListener('load', function() {
		    ctx.drawImage(img, 0, 0);
		    URL.revokeObjectURL(url);
		    pDone();
		});
		img.setAttribute('src', url);
	},

	_convertToBase64: function(imgSrc, img, cb) {
		var cvs = document.createElement('canvas');
		cvs.width = imgSrc.naturalWidth; 
		cvs.height = imgSrc.naturalHeight;
		var ctx = cvs.getContext('2d');
		ctx.drawImage(imgSrc, 0, 0);
		img.setAttribute('src', cvs.toDataURL());
	},


	_processImg: function(img, cb) {
		var oImage = new Image();
		var pEvent = (function(oEvent) {
			this._convertToBase64(oImage, img);
			cb();
		}).bind(this);
		oImage.addEventListener('load', pEvent);
		oImage.src = img.getAttribute('src');
	},

	_processStyle: function(style, cb) {
		var sSrc = style.getAttribute('src');
		if (!sSrc) {
			cb();
			return;
		}
		style.removeAttribute('src');
		style.setAttribute('type', 'text/css');
		this._get(sSrc, function(data, err) {
			style.appendChild(document.createTextNode(data));
			cb();
		});
	},


	_processQueue: function(q, cb) {
		var x = q.shift();
		if (x) {
			switch (x[0]) {
				case 'style':
					this._processStyle(x[1], (function() {
						this._processQueue(q, cb);
					}).bind(this));
				break;

				case 'img':
					this._processImg(x[1], (function() {
						this._processQueue(q, cb);
					}).bind(this));
				break;
			}
		} else {
			cb();
		}
	},


	_processHTML: function(oHTML, cb) {
		var aQueue = [];
		var aStyles = oHTML.getElementsByTagName('style');
		var aImages = oHTML.getElementsByTagName('img');
		var i, oStyle, oImage;
		for (i = 0; i < aStyles.length; ++i) {
			oStyle = aStyles[i];
			oStyle.setAttribute('scoped', 'scoped');
			if (oStyle.getAttribute('src')) {
				aQueue.push(['style', oStyle, oStyle.getAttribute('src')]);
			}
		}
		for (i = 0; i < aImages.length; ++i) {
			oImage = aImages[i];
			if (oImage.getAttribute('src')) {
				if (!oImage.getAttribute('src').match(/^data/)) {
					aQueue.push(['img', oImage, oImage.getAttribute('src')]);
				}
			}
		}
		this._processQueue(aQueue, cb);
	},

	renderXML: function(data, oCanvas, pDone) {
		var oParser = new DOMParser();
		data = '<root>' + data + '</root>';
		var oDoc = oParser.parseFromString(data, 'application/xml');
		this._processHTML(oDoc.documentElement, (function() {
			this._renderToCanvas(oDoc, oCanvas, pDone);
		}).bind(this));
	},

	render: function(sFile, oCanvas, pDone) {
		var aPath = sFile.split('/');
		aPath.pop();
		this.BASEPATH = aPath.filter(function(x) {
			return x !== '';
		}).join('/');
		if (this.BASEPATH !== '') {
			this.BASEPATH += '/';
		}
		this._get(sFile, (function(data) {
			this.renderXML(data, oCanvas, pDone);
		}).bind(this));
	}
});