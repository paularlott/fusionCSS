/**
 * fusionCSS JavaScript to implement slide in menus, works with jQuery or fusionLib.
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
	 * Build the slide in menu if required
	 */
	if ($('#viewSlideInMenu').length) {

		// Add markup to body
		$('body').append('<div id="slideInMenuOverlay"></div>');

		// Build the slidein menu if not already defined
		if (!$('#slideInMenu').length) {
			$('body').append('<div id="slideInMenu" role="menu"></div>');

			// Copy menu HTML to slide in
			$('.slideInMenu').each(function (idx) {
				var o = '', e = '';

				if (this.nodeName.toLowerCase() == 'ul') {
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
			.on('click', function (e) {
				$('#slideInMenu')
					.removeClass('slideInMenuShow')
					.attr('aria-hidden', true);
				$('#slideInMenuOverlay').removeClass('slideInMenuShow');
				$('body').removeClass('disableScroll');
			});

		// Capture menu expose
		$('#viewSlideInMenu').on('click', function (e) {
			$('#slideInMenuOverlay').addClass('slideInMenuShow');
			$('#slideInMenu')
				.addClass('slideInMenuShow')
				.attr('aria-hidden', false);
		});
	}
});
