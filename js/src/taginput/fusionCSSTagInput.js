/**
 * JavaScript implement tag based input field using jQuery or fusionLib.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package fusionCSS
 * @copyright Copyright (c) 2019 fusionCSS. All rights reserved.
 * @link http://fusionCSS.com
 */

(function() {

	/**
	 * Element used for copy functions.
	 *
	 * @type {element}
	 */
	var copyElement = null;

	/**
	 * Encode HTML entities.
	 * @param {string} string to escape.
	 * @return {string}
	 */
	function htmlEntities(string) {
		return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	/**
	 * Test if the tag is already present.
	 * @param {array} input The input element to test against.
	 * @param {string} tag The tag to test for.
	 * @returns {boolean}
	 */
	function tagExists(input, tag) {
		var tagList = input.val().split(input.attr('data-delimiter'));
		return tagList.indexOf(tag) > -1;
	}

	/**
	 * Load a string of tags into the input.
	 * @param {object} settings The settings.
	 * @param {array} input The input element to add tags to.
	 * @param {string} tagString The comma separated list of tags.
	 * @return {array} The input element.
	 */
	function loadTags(settings, input, tagString) {

		// Remove old value and tags
		input.val('');
		$('#' + input.attr('id') + '_tagInputWidget .tag').remove();

		// Create tags from the string
		var tagList = tagString.split(input.attr('data-delimiter'));
		for(var i=0; i<tagList.length; i++)
			addTag(settings, input, tagList[i], false);

		return input;
	}

	/**
	 * Add a new tag to the input.
	 * @param {object} settings The settings.
	 * @param {array} input The input element to add to.
	 * @param {string} value The tag to add.
	 * @param {boolean} focus true if to focus.
	 */
	function addTag(settings, input, value, focus) {

		// Remove white space and check we have data
		value = value.trim();
		if(value.length) {

			// Split the input in case it's a paste of many tags
			var sourceTags = value.split(input.attr('data-delimiter')),
				tagList = input.val().split(input.attr('data-delimiter')),
				tagInput = $('#' + input.attr('id') + '_tagInput');

			if (tagList[0] == '')
				tagList = new Array();

			// Process all tags in the input
			for(var i=0;i<sourceTags.length;i++) {
				value = sourceTags[i];

				// If tag exists then flag it
				if (tagExists(input, value)) {

					// Only flag error for a single tag
					if (sourceTags.length === 0)
						tagInput.addClass('invalidTag');
				}
				// Process the new tag
				else {
					tagInput
						.removeClass('invalidTag')
						.val('');

					// Add the tag HTML
					$(settings.tagHTML.replace(/\{value\}/g, htmlEntities(value)))
						.insertBefore(tagInput);

					if (focus)
						tagInput.focus();
					else
						tagInput.blur();

					// Update the field value with the new tag
					tagList.push(value);
					input.val(tagList.join(input.attr('data-delimiter')));
				}
			}
		}
	}

	/**
	 * Remove tag.
	 * @param {object} settings The settings.
	 * @param {array} input The input element to remote from.
	 * @param {string} value The tag to remove.
	 */
	function removeTag(settings, input, value) {
		var delimiter = input.attr('data-delimiter'),
			old = input.val().split(delimiter),
			idx = old.indexOf(value);

		// If tag found then remove it
		if(idx > -1) {
			old.splice(idx, 1);
			loadTags(settings, input, old.join(delimiter));
		}
	}

	$.fn.extend({

		/**
		 * Set tag values on the input element.
		 * @param {string} tagString The string of tags.
		 * @return {Array} The input element.
		 */
		setTags: function(tagString) {
			return loadTags(this, tagString);
		},

		/**
		 * Enable tag input widget.
		 * @param {object} options The options.
		 * @returns {*}
		 */
		enableTagInput: function(options) {
			var settings = $.extend(
				{
					tagHTML: '<div class="chip tag"><span class="tagValue">{value}</span><i class="tagDelete">x</i></div>',
					widgetHTML: '<div id="{id}_tagInputWidget" class="tagInputWidget">' +
						'<input id="{id}_tagInput" class="tagInput" value="" placeholder="{placeholder}" />' +
						'</div>'
				},
				options
			);

			return this.each(function () {
				var $el = $(this),
					id = $el.attr('id'),
					delimiter = $el.attr('data-delimiter');

				// Don't init multiple times
				if($el.attr('data-init-done'))
					return;

				// Flag initialised and hide input
				$el
					.attr('data-init-done', '1')
					.hide();

				// Add the widget to the page
				$(settings.widgetHTML.replace(/\{id\}/g, id).replace(/\{placeholder\}/g, $el.attr('data-placeholder')))
					.insertAfter($el);

				// Load load tags from the text
				loadTags(settings, $el, $el.val());

				// Focus the input field on click or remove tags if remove clicked
				$('#' + id + '_tagInputWidget').on('click', function (event) {

					// Remove clicked
					if ($(event.target).closest('.tagDelete').length) {
						event.preventDefault();

						removeTag(
							settings,
							$el,
							$(event.target).closest('.tag').find('.tagValue').text()
						);
					}
					// Not remove so focus
					else {
						$('#' + id + '_tagInput').focus();
					}

				});

				// If leaving the filed then convert any remaining text to a tag
				$('#' + id + '_tagInput').on('blur', function (event) {
					addTag(settings, $el, $('#' + id + '_tagInput').val(), true);
				})
					// Handle key events
					.on('keydown', function (event) {
						var $this = $(this);

						// Remove not valid
						$this.removeClass('invalidTag');

						// If enter or delimiter pressed
						if (event.key === 'Enter' || event.key === delimiter) {
							event.preventDefault();

							addTag(settings, $el, $this.val(), true);
						}
						// If backspace clicked
						else if (event.key === 'Backspace' && $this.val() === '') {
							event.preventDefault();

							removeTag(
								settings,
								$el,
								$this.closest('.tagInputWidget').find('.tag').last().find('.tagValue').text()
							);
							$this.focus();
						}
						// Else if copy
						else if((event.ctrlKey || event.metaKey) && event.key === 'c') {

							// If input field empty then we copy the tags
							if($this.val().length === 0) {
								event.preventDefault();

								// Create the element to perform the copy if not already created
								if(!copyElement) {
									copyElement = $('<textarea style="position:absolute; left:-9999px; top:0">');
									$('body').append(copyElement);
								}

								// Copy the tags back to the input & select it
								copyElement
									.val($el.val())
									.focus()
									[0].setSelectionRange(0, copyElement.val().length);

								// Copy
								try {
									document.execCommand('copy');
								} catch (e) {
								}

								// Focus the input field again
								$this.focus();
							}
						}
					});
			});
		}
	});

})();
