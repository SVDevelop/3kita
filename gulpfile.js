const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const less = require('gulp-less');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const htmlbeautify = require('gulp-html-beautify');

// SVG sprites
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svgsprite');
const rename = require('gulp-rename');

// Images
const imagemin = require('gulp-imagemin');
// const pngquant = require('imagemin-pngquant');

// HTML, CSS, JS
const usemin = require('gulp-usemin');
const htmlclean = require('gulp-htmlclean');
const uglify = require("gulp-uglify"); // Сжатие JS
const minifyCss = require("gulp-minify-css"); // Сжатие CSS
const rev = require('gulp-rev');

gulp.task('server', function() {
	browserSync.init({
		server: { baseDir: './build/'}
	});
	watch('./src/*.html').on('change', gulp.series('pug'));//'./src/pug/**/*.*'
	watch('./src/less/**/*.less').on('change', gulp.series('styles'));
	watch('./src/js/**/*.js').on('change', gulp.series('copy:js'));
	// watch('./src/libs/**/*.*').on('change', gulp.series('copy:libs-local'));
	watch(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg']).on('change', gulp.series('copy:img'));
	watch('./src/img/svg/*.svg').on('change', gulp.series('svg'));
});

gulp.task('server:docs', function() {
	browserSync.init({
		server: { baseDir: './docs/'}
	});
});

gulp.task('styles', function() {
	return gulp.src('./src/less/*.less')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'Styles',
				sound: false,
				message: err.message
			}
		})
	}))
	.pipe(sourcemaps.init())
	.pipe(less())
	.pipe(autoprefixer({
		browsers: ['last 6 versions'],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
});

gulp.task('pug', function() {
	return gulp.src('./src/index.html') //('./src/pug/pages/**/*.pug')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'Pug',
				sound: false,
				message: err.message
			}
		})
	}))
	.pipe(pug())
	.pipe(htmlbeautify(htmlbeautifyOptions))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.stream());
});

const htmlbeautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true,
	"preserve_newlines": false,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
};

gulp.task('svg', function() {
	return gulp.src('./src/img/svg-for-sprites/*.svg')
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	.pipe(cheerio({
		run: function($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(replace('&gt;', '>'))
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: "sprite.svg"
			}
		}
	}))
	.pipe(rename('sprite.svg'))
	.pipe(gulp.dest('./build/img'));
});

gulp.task('copy:libs', function(callback) {
   
    gulp.src('node_modules/jquery/dist/**/*.*')
		.pipe(gulp.dest('./build/libs/jquery'));

	gulp.src('node_modules/bootstrap-4-grid/css/**/*.*')
		.pipe(gulp.dest('./build/libs/bootstrap-4-grid'))

	gulp.src('node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest('./build/libs/normalize-css/'))

	callback()
});

gulp.task('copy:libs-local', function(callback) {
	gulp.src('./src/libs/**/*.*')
		.pipe(gulp.dest('./build/libs/'))
	callback()
});

gulp.task('copy:img', function() {
	return gulp.src(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg'])
		.pipe(gulp.dest('./build/img'))
		.pipe(browserSync.stream());
});

gulp.task('copy:js', function() {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

gulp.task('clean:build', function() {
    return del('./build');
});

gulp.task('copy:build:files', function(callback) {
    gulp.src('./src/php/**/*.*')
        .pipe(gulp.dest('./build/php/'))
    gulp.src('./src/files/**/*.*')
        .pipe(gulp.dest('./build/files/'))
	gulp.src('./src/fonts/**/*.*')
	        .pipe(gulp.dest('./build/fonts/'))
	callback()
});

gulp.task('default', 
	gulp.series('clean:build',
		gulp.parallel('styles', 'pug', 'svg', 'copy:libs', 'copy:libs-local', 'copy:img', 'copy:js'),
		'server'
	)
);


/* ------------------------------------
  DOCS TASKS
------------------------------------ */

gulp.task('clean:docs', function() {
    return del('./docs');
});

gulp.task('img:dist', function() {
    return gulp.src('./build/img/**/*.*')
	.pipe(imagemin({
		progressive: true,
		// optimizationLevel: 5,
		svgoPlugins: [{removeViewBox: false}],
		// use: [pngquant()],
		interlaced: true
	}))
    .pipe(gulp.dest('./docs/img'));
});

gulp.task('copy:docs:files', function(callback) {
    gulp.src('./src/php/**/*.*')
        .pipe(gulp.dest('./dist/php/'))
    gulp.src('./src/files/**/*.*')
        .pipe(gulp.dest('./dist/files/'))
	gulp.src('./src/fonts/**/*.*')
	        .pipe(gulp.dest('./docs/fonts/'))
	callback()
});

gulp.task('html:docs', function() {
    return gulp.src('./build/*.html')
    	.pipe(usemin({
    		//  <!-- build:cssVendor css/vendor.css --> <!-- endbuild -->
			cssVendor: [function() { return rev() }, function() { return minifyCss() } ], 
			cssCustom: [function() { return rev() }, function() { return minifyCss() } ],
			jsLibs: [function() { return rev() }, function() { return uglify() } ],
			jsVendor: [function() { return rev() }, function() { return uglify() } ],
			jsMain: [function() { return rev() }, function() { return uglify() } ]
    	}))
		.pipe(htmlclean())
	.pipe(gulp.dest('./docs/'));
});

gulp.task('docs', 
	gulp.series('clean:build',
		gulp.parallel('styles', 'pug', 'svg', 'copy:libs', 'copy:libs-local', 'copy:img', 'copy:js'),
    	'clean:docs',
		gulp.parallel('img:dist', 'copy:docs:files', 'html:docs'),
    	'server:docs'
	)
);
