/**
 * Générateur de Thème CSS
 * Permet de définir un theme dynamiquement à partir d'une couleur.
 * L'objet theme fournit est un objet associatif dont les clé sont des selecteur CSS 
 * et les valeurs sont des couleurs générées.
 * les couleurs générées ont ce format : $color(-text)(-darken-[1-5] | -lighten-[1-5])
 * exemple de couleur générées :
 * - $color : la couleur de base (appliquée a des backgrounds)
 * - $color-lighten-2 : la couleur de base légèrement plus claire (appliquée a des backgrounds)
 * - $color-darken-2 : la couleur de base légèrement plus foncée (appliquée a des backgrounds)
 * - $color-text : la couleur de base (appliquée à du texte) 
 * - $color-text-lighten-5 : la couleur de base fortemennt éclaircée (appliquée a du texte)
 * - $color-border : la couleur de base (appliquée à des bordures) 
 * - $color-border-lighten-5 : la couleur de base fortemennt éclaircée (appliquée a des bordures)
 * 
 * exemple de thème :
 * 
 * {
 * 		body: ['$color-ligthen-4', '$color-text-darken-5'],
 * 		div.test: ['$color', '$color-text-lighten-3']
 * }
 */
O2.createClass('O876.ThemeGenerator', {
	
	_oStyle: null,
	
	define: function(sColor, oTheme) {
		var r = new O876.Rainbow();
		var aLighten = r.spectrum(sColor, '#FFFFFF', 7);
		var aDarken = r.spectrum(sColor, '#000000', 7);
		var sName = '$color';
	
		var oCSS = {};
		oCSS[sName] = 'background-color : ' + sColor;
		oCSS[sName + '-text'] = 'color : ' + sColor;
		
		for (var i = 1; i < 6; ++i) {
			oCSS[sName + '.lighten-' + i] = 'background-color: ' + aLighten[i];
			oCSS[sName + '.darken-' + i] = 'background-color: ' + aDarken[i];
			oCSS[sName + '-text.lighten-' + i] = 'color: ' + aLighten[i];
			oCSS[sName + '-text.darken-' + i] = 'color: ' + aDarken[i];
			oCSS[sName + '-border.lighten-' + i] = 'border-color: ' + aLighten[i];
			oCSS[sName + '-border.darken-' + i] = 'border-color: ' + aDarken[i];
		}
		
		var aTheme = [];
		
		for (var sClass in oTheme) {
			aTheme.push(sClass + ' { ' + oTheme[sClass].map(function(t) { 
				return oCSS[t];
			}).join('; ') + '; }');
		}
	
		if (this._oStyle) {
			this._oStyle.remove();
			this._oStyle = null;
		}
		var oStyle = document.createElement('style');
		oStyle.setAttribute('type', 'text/css');
		oStyle.innerHTML = aTheme.join('\n').replace(/\$color/g, sName);
		this._oStyle = oStyle;
		document.getElementsByTagName('head')[0].appendChild(oStyle);
	}
});
