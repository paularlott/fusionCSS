/**
 * JavaScript helpers for fusionCSS, works with jQuery of fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 fusionCSS. All rights reserved.
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
});
