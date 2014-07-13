/**
 * fusionCSS user interface JavaScript, works with jQuery of fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2014 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

// jQuery or fusionLib
if(!window.fusionLib)
	window.$fl = window.fusionLib = jQuery;

fusionLib.fn.extend({
	/**
	 * Enable tab functionality.
	 *
	 * @param string activeTab The optional name of the active tab.
	 */
	tabs: function(activeTab) {
		var tabActive,
			tabs = {};

		this.find('.tabs li a').each(function() {
			var el = $fl(this),
				tabName = el.attr('href').replace(/^.*#/, ''),
				panel = $fl('#' + tabName);

			if(tabActive == undefined || (activeTab != undefined && activeTab == tabName))
				tabActive = tabName;

			el.parent().attr('aria-selected', false);
			panel.addClass('tabhidepanel').attr('aria-expanded', false);
			tabs[tabName] = [el, panel];

			// Add click handler to tabs
			el.bind('click', function(evt) {
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
	}
});