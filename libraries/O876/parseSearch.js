/**
 * Parse a string of format "?param1=value1&param2=value2"
 * useful when it comes to get parameters from an url
 * good to GIT
 */
O2.createObject('O876.parseSearch' , function(sSearch) {
	if (sSearch) {
		var nQuest = sSearch.indexOf('?');
		if (nQuest >= 0) {
			sSearch = sSearch.substr(nQuest + 1);
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
});
