/**
 * fusionCSS JavaScript to implement tabs, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

/**
 * Enable tab functionality.
 *
 * @param {string} activeTab The optional name of the active tab.
 */
$.fn.tabWidget = function (activeTab) {
	var tabActive,
		aTab,
		tabs = {},
		widget = this,
		tabsContainer = widget.find('.tabs').first();

	if (widget.attr('data-tabs-enabled') !== '1') {
		widget.attr('data-tabs-enabled', '1');

		// If hiding overflows
		if (widget.attr('data-tabs-hide-wrap') === '1') {

			// Add the menu container to the tabs
			tabsContainer.append('<li role="menubar" class="tabsMenu">&nbsp;<ul style="display: none"></ul></li>');

			// Remember the menu elements
			var menu = tabsContainer.find('.tabsMenu'),
				menuUL = menu.find('ul');

			// Copy tabs under menu
			tabsContainer.find('li').each(function () {
				var el = $(this);

				if (el.attr('role') === 'tab') {
					var dup = el[0].cloneNode(true),
						tabName;

					if ((tabName = dup.getAttribute('data-tabpanel')) == null)
						tabName = $(dup).find('a').attr('href').replace(/^.*#/, '');

					dup.setAttribute('role', 'menuitem');
					dup.setAttribute('data-tab-name', tabName);
					menuUL[0].appendChild(dup);
				}
			});

			/**
			 * update the tab visibility
			 */
			function updateVisibility() {
				var maxWidth = tabsContainer.width(),
					curWidth = 0;

				curWidth += menu.width()
					+ parseInt(menu.css('margin-left'))
					+ parseInt(menu.css('margin-right'))
					+ parseInt(menu.css('padding-left'))
					+ parseInt(menu.css('padding-right'));

				// Make all tabs visible
				tabsContainer.find('li').show();
				menuUL.find('li').hide();

				// Now hide the overflow
				var menuLI = menuUL.find('li'),
					hideCount = 0;
				tabsContainer.find('li').each(function (idx) {
					var el = $(this);

					if (el.attr('role') === 'tab') {
						curWidth += el.width()
							+ parseInt(el.css('margin-left'))
							+ parseInt(el.css('margin-right'))
							+ parseInt(el.css('padding-left'))
							+ parseInt(el.css('padding-right'));
						if (curWidth >= maxWidth) {
							$(this).hide();
							menuLI.eq(idx).show();
							hideCount++;
						}
					}
				});

				// Show / hide the drop down menu
				if (hideCount)
					menu.show();
				else {
					menu.hide();
					menuUL.hide();
				}
			}

			$(window).on('resize', updateVisibility);
			updateVisibility();

			menu.on('click', function () {
				if (menuUL.css('display') === 'block')
					menuUL.hide();
				else
					menuUL.show();
			});

			// Capture click off tabs to close menu
			$('body').on('click', function (evt) {
				if (!$(evt.target).closest('.tabsMenu').length)
					menuUL.hide();
			});
		}

		// Check for active tab
		if ((aTab = this.attr('data-tabs-active')) != null) {
			tabActive = aTab;
		}

		tabsContainer.find('li').each(function () {
			var el = $(this),
				tabName,
				panel;

			// If direct child
			if (el.attr('role') === 'tab') {

				if ((tabName = el.attr('data-tabpanel')) == null)
					tabName = el.find('a').attr('href').replace(/^.*#/, '');
				panel = $('#' + tabName);

				if (tabActive === undefined || (activeTab !== undefined && activeTab === tabName))
					tabActive = tabName;

				// Hide panel
				if (tabName !== tabActive)
					panel.addClass('tabhidepanel').attr('aria-expanded', false);

				el.parent().attr('aria-selected', false);
				tabs[tabName] = [el, panel];
				el.attr('data-tab-name', tabName);
			}
		});

		// Add click handler to tabs
		tabsContainer.find('li').on('click', function (evt) {
			var el = $(evt.target).closest('li'),
				tabName = el.attr('data-tab-name');

			if (tabName) {
				tabs[tabActive][1].addClass('tabhidepanel').attr('aria-expanded', false);
				tabs[tabName][1].removeClass('tabhidepanel').attr('aria-expanded', true);
				tabs[tabActive][0].removeClass('active').parent().attr('aria-selected', false);
				tabs[tabName][0].addClass('active').parent().attr('aria-selected', true);
				tabActive = tabName;

				// Close the menu if any
				tabsContainer.find('.tabsMenu ul').hide();

				// Trigger an event for the click.
				el.trigger('fcss:tabclick');

				evt.preventDefault();
				evt.stopPropagation();
				return false;
			}
		});

		// Set the active tab
		if (tabActive !== undefined) {
			tabs[tabActive][0].addClass('active').parent().attr('aria-selected', true);
			tabs[tabActive][1].removeClass('tabhidepanel').attr('aria-expanded', true);
		}

		// Look to see if in a form
		var form = widget.closest('form');
		if (form.length) {
			function selectTabWithErrors() {
				for (var m in tabs) {
					if (tabs[m][1].find('.validation').hasClass('failed')) {
						tabs[m][0].trigger('click');
						var e = $('label.validationError').first().attr('for');
						setTimeout(function () {
							$('#' + e).focus();
						}, 100);
						break;
					}
				}
			}

			// Capture validation failures
			form.on('formValidationFailed', selectTabWithErrors).addClass('tabwidgetcontainer');
			selectTabWithErrors();
		}
	}

	return widget;
};

// Enable tabs
$(document).ready(function () {
	$('.tabwidget').each(function () {
		$(this).tabWidget();
	});
});
