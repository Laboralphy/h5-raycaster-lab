O2.extendClass('UI.LoadingWindow', UI.Window, {
	_sClass: 'UI.LoadingWindow',
	oPB:null,
	
	__construct: function(oParams) {
		__inherited({caption: STRINGS._('~win_loading')});
		this.setSize(320, 160);
		var pb = this.linkControl(new UI.ProgressBar({}));
		pb.setSize(260, 32);
		pb.moveTo(32, 100);
		pb.setMax(100);
		pb.setProgress(0);
		this.oPB = pb;
	},
	
	getProgressBar: function() {
		return this.oPB;
	}
});

