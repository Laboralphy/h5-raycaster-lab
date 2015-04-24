/**
 * Plugin de désactivation de sélection par curseur.
 */
(function ($) {
	var sPluginName = 'disableSelection';
	var oPlugin = {};
	oPlugin[sPluginName] = function() {
		return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
	};
	$.fn.extend(oPlugin);
})(jQuery);
