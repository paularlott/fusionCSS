/**
 * fusionCSS JavaScript helpers to implement toast popups, works with jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2013 - 2018 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

$.fn.extend({
	/**
	 * The ID of the toast timer
	 */
	toastTimer: 0,
	toastClass: '',
	toastHasHTML: false,

	/**
	 * Display a message in the toast popup.
	 *
	 * @param {string} type The toast type, success, warning, error, primary, accent
	 * @param {string} msg The message to display in the toast popup.
	 * @param {string} actionLabel The label to show on the action e.g. dismiss.
	 * @param {function} callback The function to call if the action is clicked.
	 * @param {bool} withTimeout true to auto dismiss the popup.
	 */
	toastShow: function (type, msg, actionLabel, callback, withTimeout) {
		var delay = 0;

		// Add the toast container to the page
		if (!this.toastHasHTML) {
			$('body').append('<div id="toast" role="alert" aria-hidden="true"></div>');
			this.toastHasHTML = true;
		}

		this.toastClass = type;

		if (actionLabel) {
			msg = '<a href="#">' + actionLabel + '</a>' + msg
		}

		if (this.toastTimer) {
			clearTimeout(this.toastTimer);
			this.toastTimer = 0;
			delay = 300;
		}
		else if ($('#toast').hasClass('exposed'))
			delay = 300;

		var toast = $('#toast');
		toast
			.removeClass('exposed')
			.removeClass('success')
			.removeClass('error')
			.removeClass('warning')
			.removeClass('accent')
			.removeClass('primary')
			.attr('aria-hidden', true);

		setTimeout(function () {
			toast
				.html(msg)
				.addClass('exposed')
				.addClass(type)
				.attr('aria-hidden', false);

			// Action toast
			if (actionLabel) {
				toast.find('a').on('click', function (e) {
					if (this.toastTimer) {
						clearTimeout(this.toastTimer);
						this.toastTimer = 0;
					}
					toast.removeClass('exposed').attr('aria-hidden', true);

					if (callback) {
						callback();
					}

					e.preventDefault();
				});
			}

			// Timeout toast
			if ((!actionLabel && withTimeout !== false) || withTimeout === true) {
				this.toastTimer = setTimeout(function () {
					toast
						.removeClass('exposed')
						.removeClass(type)
						.attr('aria-hidden', true);
					this.toastTimer = 0;
				}, 5000);
			}
		}, delay);

		return this;
	},

	/**
	 * Hide any visible toast messages.
	 */
	toastHide: function () {
		if (this.toastTimer) {
			clearTimeout(this.toastTimer);
			this.toastTimer = 0;
		}

		$('#toast')
			.removeClass('exposed')
			.removeClass(this.toastClass)
			.attr('aria-hidden', true);
	}
});

$.toastShow = $.fn.toastShow;
$.toastHide = $.fn.toastHide;
