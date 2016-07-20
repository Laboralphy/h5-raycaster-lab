/**
 * Transforms an HTML element (and its content) into a bitmap image 
 * inside a canvas.
 * @param xElement the DOM element to be rasterize
 * @param oCanvas the canvas on which will render the element
 * @param pDone a callback function called when it's done 
 * good to GIT
 */ 
O2.createObject('O876.rasterize', function(xElement, oCanvas, pDone) {
	var w = oCanvas.width;
	var h = oCanvas.height;
	var ctx = oCanvas.getContext('2d');
	var sHTML = typeof oElement == 'string' ? xElement : xElement.outerHTML;
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
});
