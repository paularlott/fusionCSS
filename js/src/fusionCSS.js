/**
 * JavaScript helpers for fusionCSS, works with jQuery of fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2016 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

// jQuery or fusionLib
if(!window.fusionLib)
	window.$fl = window.fusionLib = jQuery;

(function() {
	/**
	 * The ID of the toast timer
	 */
	var toastTimer = 0,
		toastClass = '',
		toastHasHTML = false;

	fusionLib.fn.extend({
		/**
		 * Enable tab functionality.
		 *
		 * @param string activeTab The optional name of the active tab.
		 */
		tabs: function(activeTab) {
			var widgetName = this[0].id,
				tabActive,
				aTab,
				tabs = {};

			if(this.attr('data-tabs-enabled') != '1') {
				this.attr('data-tabs-enabled', '1');

				// Check for active tab
				if((aTab = this.attr('data-tabs-active')) != null) {
					tabActive = aTab;
				}

				this.find('.tabs li').each(function () {
					var el = $fl(this),
						tabName,
						panel;

					// If direct child
					if (el.parent().parent()[0].id == widgetName) {

						if ((tabName = el.attr('data-tabpanel')) == null)
							tabName = el.find('a').attr('href').replace(/^.*#/, '');
						panel = $fl('#' + tabName);

						if (tabActive == undefined || (activeTab != undefined && activeTab == tabName))
							tabActive = tabName;

						// Hide panel
						if (tabName != tabActive)
							panel.addClass('tabhidepanel').attr('aria-expanded', false);

						el.parent().attr('aria-selected', false);
						tabs[tabName] = [el, panel];

						// Add click handler to tabs
						el.bind('click', function (evt) {
							tabs[tabActive][1].addClass('tabhidepanel').attr('aria-expanded', false);
							tabs[tabName][1].removeClass('tabhidepanel').attr('aria-expanded', true);
							tabs[tabActive][0].removeClass('active').parent().attr('aria-selected', false);
							tabs[tabName][0].addClass('active').parent().attr('aria-selected', true);
							tabActive = tabName;

							// Trigger an event for the click.
							el.trigger('fcss:tabclick');

							evt.preventDefault();
							evt.stopPropagation();
							return false;
						})
					}
				});

				// Set the active tab
				if (tabActive != undefined) {
					tabs[tabActive][0].addClass('active').parent().attr('aria-selected', true);
					tabs[tabActive][1].removeClass('tabhidepanel').attr('aria-expanded', true);
				}

				// Look to see if in a form
				var n = this[0];
				while (n) {
					if (n.tagName == 'FORM') {
						function selectTabWithErrors() {
							for (var m in tabs) {
								if (tabs[m][1].find('.validation').hasClass('failed')) {
									tabs[m][0].trigger('click');
									break;
								}
							}
						}

						// Capture validation failures
						$fl(n).bind('formValidationFailed', selectTabWithErrors).addClass('tabwidgetcontainer');
						selectTabWithErrors();
						break;
					}
					n = n.parentNode;
				}
			}

			return this;
		},

		/**
		 * Display a message in the toast popup.
		 *
		 * @param string type The toast type, success, warning, error, primary, accent
		 * @param string msg The message to display in the toast popup.
		 * @param string actionLabel The label to show on the action e.g. dismiss.
		 * @param function callback The function to call if the action is clicked.
		 * @param bool withTimeout true to auto dismiss the popup.
		 */
		toastShow: function(type, msg, actionLabel, callback, withTimeout) {
			var delay = 0;

			// Add the toast container to the page
			if(!toastHasHTML) {
				$fl('body').append('<div id="toast" role="alert" aria-hidden="true"></div>');
				toastHasHTML = true;
			}

			toastClass = type;

			if(actionLabel) {
				msg = '<a href="#">' + actionLabel + '</a>' + msg
			}

			if (toastTimer) {
				clearTimeout(toastTimer);
				toastTimer = 0;
				delay = 300;
			}
			else if($fl('#toast').hasClass('exposed'))
				delay = 300;

			$fl('#toast')
				.removeClass('exposed')
				.removeClass('success')
				.removeClass('error')
				.removeClass('warning')
				.removeClass('accent')
				.removeClass('primary')
				.attr('aria-hidden', true);

			setTimeout(function () {
				$fl('#toast')
					.html(msg)
					.addClass('exposed')
					.addClass(type)
					.attr('aria-hidden', false);

				// Action toast
				if(actionLabel) {
					$fl('#toast a').bind('click', function(e) {
						if (toastTimer) {
							clearTimeout(toastTimer);
							toastTimer = 0;
						}
						$fl('#toast').removeClass('exposed').attr('aria-hidden', true);

						if(callback) {
							callback();
						}

						e.preventDefault();
					});
				}

				// Timeout toast
				if((!actionLabel && withTimeout !== false) || withTimeout === true) {
					toastTimer = setTimeout(function () {
						$fl('#toast')
							.removeClass('exposed')
							.removeClass(type)
							.attr('aria-hidden', true);
						toastTimer = 0;
					}, 5000);
				}
			}, delay);

			return this;
		},

		/**
		 * Hide any visible toast messages.
		 */
		toastHide: function() {
			if (toastTimer) {
				clearTimeout(toastTimer);
				toastTimer = 0;
			}

			$fl('#toast')
				.removeClass('exposed')
				.removeClass(toastClass)
				.attr('aria-hidden', true);
		}
	});

	fusionLib.toastShow = fusionLib.fn.toastShow;
	fusionLib.toastHide = fusionLib.fn.toastHide;

	$fl(document).ready(function() {

		// Enable tabs
		$fl('.tabwidget').each(function() {
			$fl(this).tabs();
		});

		/**
		 * Find all upload buttons and set to copy file name to display
		 */
		$fl('.uploadButton input').bind('change', function(e) {
			$fl(this).parent().find('span').html($fl(this).val().split(/(\\|\/)/g).pop());
		});

		/**
		 * Setup responsive tables
		 */
		$fl("table.responsive").each(function(i, e) {
			$fl(e).wrap('<div class="responsiveTableWrapper" />');
			$fl(e).wrap('<div class="responsiveTableWrapperInner" />');
		});

		/**
		 * Build the slide in menu if required
		 */
		if($fl('#viewSlideInMenu').length) {
			// Add markup to body
			$fl('body').append('<div id="slideInMenuOverlay"></div>');

			// Build the slidein menu if not already defined
			if(!$fl('#slideInMenu').length) {
				$fl('body').append('<div id="slideInMenu" role="menu"></div>');

				// Copy menu HTML to slide in
				$fl('.slideInMenu').each(function (idx) {
					var o = '', e = '';

					if(this.nodeName.toLowerCase() == 'ul') {
						o = '<ul>';
						e = '</ul>';
					}

					if ($fl(this).hasClass('slideInMenuRootOnly')) {
						$fl('#slideInMenuOverlay')
							.html(o + $fl(this).html() + e)
							.find('li ul').remove();
						$fl('#slideInMenu').append($fl('#slideInMenuOverlay').html());
					}
					else
						$fl('#slideInMenu').append(o + $fl(this).html() + e);
				});
			}

			$fl('#slideInMenu').attr('aria-hidden', true);

			// Capture menu hide, click off menu
			$fl('#slideInMenuOverlay')
				.html('')
				.bind('click', function(e) {
					$fl('#slideInMenu')
						.removeClass('slideInMenuShow')
						.attr('aria-hidden', true);
					$fl('#slideInMenuOverlay').removeClass('slideInMenuShow');
					$fl('body').removeClass('disableScroll');
				});

			// Capture menu expose
			$fl('#viewSlideInMenu').bind('click', function(e) {
				$fl('body').addClass('disableScroll');
				$fl('#slideInMenuOverlay').addClass('slideInMenuShow');
				$fl('#slideInMenu')
					.addClass('slideInMenuShow')
					.attr('aria-hidden', false);
			});
		}

		/**
		 * Add scroll to top
		 */
		var toTop = $fl('#scrollToTop');
		if(toTop.length) {
			function scrollToTop() {
				var e = $fl(window);
				if(e.scrollTop() > 0) {
					e.scrollTop(Math.max(0, e.scrollTop() - Math.max(10, e.scrollTop() / 20)));
					window.setTimeout(scrollToTop, 10);
				}
			}

			toTop.bind('click', scrollToTop);

			$fl(window).bind('scroll', function() {
				if($fl(this).scrollTop() > (toTop.attr('data-showat') != null ? toTop.attr('data-showat') : 600))
					toTop.removeClass('hide');
				else
					toTop.addClass('hide');
			});
		}

		/**
		 * Label styling
		 */
		function styleLabel() {
			var el = $fl(this),
				l = $fl('#' + el.attr('id') + '-label'),
				t = el.attr('type');

			if(t != 'checkbox' && t != 'submit' && t != 'file') {
				el.bind('focus', function () {
					l.addClass('focused');
				}).bind('blur', function () {
					l.removeClass('focused');
				});
			}
		}

		/**
		 * Worker function to setup floating labels
		 */
		function setupFloatingLabels() {
			var el = $fl(this),
				t = el.attr('type');

			if(el.attr('data-floating-label') != 'disabled' && !el.hasClass('hasFloatingLabel') && t != 'checkbox' && t != 'submit' && t != 'file') {
				var l = $fl('#' + el.attr('id') + '-label');
				if(l.length) {
					if(el.is('textarea')) {
						l.addClass('floatTextarea');
					}

					el.addClass('hasFloatingLabel');
					el.bind('focus', function () {
						l.removeClass('floatDown').addClass('floatUp');
					}).bind('blur', function () {
						if (el.is('select') || el.val())
							l.removeClass('floatDown').addClass('floatUp');
						else
							l.addClass('floatDown').removeClass('floatUp');
					}).bind('change', function () {
						l.removeClass('focused');
						if (el.is('select') || el.val())
							l.removeClass('floatDown').addClass('floatUp');
						else
							l.addClass('floatDown').removeClass('floatUp');
					});
					if(!el.hasClass('keepPlaceholder'))
						el.attr('placeholder', '');
					el.trigger('blur');
				}
			}
		}

		/**
		 * Floating labels
		 */
		function floatLabels() {
			var f = $fl(this);
			if(!f.hasClass('hform')) {

				// Attach floating labels to appropriate input fields
				f.find('input').each(setupFloatingLabels);
				f.find('textarea').each(setupFloatingLabels);
				f.find('.selectControl select').each(setupFloatingLabels);
			}
		}

		$fl('.floatingLabels form').each(floatLabels);
		$fl('form.floatingLabels').each(floatLabels);
		$fl('form').each(function() {
			var f = $fl(this);
			if(!f.hasClass('hform')) {
				f.find('input').each(styleLabel);
				f.find('textarea').each(styleLabel);
				f.find('select').each(styleLabel);
			}
		});
		setTimeout(function() {
			$fl(document.activeElement).trigger('focus');
		}, 100);

		// Floating action menu
		var hasFAMs = false;
		$fl('.fam').each(function() {
			var fam = $fl(this),
				menu = fam.find('ul');

			// Mark as hidden
			menu.attr('aria-hidden', menu.hasClass('exposed') ? false : true);

			// Attach click handler to menu button
			fam.find('a').first().bind('click', function(e) {
				if(menu.hasClass('exposed')) {
					menu.removeClass('exposed').attr('aria-hidden', true);
				}
				else {
					// Close any open
					$fl('.fam ul').removeClass('exposed').attr('aria-hidden', true);

					menu.addClass('exposed').attr('aria-hidden', false);
				}
				e.preventDefault();
			}).attr('data-fam-menu', 1);

			hasFAMs = true;
		});

		// Close FAMs on click off menu
		if(hasFAMs) {
			$fl(document).bind('click', function (e) {
				var el = $fl(e.target);

				if(e.target.nodeName == 'HTML' || (
						!el.attr('data-fam-menu') &&
						!el.hasClass('leave-open') &&
						!el.parent().attr('data-fam-menu') &&
						!el.parent().hasClass('leave-open')
					)
				) {
					$fl('.fam ul').removeClass('exposed').attr('aria-hidden', true);
				}
			});
		}

	});

	// Replace val function so that it triggers a change event on update
	var fnVal = fusionLib.fn.val;
	fusionLib.fn.val = function(value) {
		if (typeof value == 'undefined') {
			return fnVal.call(this);
		}

		var e = $fl(this[0]),
			l = $fl('#' + e.attr('id') + '-label');

		if(e.attr('type') != 'checkbox') {
			if (typeof value != 'string' || value.length)
				l.removeClass('floatDown').addClass('floatUp');
			else
				l.addClass('floatDown').removeClass('floatUp');
		}
		return fnVal.call(this, value);
	};

	// Replace focus function so that it updates the styles on the element
	var fnFocus = fusionLib.fn.focus;
	fusionLib.fn.focus = function() {
		fnFocus.call(this);

		var e = $fl(this[0]),
			l = $fl('#' + e.attr('id') + '-label');

		if(e.hasClass('hasFloatingLabel') && e.attr('type') != 'checkbox') {
			l.removeClass('floatDown').addClass('floatUp');
			l.addClass('focused');
		}
		return this;
	};

})();
