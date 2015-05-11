$(document).ready(function() {

	var css = [
		[
			'Base',
			'../css/fusion.css',
		],
		[
			'Cyan',
			'../css/fusioncss.md.cyan.purple.css'
		]
	];

	var html = '';
	for(var i=0;i<css.length;i++) {
		html += "<button data-sheet='" + css[i][1] + "')\">" + css[i][0] + "</button> ";
	}
	$('#cssoption').html(html);

	// Reload last CSS
	var selected = getCookie('fusionCSS.test.sheet');
	if(selected != null)
		$('#pagestyle').attr('href', selected);

	$('#cssoption button').click(function(e) {
		$('#pagestyle').attr('href', $(this).attr('data-sheet'));
		setCookie('fusionCSS.test.sheet', $(this).attr('data-sheet'));
		e.preventDefault();
		return false;
	});

	/**
	 * Set a cookie.
	 *
	 * @param string name The name of the cookie.
	 * @param string value The value to set in the cookie.
	 * @param Date|int expire Date cookie expires or time in seconds cookie to live.
	 * @param path string The path the cookie is limited to.
	 * @param domain string The domain the cookie is limited to.
	 * @param bool secure true if secure cookie; else false.
	 */
	function setCookie(name, value, expire, path, domain, secure) {
		var cookie = name + '=' + escape(value);

		if(expire !== undefined) {
			if(typeof expire !== 'object' || !(expire instanceof Date)) {
				expireDate = new Date();
				expireDate.setTime(expireDate.getTime() + expire);
				expire = expireDate;
			}

			cookie += '; expires=' + expire.toGMTString();
		}

		if(path) cookie += '; path=' + encodeURI(path);
		if(domain) cookie += '; domain=' + encodeURI(domain);
		if(secure) cookie += '; secure';

		document.cookie = cookie;
	}

	/**
	 * Get the value of a cookie.
	 *
	 * @param string name The name of the cookie to get the value of.
	 * @return string The value from the cookie or null.
	 */
	function getCookie(name) {
		var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		return results ? decodeURI(results[2]) : null;
	}
});
