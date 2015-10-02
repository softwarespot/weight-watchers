/* global require */

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jshint = require('gulp-jshint');
var prettify = require('gulp-jsbeautifier');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

// See the cssmin documentation for more details
var cssMinSettings = {
    keepSpecialComments: 0
};

// See the uglify documentation for more details
var uglifySettings = {
    compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        unsafe: true,
        unused: true
    }
};

// Assets for the project
var Assets = {
    css: {
        dest: 'css',
        custom: {
            all: [
                // Note: /css/ is the same as Assets.css.dest

                // Select all js file(s) include sub-directories
                './css/**/*.css',

                // Ignore all css file(s) that have the .min.css prefix
                '!./css/**/*.min.css'
            ],
            // main: 'styles.css',
            minified: 'styles.min.css'
        },
        vendor: {
            // main: 'vendor.css',
            minified: 'vendor.min.css'
        }
    },
    js: {
        dest: 'js',
        custom: {
            all: [
                // Note: /js/ is the same as Assets.js.dest

                // Select all js file(s) include sub-directories
                './js/**/*.js',

                // Ignore all js file(s) that have the .min.js prefix
                '!./js/**/*.min.js'
            ],
            // main: 'scripts.js',
            minified: 'scripts.min.js'
        },
        vendor: {
            // main: 'vendor.js',
            minified: 'vendor.min.js'
        }
    }
};

// Clean the current directory
gulp.task('clean', function (cb) {
    del([
        './' + Assets.css.dest + '/' + Assets.css.custom.minified,
        './' + Assets.js.dest + '/' + Assets.js.custom.minified
    ], cb);
});

// Minify the main css file(s)
gulp.task('cssmin', function () {
    // Store the destination directory
    var dest = './' + Assets.css.dest;

    // Clean the css dest directory
    del(['./' + Assets.css.dest + '/' + Assets.css.custom.minified]);

    return gulp.src([
            dest + '/styles.css',
        ])
        .pipe(concat(Assets.css.custom.minified))
        .pipe(cssmin(cssMinSettings))
        .pipe(rename(Assets.css.custom.minified))
        .pipe(gulp.dest('./' + Assets.css.dest));
});

// Check the code meets the following standards outlined in .jshintrc
gulp.task('jshint', function () {
    return gulp.src(Assets.js.custom.all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Prettify the main js file(s)
gulp.task('prettify-js', function () {
    gulp.src(Assets.js.custom.all)
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest('./' + Assets.js.dest));
});

// Uglify aka minify the main js file(s)
gulp.task('uglify', function () {
    // Store the destination directory
    var dest = './' + Assets.js.dest;

    // Clean the js dest directory
    del([dest + '/' + Assets.js.custom.minified]);

    return gulp.src([
            dest + '/app.js',
            dest + '/api.js',
            dest + '/weight.js'
        ])
        .pipe(concat(Assets.js.custom.minified))
        .pipe(uglify(uglifySettings))
        .pipe(rename(Assets.js.custom.minified))
        .pipe(gulp.dest(dest));
});

// Concat and uglify the vendor scripts/styles
gulp.task('vendor', function () {
    // Store the bower_components directory
    var bowerComponents = './bower_components/';

    // Copy fonts
    gulp.src([
            bowerComponents + 'font-awesome/fonts/**/*.{eof,svg,ttf,woff,woff2}',
            bowerComponents + 'open-sans/fonts/**/*.{eof,svg,ttf,woff,woff2}'
        ])
        .pipe(gulp.dest('./fonts'));

    // Concatenate and minify styles
    gulp.src([
            bowerComponents + 'font-awesome/css/font-awesome.css',
            bowerComponents + 'open-sans/css/open-sans.css',
            bowerComponents + 'normalize-css/normalize.css',
            bowerComponents + 'skeleton/css/skeleton.css',
            bowerComponents + 'nprogress/nprogress.css'
        ])
        .pipe(concat(Assets.css.vendor.minified))
        .pipe(cssmin(cssMinSettings))
        .pipe(gulp.dest('./' + Assets.css.dest));

    // Concatenate and uglify scripts
    gulp.src([
            bowerComponents + 'jquery/dist/jquery.js',
            bowerComponents + 'handlebars/handlebars.js',
            bowerComponents + 'momentjs/moment.js',
            bowerComponents + 'nprogress/nprogress.js',
            bowerComponents + 'jquery-handlebars/jquery-handlebars.js',
            bowerComponents + 'jquery.serializeJSON/jquery.serializejson.js'
        ])
        .pipe(concat(Assets.js.vendor.minified))
        .pipe(uglify(uglifySettings))
        .pipe(gulp.dest('./' + Assets.js.dest));
});

// Build the main css and js file(s)
gulp.task('build', ['clean', 'cssmin', 'uglify']);

// Watch for changes to the main css and js file(s)
gulp.task('watch', function () {
    gulp.watch(Assets.css.custom.all, ['cssmin']);
    gulp.watch(Assets.js.custom.all, ['jshint', 'uglify']);
});

// Register the default task which is essentially 'build' and 'vendor' included
gulp.task('default', ['build', 'vendor']);

// 'gulp build' to build the main css and js file(s)
// 'gulp cssmin' to minify the main css file(s)
// 'gulp jshint' to check the syntax of the main js file(s)
// 'gulp prettify-js' to prettify the main js file(s)
// 'gulp uglify' to uglify the main js file(s)
// 'gulp vendor' to build the vendor file(s)
// 'gulp watch' to watch for changes to the main css and js file(s)
// 'gulp' to build everything
