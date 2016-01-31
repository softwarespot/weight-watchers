/* global require */

var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var eslint = require('gulp-eslint');
var gulpIf = require('gulp-if');
var htmlMin = require('gulp-htmlmin');
var prettify = require('gulp-jsbeautifier');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');

// Assets for the project
var Assets = {
    css: {
        dest: './build/css',
        source: './css',
        custom: {
            all: [

                // Select all css file(s) include sub-directories
                './css/**/*.css',

                // Ignore all css file(s) that have the .min.css prefix
                '!./css/**/*.min.css',
            ],

            // main: 'styles.css',
            minified: 'styles.min.css',
        },
        vendor: {
            // main: 'vendor.css',
            minified: 'vendor.min.css',
        },
    },
    fonts: {
        dest: './build/fonts',
    },
    html: {
        dest: './',
        source: './html',
        custom: {
            all: [

                // Select all html file(s) include sub-directories
                './html/**/*.html',
            ],
        },
    },
    images: {
        dest: './build/images',
        source: './images/**/*.*',
    },
    js: {
        dest: './build/js',
        source: './js',
        custom: {
            all: [

                // Select all js file(s) include sub-directories
                './js/**/*.js',

                // Ignore all js file(s) that have the .min.js prefix
                '!./js/**/*.min.js',
            ],

            // main: 'scripts.js',
            minified: 'scripts.min.js',
        },
        vendor: {
            // main: 'vendor.js',
            minified: 'vendor.min.js',
        },
    },
};

// See the cssmin documentation for more details
var _cssMinSettings = {
    keepSpecialComments: 0,
};

// See the htmlmin documentation for more details
var _htmlSettings = {
    caseSensitive: true,
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    quoteCharacter: '"',
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
};

// See the uglify documentation for more details
var _uglifySettings = {
    compress: {
        comparisons: true,
        conditionals: true,
        /* jscs: disable */
        dead_code: true,
        drop_console: true,
        /* jscs: enable */
        unsafe: true,
        unused: true,
    },
};

// Clean the current directory
gulp.task('clean', function cleanTask(cb) {
    del([
        Assets.css.dest + '/**/*.*',
        Assets.images.dest + '/**/*.*',
        Assets.js.dest + '/**/*.*',
    ], cb);
});

// Minify the main css file(s)
gulp.task('cssmin', function cssMinTask() {
    // Store the destination directory
    var dest = Assets.css.dest;

    // Store the source directory
    var source = Assets.css.source;

    // Store the minified filename
    var minified = Assets.css.custom.minified;

    // Clean the css destination directory
    del([dest + '/' + minified]);

    return gulp.src([
            source + '/styles.css',
        ])
        .pipe(concat(minified))
        .pipe(cssmin(_cssMinSettings))
        .pipe(rename(minified))
        .pipe(gulp.dest(dest));
});

// Check the main js file meets the following standards outlined in .eslintrc
gulp.task('eslint', function esLintTask() {
    // Has ESLint fixed the file contents?
    function isFixed(file) {
        return file.eslint !== undefined && file.eslint !== null && file.eslint.fixed;
    }

    // All js file(s)
    var all = Assets.js.custom.all;

    // Store the source directory
    var source = Assets.js.source;

    return gulp.src(all)
        .pipe(eslint({
            fix: true,
            useEslintrc: '.eslintrc',
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest(source)));
});

// Minify the main html file(s)
gulp.task('htmlmin', function cssMinTask() {
    // All html file(s)
    var all = Assets.html.custom.all;

    // Store the destination directory
    var dest = Assets.html.dest;

    return gulp.src(all)
        .pipe(htmlMin(_htmlSettings))
        .pipe(gulp.dest(dest));
});

// Copy images to the destination directory
gulp.task('images', function imagesTask() {
    // Store the destination directory
    var dest = Assets.images.dest;

    // Store the source directory
    var source = Assets.images.source;

    // Copy images to the destination directory
    return gulp.src(source)
        .pipe(gulp.dest(dest));
});

// Prettify the main js file(s)
gulp.task('prettify-js', function prettifyJSTask() {
    // All js file(s)
    var all = Assets.js.custom.all;

    // Store the source directory
    var source = Assets.js.source;

    gulp.src(all)
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE',
        }))
        .pipe(gulp.dest(source));
});

