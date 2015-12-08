O2.createClass('RCWE.SlideShows', {
	oSlideShows: {
		'tuto1': {
			slides : [
	
				'documents/tutorials/t1/slide-0.html',
				'documents/tutorials/t1/slide-1.html',
				'documents/tutorials/t1/slide-2.html',
				'documents/tutorials/t1/slide-3.html',
				'documents/tutorials/t1/slide-4.html',
				'documents/tutorials/t1/slide-5.html',
				'documents/tutorials/t1/slide-6.html',
				'documents/tutorials/t1/slide-7.html',
				'documents/tutorials/t1/slide-7-2.html',
				'documents/tutorials/t1/slide-8.html',
				'documents/tutorials/t1/slide-9.html',
				'documents/tutorials/t1/slide-10.html',
				'documents/tutorials/t1/slide-11.html',
				'documents/tutorials/t1/slide-12.html',
				'documents/tutorials/t1/slide-13.html'
			],
			index: 0
		}
	},

	run: function(oWhere, sSlideShow) {
		var oSlides = this.oSlideShows[sSlideShow]; 
		$(oWhere)
			.parent()
			.hide()
			.next()
			.data('slideshow_name', sSlideShow)
			.slideshow({slides: oSlides.slides, start: oSlides.index, fadeSpeed: 300, onChanged: this.slideChanged.bind(this)})
			.fadeIn();
	},
	
	slideChanged: function(oWhere) {
		var $where = $(oWhere);
		var sName = $where.data('slideshow_name');
		var nIndex = $where.data('slideshow_index');
		this.oSlideShows[sName].index = nIndex;
	}
	
});