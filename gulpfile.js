var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')();

plugins.fs = require('fs');
plugins.panini = require('panini');

// Load the version information
var version = plugins.fs.readFileSync('./less/version.less', 'utf8');

/**
 * Compile the source less generating both normal and minified CSS
 *
 * @param string src The source to compile.
 * @param string dst The target file name.
 * @param string dstMin The target file name for the minified version.
 * @returns gulp
 */
function cssTask(src, dst, dstMin) {
	return gulp.src(src)
		.pipe(plugins.less())
		.pipe(plugins.rename(dst))
		.pipe(gulp.dest('./css/'))

		.pipe(plugins.cleanCss())
		.pipe(plugins.insert.prepend(version))
		.pipe(plugins.rename(dstMin))
		.pipe(gulp.dest('./css/'));
}

gulp.task('blue.pink', function() {
	var theme = 'blue.pink';
	return cssTask('./less/themes/fusionCSS.' + theme + '.less', 'fusioncss.' + theme + '.css', 'fusioncss.' + theme + '.min.css');
});

gulp.task('bluegrey.red', function() {
	var theme = 'bluegrey.red';
	return cssTask('./less/themes/fusionCSS.' + theme + '.less', 'fusioncss.' + theme + '.css', 'fusioncss.' + theme + '.min.css');
});

// Build the material themes
gulp.task('less', [
	'blue.pink',
	'bluegrey.red'
]);

gulp.task('js', function() {
	return gulp.src([
		'./js/src/fusionCSS.js'
	])
		.pipe(plugins.concat('fusionCSS.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.insert.prepend(version))
		.pipe(gulp.dest('./js/'));
});

gulp.task('clean', function() {
	return del([
		'./css/*.css',
		'./js/*.js',
		'./docs/*.html'
	]);
});

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

gulp.task('watch', function() {
	gulp.watch([
		'./less/*.less',
		'./less/themes/*.less'
	], ['less']);
	gulp.watch('./js/src/*.js', ['js']);
});

gulp.task('default', ['less', 'js']);