// Uglify aka minify the main js file(s)
gulp.task('uglify', function uglifyTask() {
    // Store the destination directory
    var dest = Assets.js.dest;

    // Store the source directory
    var source = Assets.js.source;

    // Store the minified filename
    var minified = Assets.js.custom.minified;

    // Clean the js destination directory
    del([dest + '/' + minified]);

    return gulp.src([
            // Core library
            source + '/core.js',
            source + '/core.api.js',
            source + '/core.emitter.js',
            source + '/core.events.js',
            source + '/core.session.js',

            // Non-core library
            source + '/navigation.js',
            source + '/user.js',
            source + '/weight.js',
        ])
        .pipe(concat(minified))
        .pipe(uglify(_uglifySettings))
        .pipe(rename(minified))
        .pipe(gulp.dest(dest));
});

// Concat and uglify the vendor scripts/styles
gulp.task('vendor', function vendorTask() {
    // Store the bower_components directory
    var bowerComponents = './bower_components/';

    // Copy fonts to the destination directory
    gulp.src([
            bowerComponents + 'font-awesome/fonts/**/*.{eof,svg,ttf,woff,woff2}',
            bowerComponents + 'open-sans/fonts/**/*.{eof,svg,ttf,woff,woff2}',
        ])
        .pipe(gulp.dest(Assets.fonts.dest));

    // Store the css destination directory
    var cssDest = Assets.css.dest;

    // Store the css minified filename
    var cssMinified = Assets.css.vendor.minified;

    // Concatenate and minify styles
    gulp.src([
            bowerComponents + 'font-awesome/css/font-awesome.css',
            bowerComponents + 'open-sans/css/open-sans.css',
            bowerComponents + 'normalize-css/normalize.css',
            bowerComponents + 'skeleton/css/skeleton.css',
            bowerComponents + 'nprogress/nprogress.css',
        ])
        .pipe(concat(cssMinified))
        .pipe(cssmin(_cssMinSettings))
        .pipe(gulp.dest(cssDest));

    // Store the js destination directory
    var jsDest = Assets.js.dest;

    // Store the js minified filename
    var jsMinified = Assets.js.vendor.minified;

    // Concatenate and uglify scripts
    gulp.src([
            bowerComponents + 'jquery/dist/jquery.js',
            bowerComponents + 'Chart.js/Chart.js',
            bowerComponents + 'es6-collections/index.js',
            bowerComponents + 'es6-promise/promise.js',
            bowerComponents + 'es6-shim/es6-shim.js',
            bowerComponents + 'fetch/fetch.js',
            bowerComponents + 'handlebars/handlebars.js',
            bowerComponents + 'momentjs/moment.js',
            bowerComponents + 'nprogress/nprogress.js',
            bowerComponents + 'jquery-handlebars/jquery-handlebars.js',
            bowerComponents + 'jquery.serializeJSON/jquery.serializejson.js',
        ])
        .pipe(concat(jsMinified))
        .pipe(uglify(_uglifySettings))
        .pipe(gulp.dest(jsDest));
});

// Build the main css and js file(s)
gulp.task('build', ['cssmin', 'htmlmin', 'uglify']);

// Watch for changes to the main css, html and js file(s)
gulp.task('watch', function watchTask() {
    gulp.watch(Assets.css.custom.all, ['cssmin']);
    gulp.watch(Assets.html.custom.all, ['htmlmin']);
    gulp.watch(Assets.js.custom.all, ['eslint', 'uglify']);
});

// Register the default task which is essentially 'build' and 'vendor' included
gulp.task('default', ['clean', 'build', 'images', 'vendor']);

// 'gulp build' to build the main css and js file(s)
// 'gulp cssmin' to minify the main css file(s)
// 'gulp eslint' to check the syntax of the main js file(s)
// 'gulp htmlmin' to minify the main html file(s)
// 'gulp images' to copy images files to the destination directory
// 'gulp prettify-js' to prettify the main js file(s)
// 'gulp uglify' to uglify the main js file(s)
// 'gulp vendor' to build the vendor file(s)
// 'gulp watch' to watch for changes to the main css and js file(s)
// 'gulp' to build everything
