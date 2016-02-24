/**
 * Transforme un tableau d'argument en chaine contenant le type de chaque argument
 * u : undefined / null
 * n : number
 * o : object
 * f : function
 * b : boolean
 * a : array
 */ 
O2.createObject('O876.FunArgType' , function(aArgs) {
	return Array.prototype.slice.call(aArgs, 0).map(function(x) {
		var tx = (typeof x);
		switch (tx) {
			case 'object':
				if (x === null) {
					return 'u';
				} else if (Array.isArray(x)) {
					return 'a';
				} else {
					return 'o';
				}
				break;
				
			default:
				return tx.charAt(0);
			
		}
	}).join('');	
});
