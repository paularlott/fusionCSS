$(document).ready(function() {

	var css = [
		[
			'Blue and Pink',
			'../css/fusioncss.flex-row.blue.pink.css'
		],
		[
			'Blue Grey and Red',
			'../css/fusioncss.flex-row.bluegrey.red.css'
		]
	];

	var html = '';
	for(var i=0;i<css.length;i++) {
		html += "<li" + (css[i][1] == localStorage.getItem('fusionCSS.test.sheet') ? ' class="active"' : '') + "><a href='#' data-sheet='" + css[i][1] + "'>" + css[i][0] + "</a></li> ";
	}
	$('#cssoption').html(html);

	// Reload last CSS
	var selected = localStorage.getItem('fusionCSS.test.sheet');
	if(selected != null)
		$('#pagestyle').attr('href', selected);

	$('#cssoption a').bind('click', function(e) {
		$('#pagestyle').attr('href', $(this).attr('data-sheet'));
		localStorage.setItem('fusionCSS.test.sheet', $(this).attr('data-sheet'));

		$('#cssoption li').removeClass('active');
		$(e.target).parent().addClass('active');

		$('#cssoption').addClass('hide');

		e.preventDefault();
		return false;
	});

	$('#style-select').bind('click', function(e) {
		if($('#cssoption').hasClass('hide'))
			$('#cssoption').removeClass('hide');
		else
			$('#cssoption').addClass('hide');
		e.preventDefault();
		return false;
	});

	$('body').bind('click', function(e) {
		$('#cssoption').addClass('hide');
	});
});
