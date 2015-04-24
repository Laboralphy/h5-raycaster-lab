(function ($) {
	var sPluginName = 'tilesetSelector';
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
			action: 'init',
			tilewidth: 64,
			markers: ['L', 'R', 'UL', 'UR'],
			marker: 0,
			index: null,
			select: null,
			load: null,
		};
		oOptions = $.extend(true, oDefaults, oOptions);


		var removeOldStructure = function(oImage) {
			var $next = oImage.next();
			if ($next.hasClass('tilesetSelector')) {
				$next.remove();
			}
		};

		var buildStructure = function(oImage) {
			removeOldStructure(oImage);
			var w = oImage.width();
			var h = oImage.height();
			var tw = oOptions.tilewidth;
			var nCount = w / tw | 0;
			var $oTable = $('<table class="tilesetSelector"></table>');
			var $oTBody = $('<tbody></tbody>');
			$oTable.append($oTBody);
			var $oTRHead = $('<tr class="head"></tr>');
			var $oTR = $('<tr></tr>');
			var $oTD, $oTDHead;
			var $oCanvas, oCtx, oImgDom = oImage.get(0);
			for (var i = 0; i < nCount; ++i) {
				$oCanvas = $('<canvas></canvas>');
				$oCanvas.attr({width: tw, height: h});
				oCtx = $oCanvas.get(0).getContext('2d');
				oCtx.drawImage(oImgDom, tw * i, 0, tw, h, 0, 0, tw, h);
				$oTDHead = $('<td></td>');
				$oTD = $('<td></td>');
				$oTD.append($oCanvas);
				$oTR.append($oTD);
				$oTRHead.append($oTDHead);
				$oCanvas.on('contextmenu', false);
				$oCanvas.on('mousedown', cellSelected);
			}
			$oTBody.append($oTRHead).append($oTR);
			return $oTable;
		};

		var selectTile = function(oImage, m, n) {
			var $oTable = oImage.next();
			// definir les élément acteurs
			var $oTRHead = $('tr:first', $oTable);
			var $oCursor = $('span.m' + m, $oTRHead);
			var $oTDHead;
			if (n !== null) {
				$oTDHead = $('td:nth-child(' + ((n | 0) + 1).toString() + ')', $oTRHead);
			}
			if ($oCursor.length === 0) {
				// création du curseur
				$oCursor = $('<span>' + oOptions.markers[m] + '</span>');
				$oCursor.addClass('cursor');
				$oCursor.addClass('m' + m);
				$oCursor.data('sortIndex', m);
			} else {
				// déplacement du curseur
				$oCursor.detach();
			}
			if (n === null) {
				return;
			}
			var $oAllCursors = $('span.cursor', $oTDHead);
			$oAllCursors.detach();
			var aCursors = $oAllCursors.toArray();
			aCursors.push($oCursor);
			aCursors.sort(function(a, b) {
				return $(a).data('sortIndex') - $(b).data('sortIndex');
			});
			$oTDHead.append(aCursors);
		};

		var cellSelected = function(oEvent) {
			var $oCanvas = $(oEvent.target);
			var $oTD = $oCanvas.parent();
			var $oTable = $oTD.parent().parent().parent();
			var $oImage = $oTable.prev();
			var nMarker = 0;
			if (oEvent.which === 3) {
				nMarker = 1;
			}
			var nIndex = $oTD.index();
			selectTile($oImage, nMarker, nIndex);
			if (oOptions.select) {
				oOptions.select(nMarker, nIndex, $oCanvas.get(0));
			}
		};


		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			
			var toLoad = function(n) {
				n = n || 0;
				try {
					$this.after(buildStructure($this));
					if (oOptions.load) {
						oOptions.load();
					}
				} catch (e) {
					// un bug de firefox nous contraint à faire ce genre de connerie
					console.log('failed', e, n);
					setTimeout(function() {
						toLoad(n + 1);
					}, n * 100);
				}
			};
			
			switch (oOptions.action) {
				case 'init':
					// remplacer l'image
					$this.hide();
					$this.on('load', function(oEvent) {
						toLoad();
					});
				break;
				
				// clear the image
				case 'clear':
					removeOldStructure($this);
				break;
				
				// set marker position
				case 'set':
					selectTile($this, oOptions.marker, oOptions.index);
				break;			
			}
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
