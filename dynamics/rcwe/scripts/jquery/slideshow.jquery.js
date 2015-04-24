(function ($) {
	var sPluginName = 'slideshow'; // Mettre ici le nom du plugin !
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
			action: 'init',
			fadeSpeed: 500, 
			start: 0,
			slides: [],
			onChanged: null
		};
		oOptions = $.extend(true, oDefaults, oOptions);

		var build = function($div) {
			var $content = $('<div class="content"></div>');
			var $btnPrev = $('<div class="btnPrev">⇦</div>');
			var $btnNext = $('<div class="btnNext">⇨</div>');
			$btnPrev.on('click', function() {
				prevSlide($(this).parent());
			});
			$btnNext.on('click', function() {
				nextSlide($(this).parent());
			});
			$div.append($content).append($btnPrev).append($btnNext);
		};
		
		var displaySlide = function($div) {
			var o = $div.data(sPluginName + '_options')
			var aSlides = o.slides;
			var nIndex = $div.data(sPluginName + '_index');
			var sSlide = aSlides[nIndex];
			var $content = $('div.content', $div);
			$content.fadeOut(oOptions.fadeSpeed, function() {
				$('div.content', $div).load(sSlide, function() {
					$content.fadeIn(oOptions.fadeSpeed);
				});
			});
			var nCount = aSlides.length;
			var $btnPrev = $('div.btnPrev', $div);
			var $btnNext = $('div.btnNext', $div);
			$btnPrev.attr('title', 'Previous : ' + (nIndex - 1).toString() + '/' + nCount.toString());
			$btnNext.attr('title', 'Next : ' + (nIndex + 1).toString() + '/' + nCount.toString());
			if (nIndex <= 0) {
				$btnPrev.hide();
			} else {
				$btnPrev.show();
			}
			if (nIndex >= nCount - 1) {
				$btnNext.hide();
			} else {
				$btnNext.show();
			}
			if (typeof o.onChanged == 'function') {
				o.onChanged($div.get(0));
			}
		};
		
		var nextSlide = function($div) {
			var o = $div.data(sPluginName + '_options');
			var aSlides = o.slides;
			if (aSlides.length) {
				var n = $div.data(sPluginName + '_index') + 1;
				if (n < aSlides.length) {
					$div.data(sPluginName + '_index', n);
					displaySlide($div);
				}
			}
		};
		
		var prevSlide = function($div) {
			var o = $div.data(sPluginName + '_options');
			var aSlides = o.slides;
			if (aSlides.length) {
				var n = $div.data(sPluginName + '_index') - 1;
				if (n >= 0) {
					$div.data(sPluginName + '_index', n);
					displaySlide($div);
				}
			}
		};
		
		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			// ... ci-après : code a appliquer à $this
			switch (oOptions.action) {
				case 'init':
					$this.empty();
					$this.data(sPluginName + '_index', oOptions.start);
					$this.data(sPluginName + '_options', oOptions);
					$this.addClass(sPluginName);
					build($this);
					displaySlide($this);
					break;
					
				case 'next':
					nextSlide($this);
					break;
					
				case 'prev':
					prevSlide($this);
					break;
			}
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
