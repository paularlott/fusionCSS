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
		'./js/src/fusionCSS.js'
	])
		.pipe(plugins.concat('fusionCSS.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

/**
 * Remove built files
 */
gulp.task('clean', function() {
	return plugins.del([
		'./css/*.css',
		'./js/*.js',
		'./docs/*.html'
	]);
});

/**
 * Build docs from doc sources
 */
gulp.task('docs', function() {
	gulp.src('./docs_src/*.html')
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
gulp.task('watch', function() {
	gulp.watch([
		'./less/*.less',
		'./less/themes/*.less'
	], themeTaskList);
	gulp.watch('./js/src/*.js', ['js']);
});

/**
 * Default build task
 */
gulp.task('default', ['js'].concat(themeTaskList));
