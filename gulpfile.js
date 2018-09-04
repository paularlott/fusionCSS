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
 * Build JavaScript track element files
 */
gulp.task('jstrackelem', function() {
	return gulp.src([
		'./js/src/fusionCSSTrackElem.js'
	])
		.pipe(plugins.concat('fusionCSSTrackElem.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

/**
 * Build a single less file with everything but variables
 */
gulp.task('single_less', function() {
	return gulp.src([
		'./less/mixins.less',
		'./less/typography.less',
		'./less/grid.less',
		'./less/utilities.less',
		'./less/colors.less',
		'./less/tables.less',
		'./less/pagination.less',
		'./less/breadcrumb.less',
		'./less/navigation.less',
		'./less/alerts.less',
		'./less/visibility.less',
		'./less/cards.less',
		'./less/forms.less',
		'./less/buttons.less',
		'./less/slideinmenu.less',
		'./less/toast.less',
		'./less/tabs.less',
		'./less/chips.less',
		'./less/appbar.less',
		'./less/fam.less',
		'./less/shadow.less'
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
gulp.task('watch', function() {
	gulp.watch([
		'./less/*.less',
		'./less/themes/*.less'
	], gulp.parallel(themeTaskList));
	gulp.watch('./js/src/*.js', gulp.parallel(['js', 'jstrackelem', 'single_less']));
});

/**
 * Default build task
 */
gulp.task('default', gulp.parallel(['js', 'jstrackelem', 'single_less'].concat(themeTaskList)));
