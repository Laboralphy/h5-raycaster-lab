(function ($) {
	var sPluginName = 'colorf3';
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			labels: {
				colors: ['Red', 'Green', 'Blue'],
				result: 'Color',
				title: 'Ralphy\'s colorpicker',
				ok: 'ok'					
			},
			metrics: {
				width: 128,
				height: 16
			},
			deploy: 'bottom',
			preview: false,
			close: null,
			change: null
		};
		oOptions = $.extend(true, oDefaults, oOptions);

		/**
		 * Lecture d'une donnée associée à l'objet spécifié
		 * @param oObject objet jquery interrogé
		 * @param sData string, nom de la donnée cherchée
		 * @return valeur de la donnée
		 */
		var getData = function(oObject, sData) {
			return oObject.data('_' + sPluginName + '_' + sData);
		};
		
		/**
		 * Ecriture d'une donnée associée à l'objet spécifié
		 * @param oObject objet jquery interrogé
		 * @param sData string, nom de la donnée cherchée
		 * @param xValue, valeur de la donnée
		 */
		var setData = function(oObject, sData, xValue) {
			return oObject.data('_' + sPluginName + '_' + sData, xValue);
		};
		
		/**
		 * Petite fonction de conversion de tableau de couelur en chaine CSS
		 */
		var mkrgbstr = function(r, g, b) {
			return 'rgb(' + r + ', ' + g + ', ' + b + ')';
		};
		
		/**
		 * Création d'un gradient linéaire pour le canvas spécifé
		 * @param oCvs canvas
		 * @param g0 couleur 0 du gradient
		 * @param g1 couleur 1 du gradient
		 */
		var mkgrad = function(oCvs, g0, g1) {
			var oCtx = oCvs.getContext('2d');
			var w = oCvs.width;
			var h = oCvs.height;
			var g = oCtx.createLinearGradient(0, 0, w, 0);
			g.addColorStop(0, g0);
			g.addColorStop(1, g1);
			oCtx.fillStyle = g;
			oCtx.fillRect(0, 0, w, h);
		};
		
		/**
		 * Mise à jour des sliders de l'objet spécifié
		 */
		var updateSliders = function(oObject) {
			// récupération des données
			// canvas
			var oContainer = getData(oObject, 'container');
			var $oCanvases = $('canvas', oContainer);
			var oCanvasR = $oCanvases.get(0); 
			var oCanvasG = $oCanvases.get(1);
			var oCanvasB = $oCanvases.get(2);
			var oCanvasRes = $oCanvases.get(3);
			// contextes 2D
			var oCtxR = oCanvasR.getContext('2d');
			var oCtxG = oCanvasG.getContext('2d');
			var oCtxB = oCanvasB.getContext('2d');
			var oCtxRes = oCanvasRes.getContext('2d');
			// couleur 0-255
			var r = $(oCanvasR).data('color');
			var g = $(oCanvasG).data('color');
			var b = $(oCanvasB).data('color');
			// gradients
			if (oOptions.preview) {
				mkgrad(oCanvasR, mkrgbstr(0, g, b), mkrgbstr(255, g, b)); 
				mkgrad(oCanvasG, mkrgbstr(r, 0, b), mkrgbstr(r, 255, b));
				mkgrad(oCanvasB, mkrgbstr(r, g, 0),	mkrgbstr(r, g, 255));
			} else {
				mkgrad(oCanvasR, mkrgbstr(0, 0, 0), mkrgbstr(255, 0, 0)); 
				mkgrad(oCanvasG, mkrgbstr(0, 0, 0), mkrgbstr(0, 255, 0));
				mkgrad(oCanvasB, mkrgbstr(0, 0, 0),	mkrgbstr(0, 0, 255));
			}
			// metriques
			var w = oOptions.metrics.width;
			var h = oOptions.metrics.height;
			// poisitions des sliders
			var rx = (r * w) >> 8; 
			var gx = (g * w) >> 8; 
			var bx = (b * w) >> 8;
			
			oCtxR.fillStyle = 'rgb(0, 0, 0)';
			oCtxR.strokeStyle = 'rgb(255, 255, 255)';
			oCtxR.fillRect(rx, 0, 1, h);
			oCtxR.strokeRect(rx - 1, 0, 3, h);	

			oCtxG.fillStyle = 'rgb(0, 0, 0)';
			oCtxG.strokeStyle = 'rgb(255, 255, 255)';
			oCtxG.fillRect(gx, 0, 1, h);
			oCtxG.strokeRect(gx - 1, 0, 3, h);	

			oCtxB.fillStyle = 'rgb(0, 0, 0)';
			oCtxB.strokeStyle = 'rgb(255, 255, 255)';
			oCtxB.fillRect(bx, 0, 1, h);
			oCtxB.strokeRect(bx - 1, 0, 3, h);	
			
			oCtxRes.fillStyle = mkrgbstr(r, g, b);
			oCtxRes.fillRect(0, 0, w >> 1, h);
		};
		
		var sliderMoving = function(oEvent) {
			if (oEvent.which === 1) {
				var $oSlider = $(oEvent.target);
				var $oClient = $oSlider.data('client');
				var $oContainer = getData($oClient, 'container');
				var x = oEvent.pageX - $oSlider.position().left - $oContainer.position().left - 4;
				var w = $oSlider.width();
				var xPos256 = (x << 8) / w | 0;
				$oSlider.data('color', xPos256);
				updateSliders($oClient);
			}
		};
		
		/**
		 * Fabication de l'interface graphique
		 * 3 sliders de couleur
		 * une case de couleur résultat
		 */
		var buildUserInterface = function(oObject) {
			var $oContainer = $('<div class="colorf3"></div>');
			var oColors = oOptions.labels.colors;
			var $oStructure = $('<table><tbody>' + 
				'<tr><td class="titlebar" colspan="2"><span class="titletext">' + oOptions.labels.title + '</span>' + 
				'<span class="close">✕</span></td></tr>' + 
				'<tr><td class="label">' + oColors[0] + '</td><td></td></tr>' + 
				'<tr><td class="label">' + oColors[1] + '</td><td></td></tr>' + 
				'<tr><td class="label">' + oColors[2] + '</td><td></td></tr>' + 
				'<tr><td class="label">' + oOptions.labels.result + '</td><td></td></tr></tbody></table>');
			var w = oOptions.metrics.width;
			var h = oOptions.metrics.height;
			var $oCanvasR = $('<canvas class="selector"></canvas>').attr('width', w).attr('height', h);
			var $oCanvasG = $('<canvas class="selector"></canvas>').attr('width', w).attr('height', h);
			var $oCanvasB = $('<canvas class="selector"></canvas>').attr('width', w).attr('height', h);
			var $oCanvasRes = $('<canvas class="result"></canvas>').attr('width', w >> 1).attr('height', h);
			var $oOK = $('<button type="button">' + oOptions.labels.ok + '</button>');
			// lego time
			$oContainer.append($oStructure);
			$('tr:nth-child(2) td:last', $oStructure).append($oCanvasR);
			$('tr:nth-child(3) td:last', $oStructure).append($oCanvasG);
			$('tr:nth-child(4) td:last', $oStructure).append($oCanvasB);
			$('tr:nth-child(5) td:last', $oStructure).append($oCanvasRes).append($oOK);
			
			$('canvas.selector', $oStructure)
				.data('client', oObject)
				.bind('mousedown', sliderMoving)
				.bind('mousemove', sliderMoving);
			
			$oContainer.hide();
			
			
			$('body').append($oContainer);
			setData(oObject, 'container', $oContainer);
			oObject.bind('click', showUI);
			
			var $oClose = $('span.close', $oStructure);
			$oOK.bind('click', doOk);
			$oOK.data('client', oObject);
			$oClose.data('client', oObject);
			$oClose.bind('click', doClose);
		};
		
		var doOk = function(oEvent) {
			var $oTarget = $(oEvent.target);
			var $oClient = $oTarget.data('client');
			var $oContainer = getData($oClient, 'container');
			$oContainer.fadeOut('fast');
			var $oCanvases = $('canvas.selector', $oContainer);
			var r = $oCanvases.eq(0).data('color');
			var g = $oCanvases.eq(1).data('color');
			var b = $oCanvases.eq(2).data('color');
			var nColor = (r << 16) | (g << 8) | (b);
			var sColor = nColor.toString(16);
			while (sColor.length < 6) {
				sColor = '0' + sColor;
			}
			var sColorf3 = '#' + sColor[0] + sColor[2] + sColor[4];
			$oClient.val(sColorf3);
			if (oOptions.change) {
				oOptions.change(oEvent);
			}
		};

		var doClose = function(oEvent) {
			var $oTarget = $(oEvent.target);
			var $oClient = $oTarget.data('client');
			var $oContainer = getData($oClient, 'container');
			$oContainer.fadeOut();
			if (oOptions.close) {
				oOptions.close(oEvent);
			}
		};
		
		var showUI = function(oEvent) {
			var $oObject = $(oEvent.target);
			var oPosition = $oObject.position();
			var x = oPosition.left;
			var y = oPosition.top;
			var $oContainer = getData($oObject, 'container');
			switch (oOptions.deploy) {
				case 'bottom':
					$oContainer.css({'left': x + 'px', 'top': y + 'px'});
					break;

				case 'top':
					$oContainer.css({'left': x + 'px', 'top': (y - $oContainer.height()).toString() + 'px'});
					break;
			}
			var oContainer = getData($oObject, 'container');
			var $oCanvases = $('canvas.selector', oContainer);
			var $oCanvasR = $oCanvases.eq(0); 
			var $oCanvasG = $oCanvases.eq(1);
			var $oCanvasB = $oCanvases.eq(2);
			var sColor = $oObject.val();
			var r = 0, g = 0, b = 0;
			if (sColor.match(/^#[0-9a-f]{3}$/i)) {
				r = parseInt('0x' + sColor.charAt(1));
				g = parseInt('0x' + sColor.charAt(2));
				b = parseInt('0x' + sColor.charAt(3));
				r |= (r << 4);
				g |= (g << 4);
				b |= (b << 4);
			}				
			$oCanvasR.data('color', r);
			$oCanvasG.data('color', g);
			$oCanvasB.data('color', b);
			updateSliders($oObject);
			$oContainer.fadeIn();
		};
		
		var main = function() {
			var $this = $(this);
			if (getData($this, 'init')) {
				// l'objet à déja été initialisé
			} else {
				// l'objet n'a pas été inititialisé
				setData($this, 'init', true);
				buildUserInterface($this);
			}
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
