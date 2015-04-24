function checkLogin(sLogin) {
	// checking login name
	if (sLogin.length < 2) {
		return false;
	} else {
		return true;
	}
}	


function startGame(sLogin) {
	screenResize();
	window.addEventListener('resize', screenResize, true);
	var g = new MW.Game();
	window.G = g;
	

	var oScreen = document.getElementById(CONFIG.raycaster.canvas);
	if (O876_Raycaster.PointerLock.init()) {
		oScreen.addEventListener('click', function(oEvent) {
			lockPointer(oEvent.target);
		});
	} else {
		document.getElementById('info').innerHTML = 'No PointerLock AP available on this browser';
	}
	
	g.csLogin(sLogin);
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
 * Calcule la position d'un élément par rapport au coin superieur gauche de la fenêtre du navigateur
 * Cette fonction n'existe pas sur firefox.
 * @param oElement élément dont on cherche la position
 * @return array of int
 */
function getElementPos(oElement) {
	return UI.System.prototype.getElementPos(oElement);
}

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
		oCanvas.style.width = '';
		oCanvas.style.height = h.toString() + 'px';
		oCanvas.__ratio = h / oCanvas.height;		
	} else { // utiliser width
		oCanvas.style.width = w.toString() + 'px';
		oCanvas.style.height = '';
		oCanvas.__ratio = w / oCanvas.width;		
	}
}






function loginForm() {
	XHR.get('/mwstatus/', document.getElementById('status'));
	var oNickname = document.getElementById('nickname');
	var oConnect = document.getElementById('connect');
	var oLogo = document.getElementById('logo');
	var oLogin = document.getElementById('login');
	var oScreen = document.getElementById('screen');
	var oError = document.getElementById('error');
	var oOpt = {
		sw: document.getElementById('options_switch'),
		sw_val: false,
		opt: document.getElementById('options'),
		hires: document.getElementById('opt_hires')
	};
	oOpt.sw.addEventListener('click', function(oEvent) {
		oOpt.opt.style.display = oOpt.sw_val ? 'none' : 'block';
		oOpt.sw.innerHTML = oOpt.sw_val ? 'Show options' : 'Hide options';
		oOpt.sw_val = !oOpt.sw_val;
	});
	
	var doLogin = function() {
		var sLogin = oNickname.value;
		if (!checkLogin(sLogin)) {
			oError.innerHTML = 'Invalid nickname.';
			return;
		}
		oLogo.style.display = 'none';
		oLogin.style.display = 'none';
		if (oOpt.hires && oOpt.hires.checked) {
			oScreen.width = 800;
			oScreen.height = 500;
		}
		oScreen.style.display = '';
		startGame(sLogin);
	};
	oScreen.style.display = 'none';
	oNickname.addEventListener('keypress', function(oEvent) {
		oError.innerHTML = '&nbsp;';
		if (oEvent.keyCode == 13) {
			doLogin();
		}
	});
	oConnect.addEventListener('click', doLogin);
	oNickname.focus();
}


function main() {
	loginForm();
}

window.addEventListener('load', main);
