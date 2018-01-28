/**
 * JavaScript helpers for fusionCSS, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

(function() {
	var extend = window.jQuery || window.fusionLib;

	/**
	 * The ID of the toast timer
	 */
	var toastTimer = 0,
		toastClass = '',
		toastHasHTML = false;

	// If tabs functions not defined add them
	if(!extend.fn.tabWidget) {
		/**
		 * Enable tab functionality.
		 *
		 * @param string activeTab The optional name of the active tab.
		 */
		extend.fn.tabWidget = function(activeTab) {
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

				this.find('.tabs li').each(function() {
					var el = $(this),
						tabName,
						panel;

					// If direct child
					if(el.parent().parent()[0].id == widgetName) {

						if((tabName = el.attr('data-tabpanel')) == null)
							tabName = el.find('a').attr('href').replace(/^.*#/, '');
						panel = $('#' + tabName);

						if(tabActive == undefined || (activeTab != undefined && activeTab == tabName))
							tabActive = tabName;

						// Hide panel
						if(tabName != tabActive)
							panel.addClass('tabhidepanel').attr('aria-expanded', false);

						el.parent().attr('aria-selected', false);
						tabs[tabName] = [el, panel];

						// Add click handler to tabs
						el.on('click', function(evt) {
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
				if(tabActive != undefined) {
					tabs[tabActive][0].addClass('active').parent().attr('aria-selected', true);
					tabs[tabActive][1].removeClass('tabhidepanel').attr('aria-expanded', true);
				}

				// Look to see if in a form
				var n = this[0];
				while(n) {
					if(n.tagName == 'FORM') {
						function selectTabWithErrors() {
							for(var m in tabs) {
								if(tabs[m][1].find('.validation').hasClass('failed')) {
									tabs[m][0].trigger('click');
									var e = $('label.validationError').first().attr('for');
									setTimeout(function() {
										$('#' + e).focus();
									}, 100);
									break;
								}
							}
						}

						// Capture validation failures
						$(n).on('formValidationFailed', selectTabWithErrors).addClass('tabwidgetcontainer');
						selectTabWithErrors();
						break;
					}
					n = n.parentNode;
				}
			}

			return this;
		}
	}

	extend.fn.extend({
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
				$('body').append('<div id="toast" role="alert" aria-hidden="true"></div>');
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
			else if($('#toast').hasClass('exposed'))
				delay = 300;

			$('#toast')
				.removeClass('exposed')
				.removeClass('success')
				.removeClass('error')
				.removeClass('warning')
				.removeClass('accent')
				.removeClass('primary')
				.attr('aria-hidden', true);

			setTimeout(function () {
				$('#toast')
					.html(msg)
					.addClass('exposed')
					.addClass(type)
					.attr('aria-hidden', false);

				// Action toast
				if(actionLabel) {
					$('#toast a').on('click', function(e) {
						if (toastTimer) {
							clearTimeout(toastTimer);
							toastTimer = 0;
						}
						$('#toast').removeClass('exposed').attr('aria-hidden', true);

						if(callback) {
							callback();
						}

						e.preventDefault();
					});
				}

				// Timeout toast
				if((!actionLabel && withTimeout !== false) || withTimeout === true) {
					toastTimer = setTimeout(function () {
						$('#toast')
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

			$('#toast')
				.removeClass('exposed')
				.removeClass(toastClass)
				.attr('aria-hidden', true);
		}
	});

	extend.toastShow = extend.fn.toastShow;
	extend.toastHide = extend.fn.toastHide;

	$(document).ready(function() {

		// Enable tabs
		$('.tabwidget').each(function() {
			$(this).tabWidget();
		});

		/**
		 * Find all upload buttons and set to copy file name to display
		 */
		$('.uploadButton input').on('change', function(e) {
			$(this).parent().find('span').html($(this).val().split(/(\\|\/)/g).pop());
		});

		/**
		 * Setup responsive tables
		 */
		$("table.responsive").each(function(i, e) {
			$(e).wrap('<div class="responsiveTableWrapper" />');
			$(e).wrap('<div class="responsiveTableWrapperInner" />');
		});

		/**
		 * Build the slide in menu if required
		 */
		if($('#viewSlideInMenu').length) {
			// Add markup to body
			$('body').append('<div id="slideInMenuOverlay"></div>');

			// Build the slidein menu if not already defined
			if(!$('#slideInMenu').length) {
				$('body').append('<div id="slideInMenu" role="menu"></div>');

				// Copy menu HTML to slide in
				$('.slideInMenu').each(function (idx) {
					var o = '', e = '';

					if(this.nodeName.toLowerCase() == 'ul') {
						o = '<ul>';
						e = '</ul>';
					}

					if ($(this).hasClass('slideInMenuRootOnly')) {
						$('#slideInMenuOverlay')
							.html(o + $(this).html() + e)
							.find('li ul').remove();
						$('#slideInMenu').append($('#slideInMenuOverlay').html());
					}
					else
						$('#slideInMenu').append(o + $(this).html() + e);
				});
			}

			$('#slideInMenu').attr('aria-hidden', true);

			// Capture menu hide, click off menu
			$('#slideInMenuOverlay')
				.html('')
				.on('click', function(e) {
					$('#slideInMenu')
						.removeClass('slideInMenuShow')
						.attr('aria-hidden', true);
					$('#slideInMenuOverlay').removeClass('slideInMenuShow');
					$('body').removeClass('disableScroll');
				});

			// Capture menu expose
			$('#viewSlideInMenu').on('click', function(e) {
				$('body').addClass('disableScroll');
				$('#slideInMenuOverlay').addClass('slideInMenuShow');
				$('#slideInMenu')
					.addClass('slideInMenuShow')
					.attr('aria-hidden', false);
			});
		}

		/**
		 * Add scroll to top
		 */
		var toTop = $('#scrollToTop');
		if(toTop.length) {
			function scrollToTop() {
				var e = $(window);
				if(e.scrollTop() > 0) {
					e.scrollTop(Math.max(0, e.scrollTop() - Math.max(10, e.scrollTop() / 20)));
					window.setTimeout(scrollToTop, 10);
				}
			}

			toTop.on('click', scrollToTop);

			$(window).on('scroll', function() {
				if($(this).scrollTop() > (toTop.attr('data-showat') != null ? toTop.attr('data-showat') : 600))
					toTop.removeClass('hide');
				else
					toTop.addClass('hide');
			});
		}

		/**
		 * Label styling
		 */
		function styleLabel() {
			var el = $(this),
				l = $('#' + el.attr('id') + '-label'),
				t = el.attr('type');

			if(t != 'checkbox' && t != 'submit' && t != 'file') {
				el.on('focus', function () {
					l.addClass('focused');
				}).on('blur', function () {
					l.removeClass('focused');
				});
			}
		}

		/**
		 * Worker function to setup floating labels
		 */
		function setupFloatingLabels() {
			var el = $(this),
				t = el.attr('type');

			if(el.attr('data-floating-label') != 'disabled' && !el.hasClass('hasFloatingLabel') && t != 'checkbox' && t != 'submit' && t != 'file') {
				var l = $('#' + el.attr('id') + '-label');
				if(l.length) {
					if(el.is('textarea')) {
						l.addClass('floatTextarea');
					}

					el.addClass('hasFloatingLabel');
					el.on('focus', function () {
						l.removeClass('floatDown').addClass('floatUp');

						if(el.attr('data-placeholder') != undefined)
							el.attr('placeholder', el.attr('data-placeholder'));
					}).on('blur', function () {
						if (el.is('select') || el.val() || el.hasClass('keepPlaceholder') || el.attr('data-keep-placeholder'))
							l.removeClass('floatDown').addClass('floatUp');
						else
							l.addClass('floatDown').removeClass('floatUp');

						if(el.attr('data-placeholder') != undefined)
							el.attr('placeholder', '');
					}).on('change', function () {
						l.removeClass('focused');
						if (el.is('select') || el.val() || el.hasClass('keepPlaceholder') || el.attr('data-keep-placeholder'))
							l.removeClass('floatDown').addClass('floatUp');
						else
							l.addClass('floatDown').removeClass('floatUp');
					});

					if(!el.hasClass('keepPlaceholder') && !el.attr('data-keep-placeholder')) {
						if(el.attr('placeholder') != undefined) {
							if(el.closest('.placeholderOnFocus').length)
								el.attr('data-placeholder', el.attr('placeholder'));
							el.attr('placeholder', '');
						}
					}
					el.trigger('blur');
				}
			}
		}

		// Replace val function so that it triggers a change event on update
		var fnVal = extend.fn.val;
		extend.fn.val = function(value) {
			if (typeof value == 'undefined') {
				return fnVal.call(this);
			}

			var e = extend(this[0]),
				l = extend('#' + e.attr('id') + '-label');

			if(e.hasClass('hasFloatingLabel') && e.attr('type') != 'checkbox') {
				if (typeof value != 'string' || value.length || e.is('select') || document.activeElement == this[0]) {
					l.removeClass('floatDown').addClass('floatUp');

					if (e.attr('data-placeholder') != undefined)
						e.attr('placeholder', e.attr('data-placeholder'));
				}
				else {
					l.addClass('floatDown').removeClass('floatUp');

					if(e.attr('data-placeholder') != undefined)
						e.attr('placeholder', '');
				}
			}
			return fnVal.call(this, value);
		};

		// Replace focus function so that it updates the styles on the element
		var fnFocus = extend.fn.focus;
		extend.fn.focus = function() {
			fnFocus.call(this);

			var e = extend(this[0]),
				l = extend('#' + e.attr('id') + '-label');

			if(e.hasClass('hasFloatingLabel') && e.attr('type') != 'checkbox') {
				l.removeClass('floatDown').addClass('floatUp');
				l.addClass('focused');

				if(e.attr('data-placeholder') != undefined)
					e.attr('placeholder', e.attr('data-placeholder'));
			}
			return this;
		};

		/**
		 * Floating labels
		 */
		function floatLabels() {
			var f = $(this);
			if(!f.hasClass('hform')) {

				// Attach floating labels to appropriate input fields
				f.find('input').each(setupFloatingLabels);
				f.find('textarea').each(setupFloatingLabels);
				f.find('.selectControl select').each(setupFloatingLabels);
			}
		}

		$('.floatingLabels form').each(floatLabels);
		$('form.floatingLabels').each(floatLabels);
		$('form').each(function() {
			var f = $(this);
			if(!f.hasClass('hform')) {
				f.find('input').each(styleLabel);
				f.find('textarea').each(styleLabel);
				f.find('select').each(styleLabel);
			}
		});
		setTimeout(function() {
			$(document.activeElement).trigger('focus');
		}, 100);


		/**
		 * Floating action menu
		 */
		var hasFAMs = false;
		$('.fam').each(function() {
			var fam = $(this),
				menu = fam.find('ul');

			// Mark as hidden
			menu.attr('aria-hidden', menu.hasClass('exposed') ? false : true);

			// Attach click handler to menu button
			if(!fam.find('ul.alwaysOpen').length) {
				fam.find('a').first().on('click', function(e) {
					if(menu.hasClass('exposed')) {
						menu.removeClass('exposed').attr('aria-hidden', true);
					}
					else {
						// Close any open
						$('.fam ul').removeClass('exposed').attr('aria-hidden', true);

						menu.addClass('exposed').attr('aria-hidden', false);
					}
					e.preventDefault();
				}).attr('data-fam-menu', 1);
			}

			hasFAMs = true;
		});

		// Close FAMs on click off menu
		if(hasFAMs) {
			$(document).on('click', function (e) {
				var el = $(e.target);

				if(e.target.nodeName == 'HTML' || (
						!el.attr('data-fam-menu') &&
						!el.hasClass('leave-open') &&
						!el.parent().attr('data-fam-menu') &&
						!el.parent().hasClass('leave-open')
					)
				) {
					$('.fam ul').removeClass('exposed').attr('aria-hidden', true);
				}
			});
		}

	});

})();
