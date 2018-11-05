/**
 * fusionCSS JavaScript to implement various utilities, works with jQuery or fusionLib.
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
	 * Add scroll to top
	 */
	var toTop = $('#scrollToTop');
	if (toTop.length) {
		function scrollToTop() {
			var e = $(window);
			if (e.scrollTop() > 0) {
				e.scrollTop(Math.max(0, e.scrollTop() - Math.max(10, e.scrollTop() / 20)));
				window.setTimeout(scrollToTop, 10);
			}
		}

		toTop.on('click', scrollToTop);

		$(window).on('scroll', function () {
			if ($(this).scrollTop() > (toTop.attr('data-showat') != null ? toTop.attr('data-showat') : 600))
				toTop.removeClass('hide');
			else
				toTop.addClass('hide');
		});
	}

	/**
	 * Find all upload buttons and set to copy file name to display
	 */
	$('.uploadButton input').on('change', function (e) {
		$(this).parent().find('span').html($(this).val().split(/(\\|\/)/g).pop());
	});

	/**
	 * Setup responsive tables
	 */
	$("table.responsive").each(function (i, e) {
		$(e).wrap('<div class="responsiveTableWrapper" />');
		$(e).wrap('<div class="responsiveTableWrapperInner" />');
	});

});
