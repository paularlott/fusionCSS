var gulp = require('gulp'),
	fs = require('fs'),
	version = fs.readFileSync('./less/version.less', 'utf8'),
	less = require('gulp-less'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	del = require('del'),
	panini = require('panini');

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
		.pipe(less({
			compress: false
		}))
		.pipe(rename(dst))
		.pipe(gulp.dest('./css/'))

		.pipe(cleanCSS())
		.pipe(insert.prepend(version))
		.pipe(rename(dstMin))
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
		.pipe(concat('fusionCSS.js'))
		.pipe(uglify())
		.pipe(insert.prepend(version))
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
		.pipe(panini({
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
