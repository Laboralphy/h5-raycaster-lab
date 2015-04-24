var $doc;

/**
 * Clears the document and begins a new one.
 * Insert title
 */
function clearDocument() {
	$doc.empty().append('<h1>mwserver inspector</h1><hr />');
}

/**
 * Inspects an entity
 * @param int nInstance id of instance where the entity is
 * @param int nEntity id of the entity
 */
function inspectEntity(nInstance, nEntity) {
	$.get('/mwinspect?a=ent&i=' + nInstance + '&e=' + nEntity).done(function(data) {
		var $data = $(data);
		clearDocument();
		$doc.append('<button onclick="inspect()">root</button><button onclick="inspectInstance(' + nInstance + ')">instance #' + nInstance + '</button><button onclick="inspectEntity(' + nInstance + ', ' + nEntity + ')">↻</button>');
		$doc.append($data);
	});	
}

/**
 * Inspects an instance
 * @param int nInstance id of the entity
 */
function inspectInstance(nInstance) {
	$.get('/mwinspect?a=inst&i=' + nInstance).done(function(data) {
		var $data = $(data);
		clearDocument();
		$doc.append('<button onclick="inspect()">root</button><button onclick="inspectInstance(' + nInstance + ')">↻</button>');
		$doc.append($data);
		$('tr.link', $data).on('click', function(oEvent) {
			var $row = $(this);
			var $td0 = $('td:first', $row);
			inspectEntity(nInstance, $td0.html() | 0);
		});
	});
}

/**
 * inspects the game, displays a list of instances
 */
function inspect() {
	$.get('/mwinspect').done(function(data) {
		var $data = $(data);
		clearDocument();
		$doc.append('<button onclick="inspect()">↻</button>');
		$doc.append($data);
		$('tr.link', $data).on('click', function(oEvent) {
			var $row = $(this);
			var $td0 = $('td:first', $row);
			inspectInstance($td0.html() | 0);
		});
	});
}

/**
 * the main function
 * @param oEvent
 */
function main(oEvent) {
	$doc = $('#document');
	inspect();
}



window.addEventListener('load', main);