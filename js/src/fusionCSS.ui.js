/**
 * fusionCSS user interface JavaScript, works with jQuery of fusionLib.
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
if (!window.fusionLib)
	window.$fl = window.fusionLib = jQuery;

(function () {
	/**
	 * The ID of the toast timer
	 */
	var toastTimer = 0;

	$fl(document).ready(function() {
		// Add the toast container to the page
		$fl('body').append('<div id="toast" aria-hidden="true"></div>');

		$fl('#toast').bind('click', function(e) {
			if(toastTimer) {
				clearTimeout(toastTimer);
				$fl('#toast').removeClass('exposed').attr('aria-hidden', true);
				toastTimer = 0;
			}
		});
	});

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
		 */
		toastShow: function(msg) {
			var delay = 0;

			$fl('#toast').removeClass('exposed').attr('aria-hidden', true);
			if (toastTimer) {
				clearTimeout(toastTimer);
				delay = 110;
			}

			setTimeout(function () {
				$fl('#toast').html(msg);
				$fl('#toast').addClass('exposed').attr('aria-hidden', false);

				toastTimer = setTimeout(function () {
					$fl('#toast').removeClass('exposed').attr('aria-hidden', true);
					toastTimer = 0;
				}, 8000);
			}, delay);

			return this;
		}
	});

	fusionLib.toastShow = fusionLib.fn.toastShow;

})();