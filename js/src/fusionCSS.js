/**
 * JavaScript helpers for fusionCSS, works with jQuery of fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2015 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

// jQuery or fusionLib
if(!window.fusionLib)
	window.$fl = window.fusionLib = jQuery;

(function() {
	/**
	 * The ID of the toast timer
	 */
	var toastTimer = 0;

	fusionLib.fn.extend({
		/**
		 * Enable tab functionality.
		 *
		 * @param string activeTab The optional name of the active tab.
		 */
		tabs: function(activeTab) {
			var tabActive,
				tabs = {};

			// Hide the panels
			this.find('.tabpanels li').each(function () {
				var e = $fl(this);
				if (e.attr('role') == 'tabpanel')
					e.addClass('tabhidepanel').attr('aria-expanded', false);
			});
			this.find('.tabpanels div').each(function () {
				var e = $fl(this);
				if (e.attr('role') == 'tabpanel')
					e.addClass('tabhidepanel').attr('aria-expanded', false);
			});

			// Add handlers to tabs
			this.find('.tabs li').each(function () {
				var el = $fl(this),
					tabName,
					panel;

				if ((tabName = el.attr('data-tabpanel')) == null)
					tabName = el.find('a').attr('href').replace(/^.*#/, '');
				panel = $fl('#' + tabName);

				if (tabActive == undefined || (activeTab != undefined && activeTab == tabName))
					tabActive = tabName;

				el.parent().attr('aria-selected', false);
				tabs[tabName] = [el, panel];

				// Add click handler to tabs
				el.bind('click', function (evt) {
					tabs[tabActive][1].addClass('tabhidepanel').attr('aria-expanded', false);
					tabs[tabName][1].removeClass('tabhidepanel').attr('aria-expanded', true);
					tabs[tabActive][0].removeClass('active').parent().attr('aria-selected', false);
					tabs[tabName][0].addClass('active').parent().attr('aria-selected', true);
					tabActive = tabName;
					evt.preventDefault();
					evt.stopPropagation();
					return false;
				})
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

			return this;
		},

		/**
		 * Display a message in the toast popup.
		 *
		 * @param string msg The message to display in the toast popup.
		 * @param bool clickHide true to require a click to hide.
		 */
		toastShow: function(msg, clickHide) {
			var delay = 0;

			if (toastTimer) {
				clearTimeout(toastTimer);
				toastTimer = 0;
				delay = 110;
			}
			else if($fl('#toast').hasClass('exposed'))
				delay = 110;
			$fl('#toast').removeClass('exposed').attr('aria-hidden', true);

			setTimeout(function () {
				$fl('#toast').html(msg);
				$fl('#toast').addClass('exposed').attr('aria-hidden', false);

				if(clickHide == 'undefined' || !clickHide) {
					toastTimer = setTimeout(function () {
						$fl('#toast').removeClass('exposed').attr('aria-hidden', true);
						toastTimer = 0;
					}, 8000);
				}
			}, delay);

			return this;
		}
	});

	fusionLib.toastShow = fusionLib.fn.toastShow;

	// Add the toast container to the page
	$fl(document).ready(function() {
		$fl('body').append('<div id="toast" aria-hidden="true"></div>');
		$fl('#toast').bind('click', function (e) {
			if (toastTimer) {
				clearTimeout(toastTimer);
				toastTimer = 0;
			}
			$fl('#toast').removeClass('exposed').attr('aria-hidden', true);
		});
	});
})();

$fl(document).ready(function() {

	// Find all menus and build collapsed version
	$fl('.collapseMenu').each(function(idx) {
		var optionsList = '<option value="" selected="selected">Menu...</option>',
			menu = $fl(this),
			collapsed,
			cssDone = false;

		menu.find('a').each(function() {
			var e = $fl(this),
				depth = 0,
				indent = '',
				p = e.parent();

			// Find depth of element
			while(p[0] != null) {
				if(p[0].nodeName.toLowerCase() == 'ul' && depth++)
					indent += ' - ';
				p = p.parent();
			}

			optionsList += '<option value="' + e.attr('href') + '">' + indent + e.text() + '</option>';
		});

		menu.after('<select id="collapsedMenu' + idx + '">' + optionsList + '</select>');
		collapsed = $fl('#collapsedMenu' + idx);

		if(menu.hasClass('hidden-t')) {
			collapsed.addClass('visible-t');
			cssDone = true;
		}

		if(menu.hasClass('hidden-s')) {
			collapsed.addClass('visible-s');
			cssDone = true;
		}

		if(menu.hasClass('hidden-phone')) {
			collapsed.addClass('visible-phone');
			cssDone = true;
		}

		if(menu.hasClass('hidden-m') || menu.hasClass('hidden-desktop')) {
			collapsed.addClass('visible-m');
			cssDone = true;
		}

		if(menu.hasClass('hidden-l')) {
			collapsed.addClass('visible-l');
			cssDone = true;
		}

		if(!cssDone) {
			menu.addClass('hidden-t').addClass('hidden-s');
			collapsed.addClass('visible-t').addClass('visible-s');
		}

		collapsed.bind('change', function() {
			window.location = $fl(this).val();
		});
	});

	// Find all upload buttons and set to copy file name to display
	$fl('.uploadButton input').bind('change', function(e) {
		$fl(this).parent().find('span').html($fl(this).val().split(/(\\|\/)/g).pop());
	});

	// Setup responsive tables
	$fl("table.responsive").each(function(i, e) {
		$fl(e).wrap('<div class="responsiveTableWrapper" />');
		$fl(e).wrap('<div class="responsiveTableWrapperInner" />');
	});

	// Build the slide in menu if required
	if($fl('#viewSlideInMenu').length) {
		// Add markup to body
		$fl('body')
			.append('<div id="slideInMenuOverlay"></div>')
			.append('<div id="slideInMenu" role="menu"></div>');
		$fl('#slideInMenu').attr('aria-hidden', true);

		// Copy menu HTML to slide in
		$fl('ul.slideInMenu').each(function(idx) {
			if($fl(this).hasClass('slideInMenuRootOnly')) {
				$fl('#slideInMenuOverlay')
					.html('<ul>' + $fl(this).html() + '</ul>')
					.find('li ul').remove();
				$fl('#slideInMenu').append($fl('#slideInMenuOverlay').html());
			}
			else
				$fl('#slideInMenu').append('<ul>' + $fl(this).html() + '</ul>');
		});

		// Capture menu hide, click off menu
		$fl('#slideInMenuOverlay')
			.html('')
			.bind('click', function(e) {
			$fl('#slideInMenuOverlay').removeClass('slideInMenuShow');
			$fl('#slideInMenu')
				.removeClass('slideInMenuShow')
				.attr('aria-hidden', true);
		});

		// Capture menu expose
		$fl('#viewSlideInMenu').bind('click', function(e) {
			$fl('#slideInMenuOverlay').addClass('slideInMenuShow');
			$fl('#slideInMenu')
				.addClass('slideInMenuShow')
				.attr('aria-hidden', false);
		});
	}

	// Add scroll to top
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

	// Floating labels
	$fl('form').each(function() {
		var f = $fl(this);
		if(!f.hasClass('hform')) {

			// Attach floating labels to appropriate input fields
			f.find('input').each(function() {
				var el = $fl(this),
					t = el.attr('type');

				if(t != 'checkbox' && t != 'submit' && t != 'file') {
					var l = $fl('#' + el.attr('id') + '-label');
					el.bind('focus', function() {
						l.removeClass('floatDown');
					}).bind('blur', function() {
						if(el.val())
							l.removeClass('floatDown');
						else
							l.addClass('floatDown');
					});
					el.attr('placeholder', '').addClass('floatDown').trigger('blur').attr('data-old-value', el.val());
				}
			});

			setInterval(function() {
				f.find('input').each(function() {
					var el = $fl(this),
						t = el.attr('type');

					if(document.activeElement != el.get(0) && t != 'checkbox' && t != 'submit' && t != 'file' && el.attr('data-old-value') != el.val()) {
						var l = $fl('#' + el.attr('id') + '-label');
						if(el.val())
							l.removeClass('floatDown');
						else
							l.addClass('floatDown');
						el.attr('data-old-value', el.val());
					}
				});
			}, 100);
		}
	});
});
