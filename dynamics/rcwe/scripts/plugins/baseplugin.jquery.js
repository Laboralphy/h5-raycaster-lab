(function ($) {
	var sPluginName = 'BASEPLUGIN'; // Mettre ici le nom du plugin !
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
		};
		oOptions = $.extend(true, oDefaults, oOptions);

		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			// ... ci-après : code a appliquer à $this
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
