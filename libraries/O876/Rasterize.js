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
	bBusy: false,
	oDomParser: null,

	__construct: function() {
		this.xhr = new O876.XHR();
		this.oDomParser = new DOMParser();
	},

	_get: function(sFile, cb) {
		this.xhr.get(this.BASEPATH + sFile, cb);
	},

	_computeMetrics: function(oObject, w, h) {
		var oElement = document.createElement('div');
		oElement.style.padding = '0px';
		oElement.style.margin = '0px';
		oElement.style.position = 'relative';
		oElement.style.visibility = 'hidden';
		oElement.style.width = w + 'px';
		oElement.style.height = h + 'px';
		oElement.appendChild(oObject);
		document.body.appendChild(oElement);
		var q = oElement.querySelectorAll('[id]');
		var oResult = {}, e, id;
		for (var i = 0; i < q.length; ++i) {
			e = q[i];
			id = e.getAttribute('id');
			oResult[id] = {
				width: e.offsetWidth,
				height: e.offsetHeight,
				left: e.offsetLeft,
				top: e.offsetTop
			};
		}
		oElement.remove();
		console.log(oResult);
		return oResult;
	},
	
	_parseXMLString: function(sXML) {
		return this.oDomParser.parseFromString(sXML, 'application/xml');		
	},
	
	_renderSVGString: function(sXML, w, h) {
		return ([
	'	<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">',
	'		<foreignObject width="100%" height="100%">',
	'			<style scoped="scoped">',
	'root {',
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
	'           <root xmlns="http://www.w3.org/1999/xhtml">',
	            sXML,
	'           </root>',
	'      </foreignObject>',
	'</svg>'
	    ]).join('\n');
	},

	_renderToCanvas: function(xElement, oCanvas, pDone) {
		var w = oCanvas.width;
		var h = oCanvas.height;
		var ctx = oCanvas.getContext('2d');
		var xs = new XMLSerializer();
		var sSVG = xs.serializeToString(xElement.documentElement);
		// proved to be inadequate
		var oMetrics = this._computeMetrics(xElement.documentElement, oCanvas.width, oCanvas.height);
		var img = new Image();
		var svg = new Blob([sSVG], {type: 'image/svg+xml;charset=utf-8'});
		var url = URL.createObjectURL(svg);
		img.addEventListener('load', (function() {
		    ctx.drawImage(img, 0, 0);
		    URL.revokeObjectURL(url);
		    if (pDone) {
		    	var o = {
					canvas: oCanvas,
					metrics: oMetrics
				};
				this.trigger('render', o);
				pDone(o);
			}
		}).bind(this));
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
		oImage.src = this.BASEPATH + img.getAttribute('src');
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


	_processXML: function(oXML, cb) {
		var aQueue = [];
		var aStyles = oXML.getElementsByTagName('style');
		var aImages = oXML.getElementsByTagName('img');
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
		var sXML = this._renderSVGString(data, oCanvas.width, oCanvas.height);
		var oDoc = this._parseXMLString(sXML);
		this._processXML(oDoc.documentElement, (function() {
			this.trigger('parse', {
				element: oDoc
			});
			this._renderToCanvas(oDoc, oCanvas, pDone);
		}).bind(this));
	},

	render: function(sFile, oCanvas, pDone) {
		var aPath = sFile.split('/');
		var sFile = aPath.pop();
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

O2.mixin(O876.Rasterize, O876.Mixin.Events);
