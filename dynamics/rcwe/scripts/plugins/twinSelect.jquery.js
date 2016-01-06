(function ($) {
	var sPluginName = 'twinSelect'; // Mettre ici le nom du plugin !
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
			data: null
		};
		oOptions = $.extend(true, oDefaults, oOptions);
		
		
		function populateSub(oMain) {
			var $selectMain = $(oMain);
			var $selectSub = $($selectMain.data(sPluginName + '_sub'));
			$selectSub.empty();
			var sVal = $selectMain.val();
			oOptions.data[sVal].forEach(function(s) {
				var $o = $('<option></option>');
				$o.val(s).html(s);
				$selectSub.append($o);
			});
		};

		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			// créér des selects
			var $selectMain, $selectSub, $opt;
			$selectMain = $('<select class="' + sPluginName + ' main"></select>');
			$selectSub = $('<select placeholder="select main option" class="' + sPluginName + ' sub"></select>');
			$selectMain.data(sPluginName + '_sub', $selectSub.get(0));
			for (var i in oOptions.data) {
				$opt = $('<option value="' + i + '">' + i + '</option>');
				$selectMain.append($opt);
			}
			$this.append($selectMain);
			$this.append($selectSub);
			$selectMain.on('change', function(oEvent) {
				populateSub(oEvent.target);
			});
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
