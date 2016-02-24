O2.createObject('O876.ParamGetter' , {
	parse: function(sSearch) {
		if (sSearch) {
			var nQuest = sSearch.indexOf('?');
			console.log(nQuest);
			if (nQuest >= 0) {
				sSearch = sSearch.substr(nQuest + 1);
				console.log(sSearch);
			} else {
				return {};
			}
		} else {
			sSearch = window.location.search.substr(1);
		}
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			query  = sSearch,
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
