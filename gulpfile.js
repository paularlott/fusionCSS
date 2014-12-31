var gulp = require('gulp'),
	fs = require('fs'),
	version = fs.readFileSync('./less/version.less', 'utf8'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify');

gulp.task('less', function() {
	return gulp.src('./less/fusionCSS.less')
		.pipe(less({
			compress: false
		}))
		.pipe(insert.prepend(version))
		.pipe(rename('fusion.css'))
		.pipe(gulp.dest('./css/'));
});

gulp.task('lessmin', function() {
	return gulp.src('./less/fusionCSS.less')
		.pipe(less({
			compress: true
		}))
		.pipe(minifyCSS())
		.pipe(insert.prepend(version))
		.pipe(rename('fusion.min.css'))
		.pipe(gulp.dest('./css/'));
});

gulp.task('js', function() {
	return gulp.src('./js/src/fusionCSS.js')
		.pipe(uglify())
		.pipe(insert.prepend(version))
		.pipe(rename('fusionCSS.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('jsui', function() {
	return gulp.src('./js/src/fusionCSS.ui.js')
		.pipe(uglify())
		.pipe(insert.prepend(version))
		.pipe(rename('fusionCSS.ui.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('clean', function() {
	fs.unlinkSync('./css/fusion.css');
	fs.unlinkSync('./css/fusion.min.css');
	fs.unlinkSync('./js/fusionCSS.js');
	fs.unlinkSync('./js/fusionCSS.ui.js');
});

gulp.task('watch', function() {
	gulp.watch('./less/*.less', ['less', 'lessmin']);
	gulp.watch('./js/src/*.js', ['js', 'jsui']);
});

gulp.task('default', ['less', 'lessmin', 'js', 'jsui']);

