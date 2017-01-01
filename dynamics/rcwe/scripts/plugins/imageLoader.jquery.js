/**
 * Ajoute a chaque élément de la selection un input file
 */
(function ($) {
	var sPluginName = 'imageLoader';
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
			emptyable: false,
			multiple: false,
			load: null,
			emptyHTML: '<button type="button" title="Unload image">∅</button>',
			loadHTML: '<button type="button" title="Load image">+</button>'
		};
		oOptions = $.extend(true, oDefaults, oOptions);


		var imageLoaded = function(oEvent) {
			if (oOptions.load) {
				oOptions.load(oEvent.target.result);
			}
		};

		var inputChange = function(oEvent) {
			var i, f, oReader;
			var oFiles = oEvent.target.files; // FileList object
			// Loop through the FileList and render image files as thumbnails.
			for (i = 0; f = oFiles[i]; ++i) {
				// Only process image files.
				if (!f.type.match('image.*')) {
					continue;
				}
				oReader = new FileReader();
				oReader.onload = imageLoaded;
				oReader.readAsDataURL(f);
			}
		};

		var clearInput = function(oEvent) {
			var $this = $(oEvent.target);
			$this.next().val('');
			if (oOptions.load) {
				oOptions.load('');
			}
		};

		/**
		 * Fonction principale appelée pour chaque élément selectionné
		 * par la requete jquery.
		 */
		var main = function() {
			var $this = $(this);
			if (oOptions.emptyable) {
				var $clear = $(oOptions.emptyHTML);
				$this.append($clear);
				$clear.bind('click', clearInput);
			}
			var $input = $('<input type="file" style="visibility: hidden; position: absolute; top: -50px; left: -50px"/>');
			$this.append($input);
			var $load = $(oOptions.loadHTML);
			$this.append($load);
			$input.prop('multiple', oOptions.multiple);
			$input.bind('change', inputChange);
			$load.bind('click', function(oEvent) { 
				$input.val(''); 
				$input.trigger('click');
			});
		};

		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
