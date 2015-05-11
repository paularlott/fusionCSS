var gulp = require('gulp'),
	fs = require('fs'),
	version = fs.readFileSync('./less/base/version.less', 'utf8'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	uglify = require('gulp-uglify');

var themes = [
	'cyan.purple'
];

gulp.task('less', function() {
	gulp.src('./less/fusionCSS.less')
		.pipe(less({
			compress: false
		}))
		.pipe(rename('fusion.css'))
		.pipe(gulp.dest('./css/'));

	gulp.src('./less/fusionCSS.less')
		.pipe(less({
			compress: true
		}))
		.pipe(minifyCSS())
		.pipe(insert.prepend(version))
		.pipe(rename('fusion.min.css'))
		.pipe(gulp.dest('./css/'));
});

gulp.task('mdless', function() {
	for(var i=0;i<themes.length;i++) {
		gulp.src('./less/fusionCSS.MD.' + themes[i] + '.less')
			.pipe(less({
				compress: false
			}))
			.pipe(rename('fusioncss.md.' + themes[i] + '.css'))
			.pipe(gulp.dest('./css/'));

		gulp.src('./less/fusionCSS.MD.' + themes[i] + '.less')
			.pipe(less({
				compress: true
			}))
			.pipe(minifyCSS())
			.pipe(insert.prepend(version))
			.pipe(rename('fusioncss.md.' + themes[i] + '.min.css'))
			.pipe(gulp.dest('./css/'));
	}
});

gulp.task('js', function() {
	gulp.src('./js/src/fusionCSS.js')
		.pipe(uglify())
		.pipe(insert.prepend(version))
		.pipe(rename('fusionCSS.js'))
		.pipe(gulp.dest('./js/'));

	gulp.src('./js/src/fusionCSS.ui.js')
		.pipe(uglify())
		.pipe(insert.prepend(version))
		.pipe(rename('fusionCSS.ui.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('clean', function() {
	for(var i=0;i<themes.length;i++) {
		fs.unlinkSync('./css/fusioncss.md.' + themes[i] + '.css');
		fs.unlinkSync('./css/fusioncss.md.' + themes[i] + '.min.css');
	}

	fs.unlinkSync('./css/fusion.css');
	fs.unlinkSync('./css/fusion.min.css');
	fs.unlinkSync('./js/fusionCSS.js');
	fs.unlinkSync('./js/fusionCSS.ui.js');
});

gulp.task('watch', function() {
	gulp.watch('./less/*.less', ['less', 'mdless']);
	gulp.watch('./less/base/*.less', ['less']);
	gulp.watch('./less/material/*.less', ['mdless']);
	gulp.watch('./js/src/*.js', ['js']);
});

gulp.task('default', ['less', 'mdless', 'js']);

