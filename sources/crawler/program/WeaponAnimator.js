/** Animation du sprite de l'arme en cours d'utilisation.
 * La classe calcule à chaque frame, la position du sprite réprésentant
 * l'arme actuellement équipée.
 */
O2.createClass('WeaponAnimator', {
	oWeaponLayer: null,
	oRaycaster: null,
	bInvalid: true,
	wScreen: 0,
	hScreen: 0,
	xWeapon: 0,
	yWeapon: 0,
	xCalibration: 0,
	yCalibration: 0,
	xShift: 0,
	yShift: 0,
	nDraw: 0,
	nDrawSpeed: 20,
	fOscilloSpeed: 0,
	
	oAnimation: null,
	oAnimationLibrary: null,
	sTile: '',
	sAnim: '',
	
	__construct: function() {
		this.oAnimation = new O876_Raycaster.Animation();
	},
	
	selectWeapon: function(wd) {
		this.sAnim = '';
		var wm = WEAPON_MODELS_DATA[wd.model];
		
		this.sTile = wm.tile;

		this.oAnimationLibrary = {
			ready: {
				nStart: wm.startframe,
				nCount: 1,
				nDuration: 0,
				nLoop: 0,
				nIndex: 0,
				nTime: 0
			},
			charging: {
				nStart: wm.startframe,
				nCount: 3,
				nDuration: 100,
				nLoop: 2,
				nIndex: 0,
				nTime: 0
			},
			stabbing: {
				nStart: wm.startframe + 1,
				nCount: 3,
				nDuration: 100,
				nLoop: 0,
				nIndex: 0,
				nTime: 0
			}
		};
		this.nDraw = 120;
		this.setAnimation('ready');
	},
	
	calibrateWeapon: function(x, y) {
		this.xShift = 0;
		this.yShift = 0;
		this.xCalibration = x;
		this.yCalibration = y;
	},
	
	setAnimation: function(sAnim) {
		if (sAnim != this.sAnim) {
			this.oAnimation.assign(this.oAnimationLibrary[sAnim]);
			this.sAnim = sAnim;
			this.oAnimation.reset();
		}
	},
	
	compute: function(nTime, bMoving, sAnim) {
		this.setAnimation(sAnim);
		this.nIndex = this.oAnimation.animate(this.nDrawSpeed);
		if (this.nDraw > 0) {
			this.nDraw = Math.max(0, this.nDraw - (this.nDrawSpeed >> 2));
		}
		this.yShift = this.nDraw;
		if (bMoving) {
			var fTime = MathTools.toRad(nTime * this.fOscilloSpeed);  // 0.017453 = PI / 180
			this.xShift = 32 * Math.sin(fTime);
			this.yShift += Math.abs(32 * Math.cos(fTime));
		} else {
			this.xShift = 0;
		}
		this.xWeapon = this.xCalibration + this.xShift | 0;
		this.yWeapon = this.yCalibration + this.yShift | 0;
	}
});
