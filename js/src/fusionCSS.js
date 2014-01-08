/**
 * JavaScript helpers for fusionCSS, works with jQuery of fusionLib.
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

$fl(document).ready(function() {

	// Find all menus and build collapsed version
	$fl('.collapseMenu').each(function(idx) {
		var optionsList = '<option value="" selected="selected">Menu...</option>';

		$fl(this).find('a').each(function() {
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
		$fl(this).addClass('hidden-phone').after('<select id="collapsedMenu' + idx + '" class="visible-phone">' + optionsList + '</select>');
		$fl('#collapsedMenu' + idx).bind('change', function() {
			window.location = $fl(this).val();
		});
	});

	// Find all upload buttons and set to copy file name to display
	$fl('.uploadButton input').bind('change', function(e) {
		$fl(this).parent().find('span').html($fl(this).val().split(/(\\|\/)/g).pop());
	});

	// Build the slide in menu if required
	if($fl('#viewSlideInMenu').length) {
		// Add markup to body
		$fl('body').append('<div id="slideInMenuOverlay"></div><div id="slideInMenu"></div>');
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
});
