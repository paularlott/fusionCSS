var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')();

plugins.fs = require('fs');
plugins.del = require('del');
plugins.panini = require('panini');

// Load the version information
var version = plugins.fs.readFileSync('./less/version.less', 'utf8'),
	themeTaskList = [];

/**
 * Get a list of the available themes and create the tasks
 */
var themeList = plugins.fs.readdirSync('./less/themes/');
themeList.forEach(function (theme) {

	// Create the names for the CSS and minified CSS files
	var cssfile = theme.toLowerCase().replace(/\.less$/, '.css'),
		minfile = theme.toLowerCase().replace(/\.less$/, '.min.css');

	// Create the task
	gulp.task(
		theme,
		function() {
			return gulp.src('./less/themes/' + theme)
				.pipe(plugins.less())
				.pipe(plugins.rename(cssfile))
				.pipe(gulp.dest('./css/'))

				.pipe(plugins.cleanCss())
				.pipe(plugins.insert.prepend(version))
				.pipe(plugins.rename(minfile))
				.pipe(gulp.dest('./css/'));
		}
	)
	themeTaskList.push(theme);
});

/**
 * Build JavaScript files
 */
gulp.task('js', function() {
	return gulp.src([
		'./js/src/core/*.js'
	])
		.pipe(plugins.concat('fusionCSS.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

/**
 * Build JavaScript track element files
 */
gulp.task('jstrackelem', function() {
	return gulp.src([
		'./js/src/track/*.js'
	])
		.pipe(plugins.concat('fusionCSSTrackElem.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

/**
 * Build JavaScript drag ordering
 */
gulp.task('jsdragorder', function() {
	return gulp.src([
		'./js/src/dragorder/*.js'
	])
		.pipe(plugins.concat('fusionCSSDragOrder.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

/**
 * Build a single less file with everything but variables
 */
gulp.task('single_less', function() {
	return gulp.src([
		'./less/*.less',
		'!./less/grid1.less',
		'!./less/fusionCSS.less',
		'!./less/variables.less',
		'!./less/version.less'
	])
		.pipe(plugins.concat('fusionCSS.less'))
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./css/'));
});

/**
 * Remove built files
 */
gulp.task('clean', function() {
	return plugins.del([
		'./css/*.css',
		'./css/*.less',
		'./js/*.js',
		'./docs/*.html'
	]);
});

/**
 * Build docs from doc sources
 */
gulp.task('docs', function() {
	return gulp.src('./docs_src/*.html')
		.pipe(plugins.panini({
			root: './docs_src/',
			layouts: './docs_src/layouts/',
			partials: './docs_src/partials/',
			helpers: './docs_src/helpers/',
			data: './docs_src/data/'
		}))
		.pipe(gulp.dest('docs'));
});

/**
 * Watch files for changes
 */
gulp.task('fusionCSSWatch', function() {
	gulp.watch([
		'./less/*.less',
		'./less/themes/*.less'
	], gulp.parallel(themeTaskList.concat(['single_less'])));
	gulp.watch('./js/src/core/*.js', gulp.parallel(['js']));
	gulp.watch('./js/src/track/*.js', gulp.parallel(['jstrackelem']));
	gulp.watch('./js/src/dragorder/*.js', gulp.parallel(['jsdragorder']));
});
gulp.task('watch', gulp.parallel(['js', 'jstrackelem', 'single_less'].concat(themeTaskList).concat('fusionCSSWatch')));

/**
 * Default build task
 */
gulp.task('default', gulp.parallel(['js', 'jstrackelem', 'jsdragorder', 'single_less'].concat(themeTaskList)));
