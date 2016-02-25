var ReikasterMicrosyte = {
	oMicrosyte: null,

	open: function(sTitle, w, h) {
		G.pause();
		G.getKeyboardDevice().unplugEvents();
		ReikasterMicrosyte.oMicrosyte = new O876.Microsyte('page');
		var m = ReikasterMicrosyte.oMicrosyte;
		m.setSize(w, h);
		m.center();
		m.clear();
		m.show();
		var oTitle = m.linkDiv(sTitle, 12, 12, w - 16);
		oTitle.className = 'title';
		m.setLinkOrientation('right');
		m.linkDiv('<button  type="button" id="cmd_close" onclick="ReikasterMicrosyte.close()">' + STRINGS._('~mspage_button_close') + '<br /><span style="color: red; font: bold sans-serif 133%">X</span></button>', 16, 16);
		m.setLinkOrientation('left');
	},
	
	close: function() {
		ReikasterMicrosyte.oMicrosyte.hide();
		G.getKeyboardDevice().plugEvents();
		G.resume();
	},
	
	
	openCommentForm: function() {
		ReikasterMicrosyte.open(STRINGS._('~mspage_p1_title'), 640, 480);
		var m = ReikasterMicrosyte.oMicrosyte;
		m.linkDiv(STRINGS._('~mspage_p1_text'), 24, 96, 600);
		m.linkDiv(STRINGS._('~mspage_p1_label'), 24, 200, 600);
		m.linkDiv('<textarea id="memo_comments" cols="74" rows="10"></textarea><br /><button type="button" id="cmd_sendComments" >' + STRINGS._('~mspage_p1_button_send') + '</button>', 24, 224, 600);
		var oTextArea = document.getElementById('memo_comments');
		oTextArea.focus();
		var oSendButton = document.getElementById('cmd_sendComments');
		oSendButton.onclick = ReikasterMicrosyte.sendComments;
	},
	
	sendComments: function(oEvent) {
		return; // discontinued
		var oTextArea = document.getElementById('memo_comments');
		var sMsg = oTextArea.value;
		var oData = {m: sMsg};
		if (G.oDungeon) {
			oData.d = G.oDungeon.getPlayerLocationArea();
			oData.f = G.oDungeon.getPlayerLocationFloor();
			oData.s = WORLD_DATA.dungeons[oData.d][oData.f].seed;
		}
		try {
			//XHR.post(CONFIG.crawlerfs.l, {f: 'ru_comments_*remote_addr', d: oData});
			ReikasterMicrosyte.close();
			alert(STRINGS._('~mspage_p1_thanx'));
		} catch (e) {
			alert(STRINGS._('~mspage_p1_error'));
		}
	},
	
	openHiscoreForm: function(n) {
		nScore = n ? n : G.oScore.getScore(G.getPlayer());
		nRank = XHR.getSync('../../../labo/apps/rei/?action=score.rank&v=' + nScore);
		ReikasterMicrosyte.open(STRINGS._('~mspage_p2_title'), 320, 256);
		ReikasterMicrosyte.oMicrosyte.linkDiv(STRINGS._('~mspage_p2_text', [nScore, nRank]), 24, 80, 600);
		ReikasterMicrosyte.oMicrosyte.linkDiv('<input type="text" id="edit_name" /><button type="button" id="cmd_sendScore" >' + STRINGS._('~mspage_p1_button_send') + '</button>', 24, 160);
		var oInput = document.getElementById('edit_name');
		oInput.focus();
		var oSendButton = document.getElementById('cmd_sendScore');
		oSendButton.onclick = ReikasterMicrosyte.sendScore;
		oInput.onkeypress = ReikasterMicrosyte.hiscoreNameKeypressed;
	},
	
	hiscoreNameKeypressed: function(oEvent) {
		if (oEvent.charCode == 13) {
			ReikasterMicrosyte.sendScore();
		}
	},
	
	openHiscoreTable: function() {
		ReikasterMicrosyte.open(STRINGS._('~mspage_p2_title'), 512, 320);
		var oDiv = ReikasterMicrosyte.oMicrosyte.linkDiv('', 16, 64, 512, 320 - 48);
		oDiv.id = 'tableContainer';
		var oTable = ReikasterMicrosyte.oMicrosyte.linkDiv(XHR.getSync('../../../labo/apps/rei/?action=score.rawtable'), 0, 0, '100%', null, 'tableContainer');
		oTable.style.width = '100%';
	},
	
	sendScore: function() {
		var oInput = document.getElementById('edit_name');
		sName = oInput.value;
		if (sName === '') {
			return;
		} 
		var nScore = G.oScore.getScore(G.getPlayer());
		var oPostData = {
				f: 'ru_score_*remote_addr',
				d: {
					n: sName,
					s: nScore,
					la: G.oDungeon.getPlayerLocationArea(),
					lf: G.oDungeon.getPlayerLocationFloor()
				}
		};
		//XHR.post(CONFIG.crawlerfs.l, oPostData);
		ReikasterMicrosyte.close();
	}
};

