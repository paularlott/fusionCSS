/**
 * JavaScript to allow drag ordering of elements, works with jQuery or fusionLib.
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

	$.fn.extend({
		/**
		 * Make the selected element a container for dragable elements.
		 *
		 * @param opts { offset, handler }
		 */
		makeDragContainer: function(opts) {
			opts = opts || {};
			opts.dragMarkerClass = opts.dragMarkerClass || 'dragMarker';
			opts.dragItemClass = opts.dragItemClass || 'dragItem';
			opts.dragDraggingClass = opts.dragDraggingClass || 'dragDragging';
			opts.disableDragInto = opts.disableDragInto || false;
			opts.dragTopOnly = opts.dragTopOnly || false;

			return this.each(function() {
				var dragContainer = $(this),
					dragElement = null,
					dragMarker,
					dragX,
					dragY,
					dragOffsetX = 0,
					dragOffsetY = 0,
					dropTarget = null,
					dropPosition = null,
					scrollTimer = null,
					scrollWhat = null,
					scrollStepY,
					lastMoveEvent,
					useContainerScroll = false;

				// Add a container for the element being dragged
				if(!dragContainer.find('.' + opts.dragMarkerClass).length)
					dragContainer.append('<div class="' + opts.dragMarkerClass + '" style="display: none;"></div>');

				// Mark the drag items
				if(opts.dragTopOnly) {
					var list = dragContainer.find('ul');
					if(!list.length)
						list = dragContainer.find('ol');
					list.first().children().addClass(opts.dragItemClass);
				}
				else
					dragContainer.find('li').addClass(opts.dragItemClass);

				// Test if the list is a direct child of the container
				if(dragContainer.find('li').parent().parent()[0] === dragContainer[0]) {
					useContainerScroll = true;
				}

				// Add handlers
				dragContainer
					.on('mousedown', dragStart)
					.on('touchstart', dragStart);

				// Catch escape key
				$(document).on('keyup', function(evt) {
					if(dragElement && evt.key === 'Escape') {
						dragEnd(evt);
						evt.preventDefault();
					}
				});

				/**
				 * Handle the start of the drag process.
				 *
				 * @param {Object} e
				 */
				function dragStart(e) {
					var target = $(e.target),
						el = target.closest('.' + opts.dragItemClass),
						cOffset = dragContainer.offset();

					// If have and element then start the drag as long as it's not a link
					if(!target.closest('a').length && el.length) {
						if (e.touches && e.touches.length) {
							dragX = e.touches[0].pageX;
							dragY = e.touches[0].pageY;
						}
						else {
							dragX = e.pageX;
							dragY = e.pageY;
						}

						// Calculate the offset for dragging
						dragOffsetX = dragX - el.offset().left;
						dragOffsetY = dragY - el.offset().top;

						// Normalise mouse to container
						dragX -= cOffset.left;
						dragY -= cOffset.top;
						if(useContainerScroll) {
							dragX += dragContainer.scrollLeft();
							dragY += dragContainer.scrollTop();
						}

						var d = {
							dragging: el,
							eventTarget: target,
							allowDrag: true
						};

						dragContainer.trigger('draggingStart', d);
						if(d.allowDrag) {
							e.preventDefault();

							dragElement = el;
							dragElement.addClass(opts.dragDraggingClass);
							dropTarget = dropPosition = null;

							// Setup the drag marker
							dragMarker = dragContainer.find('.' + opts.dragMarkerClass);

							if(opts.copyFunction)
								opts.copyFunction(dragMarker, dragElement);
							else
								dragMarker.html(dragElement.html());

							dragMarker
								.css('left', dragX - dragOffsetX + 'px')
								.css('top', dragY - dragOffsetY + 'px')
								.width(dragElement.outerWidth(true));

							// Enable handlers
							dragContainer
								.on('mousemove', dragMove)
								.on('touchmove', dragMove)
								.on('mouseup', dragEnd)
								.on('touchend', dragEnd);
						}
					}
				}

				/**
				 * Auto scroll
				 */
				function autoScroll() {
					scrollWhat.scrollTop(scrollWhat.scrollTop() + scrollStepY);
					dragMove(lastMoveEvent);
				}

				/**
				 * Start auto scroller.
				 *
				 * @param {object} what The element to scroll.
				 * @param {number} stepY The step direction.
				 */
				function startAutoScroll(what, stepY) {
					if(stepY) {
						// If what has changed then stop auto scroll
						if(scrollTimer && what[0] != scrollWhat[0])
							stopAutoScroll();

						scrollWhat = what;
						scrollStepY = stepY * 2;
						if(scrollTimer === null) {
							scrollTimer = window.setInterval(autoScroll, 15);
						}
					}
					else if(scrollTimer)
						stopAutoScroll();
				}

				/**
				 * Stop the auto scroller
				 */
				function stopAutoScroll() {
					if(scrollTimer !== null) {
						window.clearInterval(scrollTimer);
						scrollTimer = null;
					}
				}

				/**
				 * Handle the drag move.
				 *
				 * @param {Object} e
				 */
				function dragMove(e) {
					var x, y,
						cx, cy,
						cOffset = dragContainer.offset(),
						rect = dragContainer[0].getBoundingClientRect();

					e.preventDefault();
					e.stopPropagation();

					lastMoveEvent = e;

					if (e.touches && e.touches.length) {
						x = e.touches[0].pageX;
						y = e.touches[0].pageY;
						cx = e.touches[0].clientX;
						cy = e.touches[0].clientY;
					}
					else {
						x = e.pageX;
						y = e.pageY;
						cx = e.clientX;
						cy = e.clientY;
					}

					x -= cOffset.left;
					y -= cOffset.top;

					if(useContainerScroll) {
						x += dragContainer.scrollLeft();
						y += dragContainer.scrollTop();
					}

					// Check if still in container
					if(cx <= Math.ceil(rect.left + 2) || cx >= Math.floor(rect.right - 2) ||
						cy <= Math.ceil(rect.top + 2) || cy >= Math.floor(rect.bottom - 2)) {
						dragEnd(e);
					}
					else {
						dragMarker
							.css('left', x - dragOffsetX + 'px')
							.css('top', y - dragOffsetY + 'px');

						// Get the element under the marker
						dragMarker.hide();
						var el = document.elementFromPoint(cx, cy);
						el = $(el).closest('.' + opts.dragItemClass);
						if(el.length && !el.hasClass(opts.dragDraggingClass) && !el.closest('.' + opts.dragDraggingClass).length) {
							var dx = Math.abs(dragX - x),
								dy = Math.abs(dragY - y);

							// Get the rectangle for the element
							var rectOvr = el[0].getBoundingClientRect(),
								allowDropOn = true;

							if(opts.disableDragInto || (opts.disableDropOn && el.attr(opts.disableDropOn) === 'true'))
								allowDropOn = false;

							// Build event data
							var d = {
								dragging: dragElement,
								dropTarget: el,
								dropPosition: 'on',
								allowPosition: true
							};

							// If dx dominant the compare on horizontal
							if(dx > dy) {
								var w = allowDropOn ? rectOvr.width / 3 : rectOvr.width / 2;
								if(cx > (rectOvr.right - w)) {
									dragElement.css('opacity', 1);
									dropPosition = 'after';

									// If not already the next element
									if(el.next()[0] !== dragElement[0]) {
										dragContainer.trigger('draggingOver', d);
										if(d.allowPosition) {
											dragElement.remove();
											dragElement.insertAfter(el);

											dragX = x;
											dragY = y;

											dropTarget = el;
										}
									}
								}
								else if(cx < (rectOvr.left + w)) {
									dragElement.css('opacity', 1);
									dropPosition = 'before';

									// If not already the previous element
									if(el.prev()[0] !== dragElement[0]) {
										dragContainer.trigger('draggingOver', d);
										if(d.allowPosition) {
											dragElement.remove();
											dragElement.insertBefore(el);

											dragX = x;
											dragY = y;

											dropTarget = el;
										}
									}
								}
								else if(allowDropOn && (el[0] !== dragElement[0] || dropPosition !== 'on')) {
									dragContainer.trigger('draggingOver', d);
									if(d.allowPosition) {
										dropPosition = 'on';
										dragElement.css('opacity', .2);
										dropTarget = el;
									}
								}
							}
							// Else Y direction is dominant so compare vertical
							else {
								var h = allowDropOn ? rectOvr.height / 3 : rectOvr.height / 2;
								if(cy > (rectOvr.bottom - h)) {
									dragElement.css('opacity', 1);
									dropPosition = 'after';

									// If not already the next element
									if(el.next()[0] !== dragElement[0]) {
										dragContainer.trigger('draggingOver', d);
										if(d.allowPosition) {
											dragElement.remove();
											dragElement.insertAfter(el);

											dragX = x;
											dragY = y;

											dropTarget = el;
										}
									}
								}
								else if(cy < (rectOvr.top + h)) {
									dragElement.css('opacity', 1);
									dropPosition = 'before';

									// If not already the previous element
									if(el.prev()[0] !== dragElement[0]) {
										dragContainer.trigger('draggingOver', d);
										if(d.allowPosition) {
											dragElement.remove();
											dragElement.insertBefore(el);

											dragX = x;
											dragY = y;

											dropTarget = el;
										}
									}
								}
								else if(allowDropOn && (el[0] !== dragElement[0] || dropPosition !== 'on')) {
									dragContainer.trigger('draggingOver', d);
									if(d.allowPosition) {
										dropPosition = 'on';
										dragElement.css('opacity', .2);
										dropTarget = el;
									}
								}
							}
						}
						dragMarker.show();

						// If container off screen then scroll window else container
						var within = 30;
						if(
							(rect.top < 0 || rect.bottom > $(window).height()) &&
							(cy < within || cy > ($(window).height() - within))
						) {
							if(cy < within)
								startAutoScroll($(window), -1);
							else
								startAutoScroll($(window), 1);
						}
						else {
							if(cy < rect.top + within)
								startAutoScroll(dragContainer, -1);
							else if(cy > rect.bottom - within)
								startAutoScroll(dragContainer, 1);
							else
								stopAutoScroll();
						}
					}
				}

				/**
				 * Handle the end of the drag.
				 *
				 * @param {Object} e
				 */
				function dragEnd(e) {
					if(dragElement) {
						dragElement.css('opacity', 1);
						e.preventDefault();

						// Disable handlers
						dragContainer
							.off('mousemove', dragMove)
							.off('touchmove', dragMove)
							.off('mouseup', dragEnd)
							.off('touchend', dragEnd);

						stopAutoScroll();

						dragMarker.hide();
						dragElement.removeClass(opts.dragDraggingClass);
						var d = {
							dragging: dragElement,
							dropTarget: dropPosition === null ? null : dropTarget,
							dropPosition: dropPosition
						};
						dragElement = null;
						dragContainer.trigger('draggingEnd', d);
					}
				}
			});
		}
	});

})();
