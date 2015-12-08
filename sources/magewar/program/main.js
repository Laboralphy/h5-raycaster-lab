/**
 * Calcule la position d'un élément par rapport au coin superieur gauche de la fenêtre du navigateur
 * Cette fonction n'existe pas sur firefox.
 * @param oElement élément dont on cherche la position
 * @return array of int
 */
function getElementPos(oElement) {
	return UI.System.prototype.getElementPos(oElement);
}

/**
 * Entre en mode pointerlock
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer(oElement) {
	if (!G.oRaycaster.oCamera || !G.oRaycaster.oCamera.oThinker) {
		return false;
	}
	if (O876_Raycaster.PointerLock.locked()) {
		return false;
	}
	if (CONFIG.game.fullscreen) {
		O876_Raycaster.FullScreen.changeEvent = function() {
			if (O876_Raycaster.FullScreen.isFullScreen()) {
				O876_Raycaster.PointerLock.requestPointerLock(oElement);
				O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
			}
		};
		O876_Raycaster.FullScreen.enter(oElement);
	} else {
		O876_Raycaster.PointerLock.requestPointerLock(oElement);
		O876_Raycaster.PointerLock.setHook(G.oRaycaster.oCamera.oThinker.readMouseMovement, G.oRaycaster.oCamera.oThinker);
	}
	return true;
}

/**
 * Gestionnaire de l'évènement de redimessionement écran
 */
function screenResize(oEvent) {
	var nPadding = 24;
	var h = innerHeight;
	var w = innerWidth;
	var r = (h - nPadding) / w;
	var oCanvas = document.getElementById(CONFIG.raycaster.canvas);
	var xy = getElementPos(oCanvas);
	oCanvas.__x = xy[0];
	oCanvas.__y = xy[1];
	oCanvas.__mozMaximizeCheck = true;
	var rBase = oCanvas.height / oCanvas.width; 
	if (r < rBase) { // utiliser height
		h -= nPadding;
		oCanvas.style.width = (h / rBase | 0).toString() + 'px';
		oCanvas.style.height = h.toString() + 'px';
		oCanvas.__ratio = h / oCanvas.height;		
	} else { // utiliser width
		oCanvas.style.width = w.toString() + 'px';
		oCanvas.style.height = (w * rBase | 0).toString() + 'px';
		oCanvas.__ratio = w / oCanvas.width;
	}
}


function displayError(sError) {
	var oError = document.getElementById('error_message');
	var oErrorBody = document.getElementById('error_message_body');
	oErrorBody.innerHTML = sError;
	oError.style.display = 'block';
	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	oScreen.style.display = 'none';
}


function startGame(sLogin) {
	screenResize();
	window.addEventListener('resize', screenResize, true);

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	} else {
		displayError('<p><b>Pointerlock feature is not available.</b></p>' + 
		'<p>The Mouse Pointerlock feature provides access to raw mouse movement data and proper control for first person games. Unfortunatly this feature is not available on your browser. ' + 
		'Try to install another browser like <b>Firefox</b>, ' + 
		'<b>Chrome</b> or <b>Chromium</b> which are best suited for playing games.</p>' +
		'<p>Please visit <a href="http://caniuse.com/#feat=pointerlock">this site</a> and check if your favorite browser supports this feature.</p>');
		return;
	}

	var g = new MW.Game();
	window.G = g;	
		
	g.csLogin(sLogin);
}

function processLogin(oLogin) {
	var n = oLogin.getNickname();
	var k = oLogin.getLoginKey();
	if (oLogin.getOptionCheck('opt_nosnd')) {
		CONFIG.game.sound = false;
	}
	if (k) {
		startGame(k);
	} else if (n) {
		startGame(n);
	}
}

function main() {
	var oLogin = new MW.Login();
	oLogin.onLogin = processLogin;
	oLogin.run();
}

window.addEventListener('load', main);
