O2.extendClass('MW.ModArena', UI.HUDClient, {
	
	bInitialized: false,
	aScores: null,
	
	displayScores: function() {
		var aData = this.aScores;
		if (!aData) {
			return;
		}
		aTable = aData.map(function(o) {
			return '<th class="name">' + o[0] + '</th>' + '<td class="kills">' + o[1] + '</td>' + '<td class="deaths">' + o[2] + '</td>';
		});
		var sHTML = '<div id="scoreContainer">' +
			'<style type="text/css" scoped="scoped">' +
				'div#scoreContainer {' +
					'height: 340px;' +
					'width: 100%;' +
					'overflow: auto;' +
				'}' +

				'div#scoreContainer > table.scores {' +
					'width: 100%;' +
					'font-family: monospace;' +
				'}' +

				'div#scoreContainer > table.scores > tbody th.name,'+ 
				'div#scoreContainer > table.scores > tbody td.kills,'+
				'div#scoreContainer > table.scores > tbody td.deaths {'+
					'background-color: #AAAAAA;'+
					'text-align: right;'+
					'font-size: 150%;'+
					'padding-right: 16px;'+
					'padding-left: 16px;'+
				'}' +
				'div#scoreContainer > table.scores > tbody td.deaths {' +
					'color: #800' +
				'}' +
			'</style>' +
			'<table class="scores"><thead><tr><th>Player</th><th>Kills</th><th>Deaths</th>' + 
			'</tr></thead><tbody><tr>' + aTable.join('</tr><tr>') + '</tr>' +
			'</tbody></table></div>' + 
			'<div align="right"><button type="button" onclick="MW.Microsyte.close();">Close</button></div>';
		this.oGame.gpDisplayHTMLMessage('Scores', sHTML);
	},
	
	
	/**
	 * La fonction update est le point d'entrée du widget,
	 * Elle est invoquée chaque fois que le plugin-serveur appelle la methode Instance::updateHud()
	 * Les paramètres de la methode sont choisis librement mais doivent se correspondre.
	 * ici : update(fAcc)  parce que le plugin-serveur appelle Instance::updateHud([entities], "accuracy", fAcc);
	 */
	update: function(aScores, sEvent, sParam) {
		switch (sEvent) {
			case 'playerJoined':
				this.oGame.popupMessage(STRINGS._('~pop_player_joined', [sParam]));
			break;
				
			case 'playerLeft':
				this.oGame.popupMessage(STRINGS._('~pop_player_left', [sParam]));
			break;
			
			case 'endGame':
				this.oGame.sendSignal(
					'ui_dialog', 
					STRINGS._('~dlg_endgame_title'), 
					STRINGS._('~dlg_endgame_message', []), 
					[ 
						[ STRINGS._('~dlg_button_continue'), this.oGame.gpReconnect.bind(this.oGame), 1 ],
						[ STRINGS._('~dlg_button_scores'), this.displayScores.bind(this), 6 ] 
					]
				);
			break;
		}
		var c = this.oContext;
		var h = this.oCanvas.height;
		var w = this.oCanvas.width;
		c.clearRect(0, 0, w, h);
		if (!this.bInitialized) {
			c.strokeStyle = 'black';
			c.fillStyle = 'white';
			c.font = '10px monospace';
			this.bInitialized = true;
		}
		aScores.forEach(function(s, i) {
			var wn = c.measureText(s[0]).width;
			var ws = c.measureText(s[1]).width;
			c.strokeText(s[0], 96 - wn, i * 10 + 10);
			c.fillText(s[0], 96 - wn, i * 10 + 10);
			c.strokeText(s[1], 126 - ws, i * 10 + 10);
			c.fillText(s[1], 126 - ws, i * 10 + 10);
		});
		this.aScores = aScores;
	}
});
