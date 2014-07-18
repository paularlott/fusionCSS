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

		if(menu.hasClass('hidden-s') || menu.hasClass('hidden-phone')) {
			collapsed.addClass('visible-s');
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
			.append('<div id="slideInMenu"></div>');
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
			if(e.scrollTop() > 10) {
				e.scrollTop(Math.max(0, e.scrollTop() - Math.max(10, e.scrollTop() / 20)));
				window.setTimeout(scrollToTop, 10);
			}
		}

		toTop.bind('click', scrollToTop);

		$fl(window).bind('scroll', function() {
			if($fl(this).scrollTop() > (toTop.attr('show-at') != null ? toTop.attr('show-at') : 600))
				toTop.removeClass('hide');
			else
				toTop.addClass('hide');
		});
	}
});
