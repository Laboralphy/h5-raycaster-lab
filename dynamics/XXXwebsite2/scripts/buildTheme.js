/**
 * This lambda function must be run at once
 */
(function () {
	var tgPrim = new O876.ThemeGenerator();
	tgPrim.define('#888', {
		'body': ['$color.lighten-5'],
		'a.btn': ['$color.darken-3', '$color-text.lighten-5'],
		'a.btn:hover': ['$color.darken-1', '$color-text.lighten-5'],
		'.card': ['$color.lighten-3'],
		'.ph-bandeau, .ph-mainmenu': ['$color.lighten-2']
	});
})();

