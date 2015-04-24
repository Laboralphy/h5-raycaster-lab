/**
 * Cette classe permet de définir des cartes 2D
 * ou plus généralement des tableau 2D d'entier.
 * On entre une description texturelle composé 
 * d'un tableau de chaines de caractères.
 * Chacun de ces caractère sera remplacé par un entier
 * pour donner un tableau de tableau d'entiers
 * @param aMap tableau deux dimension contenant la carte
 * @oDic dictionnaire faisan correspondre les symbole de la carte à la valeur numérique finale
 */
O2.createObject('O876.MapTranslater', {
	process: function(aMap, oDic) {
		var x, y, aRow;
		var aOutput = [];
		var aRowOutput;
		
		for (y = 0; y < aMap.length; ++y) {
			aRow = aMap[y].split('');
			aRowOutput = [];
			for (x = 0; x < aRow.length; ++x) {
				aRowOutput.push(oDic[aRow[x]]);
			}
			aOutput.push(aRowOutput);
		}
		return aOutput;
	}
});
