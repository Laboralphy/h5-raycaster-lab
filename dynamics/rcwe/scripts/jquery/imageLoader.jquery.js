/**
 * Ajoute a chaque élément de la selection un input file
 */
(function ($) {
	var sPluginName = 'imageLoader';
	var oPlugin = {};
	oPlugin[sPluginName] = function(oOptions) {
		var oDefaults = {
			// options par défaut
			emptySign: '∅',
			emptyable: false,
			multiple: false
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
				var $clear = $('<button type="button">' + oOptions.emptySign + '</button>');
				$this.append($clear);
				$clear.bind('click', clearInput);
			}
			var $input = $('<input type="file" />');
			$this.append($input);
			$input.prop('multiple', oOptions.multiple);
			$input.bind('change', inputChange);
			$input.bind('click', function(oEvent) { oEvent.target.value = ''; });
		};
		
		return this.each(main);
	};
	$.fn.extend(oPlugin);
})(jQuery);
