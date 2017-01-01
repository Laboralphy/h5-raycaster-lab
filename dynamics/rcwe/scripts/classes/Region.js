/**
 * Rectangular Region Toolkit
 */

O2.createClass('RCWE.Region', {
	xmin: null, 
	ymin: null,
	xmax: null, 
	ymax: null,
	
	/**
	 * The constructor accepts 4 integers
	 * to initialize the region
	 */
	__construct: function(x1, y1, x2, y2) {
		this.set(x1, y1, x2, y2);
	},
	
	/**
	 * Assign new coordinates
	 */
	set: function(x1, y1, x2, y2) {
		this.xmin = Math.min(x1, x2);
		this.xmax = Math.max(x1, x2);
		this.ymin = Math.min(y1, y2);
		this.ymax = Math.max(y1, y2);
		return this;
	},
	
	/**
	 * Extends the region
	 * @param x coordonnée du point à englober
	 * @param y
	 * @param x2 second point
	 * @param y2
	 * @returns
	 */
	extend: function(x, y, x2, y2) {
		this.xmin = Math.min(this.xmin, x);
		this.xmax = Math.max(this.xmax, x);
		this.ymin = Math.min(this.ymin, y);
		this.ymax = Math.max(this.ymax, y);
		if (x2 != undefined) {
			this.extend(x2, y2);
		}
	}
});
