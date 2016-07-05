/**
 * O876 Toolkit
 * This tool is used to determine the type of all parameters passed
 * to a function, durinng a call.
 * usually you type : O876.typeMap(arguments, format)
 * the format controls the output format (either array or string)
 * the function returns an array or a string.
 * each item stands for the type of the matching argument
 * the 'short' version returns
 *
 * undefined : undefined / null
 * number : number
 * object : object, not an array, not null
 * function : function
 * boolean : boolean
 * array : array
 *
 * goot to GIT
 */ 
O2.createObject('O876.typeMap', function(aArgs, sFormat) {
	var aOutput = Array.prototype.slice.call(aArgs, 0).map(function(x) {
		var tx = (typeof x);
		switch (tx) {
			case 'object':
				if (x === null) {
					return 'undefined';
				} else if (Array.isArray(x)) {
					return 'array';
				} else {
					return 'object';
				}
				break;
				
			default:
				return tx;
		}
	});
	switch (sFormat) {
		case 'short':
			return aOutput.map(function(x) {
				return x.charAt(0);
			}).join('');
		break;

		default:
			return aOutput;
	}
});
