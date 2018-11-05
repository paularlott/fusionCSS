/**
 * fusionCSS JavaScript to implement floating labels, works with jQuery or fusionLib.
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
	 * Label styling
	 */
	function styleLabel() {
		var el = $(this),
			l = $('#' + el.attr('id') + '-label'),
			t = el.attr('type');

		if (t != 'checkbox' && t != 'submit' && t != 'file') {
			el.on('focus', function () {
				l.addClass('focused');
			}).on('blur', function () {
				l.removeClass('focused');
			});
		}
	}

	/**
	 * Worker function to setup floating labels
	 */
	function setupFloatingLabels() {
		var el = $(this),
			t = el.attr('type');

		if (el.attr('data-floating-label') != 'disabled' && !el.hasClass('hasFloatingLabel') && t != 'checkbox' && t != 'submit' && t != 'file') {
			var l = $('#' + el.attr('id') + '-label');
			if (l.length) {
				if (el.is('textarea')) {
					l.addClass('floatTextarea');
				}

				el.addClass('hasFloatingLabel');
				el.on('focus', function () {
					l.removeClass('floatDown').addClass('floatUp');

					if (el.attr('data-placeholder') != undefined)
						el.attr('placeholder', el.attr('data-placeholder'));
				}).on('blur', function () {
					if (el.is('select') || el.val() || el.hasClass('keepPlaceholder') || el.attr('data-keep-placeholder'))
						l.removeClass('floatDown').addClass('floatUp');
					else
						l.addClass('floatDown').removeClass('floatUp');

					if (el.attr('data-placeholder') != undefined)
						el.attr('placeholder', '');
				}).on('change', function () {
					l.removeClass('focused');
					if (el.is('select') || el.val() || el.hasClass('keepPlaceholder') || el.attr('data-keep-placeholder'))
						l.removeClass('floatDown').addClass('floatUp');
					else
						l.addClass('floatDown').removeClass('floatUp');
				});

				if (!el.hasClass('keepPlaceholder') && !el.attr('data-keep-placeholder')) {
					if (el.attr('placeholder') != undefined) {
						if (el.closest('.placeholderOnFocus').length)
							el.attr('data-placeholder', el.attr('placeholder'));
						el.attr('placeholder', '');
					}
				}
				el.trigger('blur');
			}
		}
	}

	// Replace val function so that it triggers a change event on update
	var fnVal = $.fn.val;
	$.fn.val = function (value) {
		if (typeof value == 'undefined') {
			return fnVal.call(this);
		}

		var e = $(this[0]),
			l = $('#' + e.attr('id') + '-label');

		if (e.hasClass('hasFloatingLabel') && e.attr('type') != 'checkbox') {
			if (typeof value != 'string' || value.length || e.is('select') || document.activeElement == this[0]) {
				l.removeClass('floatDown').addClass('floatUp');

				if (e.attr('data-placeholder') != undefined)
					e.attr('placeholder', e.attr('data-placeholder'));
			}
			else {
				l.addClass('floatDown').removeClass('floatUp');

				if (e.attr('data-placeholder') != undefined)
					e.attr('placeholder', '');
			}
		}
		return fnVal.call(this, value);
	};

	// Replace focus function so that it updates the styles on the element
	var fnFocus = $.fn.focus;
	$.fn.focus = function () {
		fnFocus.call(this);

		var e = $(this[0]),
			l = $('#' + e.attr('id') + '-label');

		if (e.hasClass('hasFloatingLabel') && e.attr('type') != 'checkbox') {
			l.removeClass('floatDown').addClass('floatUp');
			l.addClass('focused');

			if (e.attr('data-placeholder') != undefined)
				e.attr('placeholder', e.attr('data-placeholder'));
		}
		return this;
	};

	/**
	 * Floating labels
	 */
	function floatLabels() {
		var f = $(this);
		if (!f.hasClass('hform')) {

			// Attach floating labels to appropriate input fields
			f.find('input').each(setupFloatingLabels);
			f.find('textarea').each(setupFloatingLabels);
			f.find('.selectControl select').each(setupFloatingLabels);
		}
	}

	$('.floatingLabels form').each(floatLabels);
	$('form.floatingLabels').each(floatLabels);
	$('form').each(function () {
		var f = $(this);
		if (!f.hasClass('hform')) {
			f.find('input').each(styleLabel);
			f.find('textarea').each(styleLabel);
			f.find('select').each(styleLabel);
		}
	});
	setTimeout(function () {
		$(document.activeElement).trigger('focus');
	}, 100);

});
