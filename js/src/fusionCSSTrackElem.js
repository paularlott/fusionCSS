/**
 * JavaScript to track elements and optionally stick elements, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

(function() {
	var extend = window.jQuery || window.fusionLib,
		tracked = [],
		lastScroll = extend(window).scrollTop(),
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
			tracked[idx].handler.call(tracked[idx].element, direction);
			tracked[idx].element.trigger('pointReached', [direction]);
		}
		else if(lastScroll <= tracked[idx].top && !tracked[idx].before) {
			tracked[idx].before = true;
			tracked[idx].handler.call(tracked[idx].element, direction);
			tracked[idx].element.trigger('pointReached', [direction]);
		}
	}

	extend.fn.extend({

		/**
		 * Add tracking to a point.
		 * @param opts { offset, handler }
		 */
		trackPoint: function(opts) {
			opts = opts ? opts : {};

			var offset = opts.offset ? opts.offset : 0,
				handler = opts.handler ? opts.handler : function () {},
				offsetType = typeof offset === 'string' && offset.match(/%$/) ? '%' : 'px';

			return this.each(function() {
				var el = extend(this),
					d = {
						element: el,
						top: el.offset().top + (offsetType == '%'
								? ((parseInt(offset) / 100) * extend(window).height())
								: parseInt(offset)
						),
						before: true,
						offset: offset,
						handler: handler
					};

				tracked.push(d);

				// If point already reached then flag it
				if(lastScroll >= d.top)
					testTrigger(tracked.length - 1, 'down');
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
				var el = extend(this);

				for(var i=0;i<tracked.length;i++) {
					if(this === tracked[i].element.get(0)) {
						var oldTop = tracked[i].top,
							top = tracked[i].element.offset().top + (offsetType == '%'
									? ((parseInt(offset) / 100) * extend(window).height())
									: parseInt(offset)
							);
						tracked[i].offset = offset;
						tracked[i].top = top;

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
	extend(window).on('scroll', function () {
		var top = extend(window).scrollTop(),
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
		// Recalculate offsets and see if points changed
		for(var i=0;i<tracked.length;i++) {
			var oldTop = tracked[i].top,
				offsetType = typeof tracked[i].offset === 'string' && tracked[i].offset.match(/%$/) ? '%' : 'px',
				top = tracked[i].element.offset().top + (offsetType == '%'
						? ((parseInt(tracked[i].offset) / 100) * extend(window).height())
						: parseInt(tracked[i].offset)
				);
			tracked[i].top = top;

			if(oldTop != tracked[i].top) {
				testTrigger(i, tracked[i].top > oldTop ? 'up' : 'down');
			}
		}
	});


	/**
	 * Implement sticky elements
	 */
	extend.fn.extend({

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
			opts.canStick = false;

			return this.each(function() {
				var el = extend(this);
				el.get(0)._stickyOpts = Object.assign({}, opts);

				// Wrap the element
				el.wrap('<div class="stickyWrapper"></div>');

				// Add handler to the element
				el.trackPoint({
					handler: function(direction) {
						var opts = this.get(0)._stickyOpts;

						if(direction == 'down') {
							opts.canStick = true;

							// Check width restrictions
							var w = $(window).width();
							if((opts.minWidth == null || w >= opts.minWidth) && (opts.maxWidth == null || w <= opts.maxWidth)) {
								// Stick the element
								opts.stuck = true;
								this.parent().height(this.outerHeight(true));
								this.addClass(opts.stuckClass);
								opts.handler.call(this, 'stuck');
								this.trigger('stuck');
							}
						}
						else {
							opts.canStick = false;

							// Check width restrictions
							var w = $(window).width();
							if(opts.stuck || ((opts.minWidth == null || w >= opts.minWidth) && (opts.maxWidth == null || w <= opts.maxWidth))) {
								// Unstick element
								opts.stuck = false;
								this.parent().height('');
								this.removeClass(opts.stuckClass);
								opts.handler.call(this, 'unstuck');
								this.trigger('unstuck');
							}
						}
					},
					offset: opts.offset
				});

				stickyList.push(el)
			});
		},

		/**
		 * Set the offset for sticky.
		 *
		 * @param offset The offset.
		 */
		stickyOnScrollOffset: function(offset) {
			return this.each(function() {
				for(var i=0;i<stickyList.length;i++) {
					if(stickyList[i].get(0) === this) {
						stickyList[i].get(0)._stickyOpts.offset = offset;
						stickyList[i].trackPointSetOffset(offset);
						break;
					}
				}
			});
		}
	});

	/**
	 * Catch resize events and stick / unstick elements now failing width restrictions.
	 */
	extend(window).on('resize', function() {
		var w = extend(window).width();

		for(var i=0;i<stickyList.length;i++) {
			var opts = stickyList[i].get(0)._stickyOpts;

			// Find the stuck elements and see if it can stay stuck
			if(opts.stuck && ((opts.minWidth != null && w < opts.minWidth) || (opts.maxWidth != null && w > opts.maxWidth))) {
				// Unstick element
				opts.stuck = false;
				stickyList[i].parent().height('');
				stickyList[i].removeClass(opts.stuckClass);
				opts.handler.call(stickyList[i], 'unstuck');
				stickyList[i].trigger('unstuck');
			}
			// Find the stickable elements and see if can stick
			else if(opts.canStick && !opts.stuck && (opts.minWidth == null || w >= opts.minWidth) && (opts.maxWidth == null || w <= opts.maxWidth)) {
				// Stick the element
				opts.stuck = true;
				stickyList[i].parent().height(stickyList[i].outerHeight(true));
				stickyList[i].addClass(opts.stuckClass);
				opts.handler.call(stickyList[i], 'stuck');
				stickyList[i].trigger('stuck');
			}
		}
	});

})();
