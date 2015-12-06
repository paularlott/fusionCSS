var gulp = require('gulp'),
	fs = require('fs'),
	version = fs.readFileSync('./less/base/version.less', 'utf8'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	del = require('del');

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

		.pipe(minifyCSS())
		.pipe(insert.prepend(version))
		.pipe(rename(dstMin))
		.pipe(gulp.dest('./css/'));
}

gulp.task('base', function() {
	 return cssTask('./less/fusionCSS.less', 'fusion.css', 'fusion.min.css');
});

gulp.task('blue.pink', function() {
	var theme = 'blue.pink';
	return cssTask('./less/fusionCSS.MD.' + theme + '.less', 'fusioncss.md.' + theme + '.css', 'fusioncss.md.' + theme + '.min.css');
});

// Build the material themes
gulp.task('material', [
	'blue.pink'
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
		'./js/*.js'
	]);
});

gulp.task('watch', function() {
	gulp.watch([
		'./less/*.less',
		'./less/base/*.less',
		'./less/material/*.less'
	], ['base', 'material']);
	gulp.watch('./js/src/*.js', ['js']);
});

gulp.task('default', ['base', 'material', 'js']);

