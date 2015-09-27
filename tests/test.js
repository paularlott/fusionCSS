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
	var selected = localStorage.getItem('fusionCSS.test.sheet');
	if(selected != null)
		$('#pagestyle').attr('href', selected);

	$('#cssoption button').click(function(e) {
		$('#pagestyle').attr('href', $(this).attr('data-sheet'));
		localStorage.setItem('fusionCSS.test.sheet', $(this).attr('data-sheet'));
		e.preventDefault();
		return false;
	});

});
