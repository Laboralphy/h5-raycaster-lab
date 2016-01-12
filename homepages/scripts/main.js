function switchPage(s) {
	$('.page:visible').fadeOut(function() {
		$('.page.' + s).fadeIn();
	});
}

function main() {
	
}

$(window).on('load', main);
