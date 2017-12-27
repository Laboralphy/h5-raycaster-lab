O2.createClass('RCWE.PasteBin', {

	bActive: true,
	oPasteCatcher: null,
	bCtrlPressed: false,
	bCommandPressed: false,
	bPasteEventTriggered: false,

	__construct: function(ff) {
		if (ff) {
			this.init();
		} else {
			this.declareEvent();			
		}
	},

//on keyboard press
	keyDownAction: function (event) {
		if (!this.bActive) {
			return;
		}
		var k = event.keyCode;
		//ctrl
		if (k == 17 || event.metaKey || event.ctrlKey) {
			if (this.bCtrlPressed == false)
				this.bCtrlPressed = true;
		}
		//v
		if (k == 86) {
			if (document.activeElement != undefined && document.activeElement.type == 'text') {
				//let user paste into some input
				return false;
			}

			if (this.bCtrlPressed == true && this.oPasteCatcher != null){
				this.oPasteCatcher.focus();
			}
		}
	},
	//on kaybord release
	keyUpAction: function (event) {
		//ctrl
		if (event.ctrlKey == false && this.bCtrlPressed == true) {
			this.bCtrlPressed = false;
		}
		//command
		else if(event.metaKey == false && this.bCommandPressed == true){
			this.bCommandPressed = false;
			this.bCtrlPressed = false;
		}
	},


	init: function () {
		//handlers
		document.addEventListener('keydown', this.keyDownAction.bind(this), false); //firefox fix
		document.addEventListener('keyup', this.keyUpAction.bind(this), false); //firefox fix
		document.addEventListener('paste', this.pasteEvent.bind(this), false); //official paste handler
		var oPasteCatcher = document.createElement("div");
		this.oPasteCatcher = oPasteCatcher;
		oPasteCatcher.setAttribute("contenteditable", "");
		oPasteCatcher.style.cssText = 'opacity: 0; position: fixed; top: 0px; left: 0px; max-width: 10px; overflow: hidden; width: 10px; margin-left: -20px; ';
		document.body.appendChild(oPasteCatcher);

		// create an observer instance
		var observer = new MutationObserver((function(mutations) {
			mutations.forEach(function(mutation) {
				if (this.bPasteEventTriggered || !this.bCtrlPressed || mutation.type != 'childList'){
					//we already got data in paste_auto()
					return true;
				}
				//if paste handle failed - capture pasted object manually
				if (mutation.addedNodes.length == 1) {
					if (mutation.addedNodes[0].src !== undefined) {
						//image
						this.pasteImage(mutation.addedNodes[0].src);
					}
					//register cleanup after some time.
					setTimeout(function () {
						oPasteCatcher.innerHTML = '';
					}, 20);
				}
			}, this);
		}).bind(this));
		var config = { 
			attributes: true, 
			childList: true, 
			characterData: true
		};
		observer.observe(oPasteCatcher, config);
	},	

	pasteEvent: function(event) {
		this.bPasteEventTriggered = false;
		if (!this.bActive) {
			return;
		}
		var items = (event.clipboardData || event.originalEvent.clipboardData).items;
		var item, blob, reader, 
			oURL = window.URL || window.webkitURL,
			sSource;
		if (items) {
			this.bPasteEventTriggered = true;
		}
		for (var index = 0, l = items.length; index < l; ++index) {
			item = items[index];
			if (item.kind === 'file' && item.type.indexOf('image') >= 0) {
				blob = item.getAsFile();
				reader = new FileReader();
				reader.addEventListener('load', (function(event){
					this.pasteImage(event.target.result);
				}).bind(this)); // data url!
				reader.readAsDataURL(blob);
			}
		}
	},

	declareEvent: function() {
		document.addEventListener('paste', this.pasteEvent.bind(this));
	},

	pasteImage: function(sSrc) {
		var oImage = new Image();
		oImage.addEventListener('load', (function(oEvent) {
			this.trigger('paste.image', oImage);
		}).bind(this));
		
		oImage.src = sSrc;
		if (oImage.complete) {
			this.trigger('paste.image', oImage);
		}
	}

});

O2.mixin(RCWE.PasteBin, O876.Mixin.Events);
