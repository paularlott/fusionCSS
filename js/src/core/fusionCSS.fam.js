/**
 * fusionCSS JavaScript to implement Floating Action Menus, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

$(document).ready(function () {

	/**
	 * Floating action menu
	 */
	var hasFAMs = false;
	$('.fam').each(function () {
		var fam = $(this),
			menu = fam.find('ul');

		// Mark as hidden
		menu.attr('aria-hidden', menu.hasClass('exposed') ? false : true);

		// Attach click handler to menu button
		if (!fam.find('ul.alwaysOpen').length) {
			fam.find('a').first().on('click', function (e) {
				if (menu.hasClass('exposed')) {
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
	if (hasFAMs) {
		$(document).on('click', function (e) {
			var el = $(e.target);

			if (e.target.nodeName == 'HTML' || (
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
