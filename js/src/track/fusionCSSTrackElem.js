/**
 * JavaScript to track elements and optionally stick elements, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2018 - 2019 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

(function() {
	var tracked = [],
		lastScroll = $(window).scrollTop(),
		stickyList = [];

	/**
	 * Test if point reached and trigger handler.
	 *
	 * @param int idx The index of the element being updated.
	 * @param string direction 'up' or 'down' depending on the direction of travel.
	 */
	function testTrigger(idx, direction) {
		// If hit point
		if(lastScroll >= tracked[idx].top && tracked[idx].before) {
			tracked[idx].before = false;
			tracked[idx].handler.call(tracked[idx].element, direction, tracked[idx]);
			tracked[idx].element.trigger('pointReached', [direction]);
		}
		else if(lastScroll < tracked[idx].top && !tracked[idx].before) {
			tracked[idx].before = true;
			tracked[idx].handler.call(tracked[idx].element, direction, tracked[idx]);
			tracked[idx].element.trigger('pointReached', [direction]);
		}
	}

	$.fn.extend({

		/**
		 * Add tracking to a point.
		 * @param opts { offset, handler }
		 */
		trackPoint: function(opts) {
			opts = opts ? opts : {};

			var offset = opts.offset ? opts.offset : 0,
				handler = opts.handler ? opts.handler : function () {},
				onBeforeResize = opts.onBeforeResize ? opts.onBeforeResize : function () {},
				onAfterResize = opts.onAfterResize ? opts.onAfterResize : function () {},
				offsetType = typeof offset === 'string' && offset.match(/%$/) ? '%' : 'px';

			return this.each(function() {
				var el = $(this),
					offsetPixels = offsetType == '%'
						? ((parseInt(offset) / 100) * $(window).height())
						: parseInt(offset),
					d = {
						element: el,
						top: el.offset().top - offsetPixels,
						before: true,
						offset: offset,
						offsetPixels: offsetPixels,
						handler: handler,
						onBeforeResize: onBeforeResize,
						onAfterResize: onAfterResize
					};

				// Remember the element
				tracked.push(d);

				// Wrap the element
				el.wrap('<div class="trackPointWrapper"></div>');

				// If point already reached then flag it
				if(lastScroll >= d.top)
					testTrigger(tracked.length - 1, 'down');

				// Sort the tracked list top first
				tracked.sort(function(a, b) {
					return b.top - a.top;
				});
			});
		},

		/**
		 * Update the offset.
		 *
		 * @param int offset The offset.
		 */
		trackPointSetOffset: function(offset) {
			var offsetType = typeof offset === 'string' && offset.match(/%$/) ? '%' : 'px';

			return this.each(function() {
				for(var i=0;i<tracked.length;i++) {
					if(this === tracked[i].element[0]) {
						var oldTop = tracked[i].top,
							offsetPixels = offsetType == '%'
								? ((parseInt(offset) / 100) * $(window).height())
								: parseInt(offset);

						tracked[i].top = tracked[i].element.offset().top - offsetPixels;
						tracked[i].offset = offset;
						tracked[i].offsetPixels = offsetPixels;

						if(oldTop != tracked[i].top) {
							testTrigger(i, tracked[i].top > oldTop ? 'up' : 'down');
						}

						break;
					}
				}
			});
		}
	});

	/**
	 * Tack the scrolling.
	 */
	$(window).on('scroll', function () {
		var top = $(window).scrollTop(),
			direction = top > lastScroll ? 'down' : 'up';

		if(top != lastScroll) {
			lastScroll = top;

			for(var i=0;i<tracked.length;i++) {
				testTrigger(i, direction);
			}
		}
	})

	/**
	 * Track resize events.
	 */
		.on('resize', function() {
			for(var i=0;i<tracked.length;i++) {

				// Call the before resize handler
				tracked[i].onBeforeResize.call(tracked[i].element, tracked[i]);

				// Recalculate the top
				var oldTop = tracked[i].top,
					offsetType = typeof tracked[i].offset === 'string' && tracked[i].offset.match(/%$/) ? '%' : 'px',
					offsetPixels = offsetType == '%'
						? ((parseInt(tracked[i].offset) / 100) * $(window).height())
						: parseInt(tracked[i].offset);

				tracked[i].top = tracked[i].element.offset().top - offsetPixels;
				tracked[i].offsetPixels = offsetPixels;

				if(oldTop != tracked[i].top) {
					testTrigger(i, tracked[i].top > oldTop ? 'up' : 'down');
				}

				// Call the after resize handler
				tracked[i].onAfterResize.call(tracked[i].element, tracked[i]);
			}
		});

	/**
	 * Calculate the offsets for each element.
	 *
	 * @param opts
	 * @return {*}
	 * @private
	 */
	function _calcOffset(opts) {
		var offset = opts.offset;
		if(opts.stoppedBy) {

			// Work up tree to see if parents have an offset
			var el = opts.stoppedBy;
			do {
				offset += el.outerHeight(true);
				el = el[0]._stickyOpts ? el[0]._stickyOpts.stoppedBy : null;
			} while(el);
		}

		return offset;
	}

	/**
	 * Implement sticky elements
	 */
	$.fn.extend({

		/**
		 * Configure element to stick on scroll.
		 *
		 * @param map opts configuration options.
		 */
		stickyOnScroll: function(opts) {
			opts = opts ? opts : {};

			opts.stuckClass = opts.stuckClass ? opts.stuckClass : 'stuck';
			opts.handler = opts.handler ? opts.handler : function() {};
			opts.minWidth = opts.minWidth ? opts.minWidth : null;
			opts.maxWidth = opts.maxWidth ? opts.maxWidth : null;
			opts.offset = opts.offset ? opts.offset : 0;
			opts.stuck = false;
			opts.stoppedBy = opts.stoppedBy ? opts.stoppedBy : null;
			opts.releasedBy = opts.releasedBy ? opts.releasedBy : null;
			opts.releasedByEdge = opts.releasedByEdge ? opts.releasedByEdge : 'bottom';
			opts.released = false;

			return this.each(function() {
				var el = $(this);
				el[0]._stickyOpts = opts;

				// Add handler to the element
				el.trackPoint({
					// Handle the tracked point crossing the boundry
					handler: function(direction, trackData) {
						var opts = this[0]._stickyOpts;

						if(direction == 'down') {

							// Stick the element
							opts.stuck = true;
							this.parent().height(this.outerHeight(true));
							this.addClass(opts.stuckClass).css('top', trackData.offsetPixels + 'px');
							opts.handler.call(this, 'stuck');
							this.trigger('stuck');

							// If have a release element recalculate the offsets
							if(opts.releasedBy) {
								opts.releasedBy.trackPointSetOffset(
									-(opts.releasedByEdge === 'top' ? 0 : opts.releasedBy.outerHeight(false)) + (this.position().top + this.outerHeight(false))
								);
							}
						}
						else if(direction == 'up') {

							// Unstick element
							opts.stuck = false;
							this.parent().height('');
							this.removeClass(opts.stuckClass);
							opts.handler.call(this, 'unstuck');
							this.trigger('unstuck');
						}
					},
					// Handle window resize events for stuck elements
					onBeforeResize: function() {

						// If the element is stuck then update the size of the spacer
						if(this[0]._stickyOpts.stuck) {
							this.parent().height('');
							this.removeClass(opts.stuckClass);
						}
						this.trackPointSetOffset(_calcOffset(this[0]._stickyOpts));
					},
					onAfterResize: function(trackData) {
						// If the element is stuck then update the size of the spacer
						if(this[0]._stickyOpts.stuck) {
							this.parent().height(this.outerHeight(true));
							this.addClass(opts.stuckClass).css('top', trackData.offsetPixels + 'px');

							// If have a release element recalculate the offsets
							if(opts.releasedBy) {
								opts.releasedBy.trackPointSetOffset(
									-(opts.releasedByEdge === 'top' ? 0 : opts.releasedBy.outerHeight(false)) + (this.position().top + this.outerHeight(false))
								);
							}
						}
					},
					offset: _calcOffset(opts) //opts.offset
				});

				// If a lower element can bump the element to unstick then track
				if(opts.releasedBy) {
					opts.releasedBy.trackPoint({
						handler: function(direction, trackData) {
							var opts = el[0]._stickyOpts;
							if(opts.stuck) {
								if (direction == 'up') {
									el.addClass(opts.stuckClass);
									opts.released = false;
								} else if (direction == 'down') {
									el.removeClass(opts.stuckClass);
									opts.released = true;
								}
							}
						},
						onBeforeResize: function() {
							if(el[0]._stickyOpts.released && el[0]._stickyOpts.stuck)
								el.add(opts.stuckClass);
						},
						onAfterResize: function(trackData) {
							if(el[0]._stickyOpts.released && el[0]._stickyOpts.stuck)
								el.removeClass(opts.stuckClass);
						},
						offset: -(opts.releasedByEdge === 'top' ? 0 : opts.releasedBy.outerHeight(false)) + (el.position().top + el.outerHeight(false))
					});
				}

				// Mark the wrapper class
				el.parent().addClass('stickyWrapper');

				// Remember the element
				stickyList.push(el);
			});
		},

		/**
		 * Set the offset for sticky.
		 *
		 * @param offset The offset.
		 */
		stickyOnScrollOffset: function(offset) {
			return this.each(function() {
				this._stickyOpts.offset = offset;
				$(this).trackPointSetOffset(_calcOffset(this._stickyOpts));
			});
		}
	});

})();
