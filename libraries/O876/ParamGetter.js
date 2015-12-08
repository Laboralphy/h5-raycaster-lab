O2.createObject('O876.ParamGetter' , {
	parse: function(sSearch) {
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			query  = sSearch || window.location.search.substring(1),
			_decode = function(s) {
				return decodeURIComponent(s.replace(pl, ' '));
			};
		var oURLParams = {};
		while (match = search.exec(query)) {
		   oURLParams[_decode(match[1])] = _decode(match[2]);
		}
		return oURLParams;
	}
});
