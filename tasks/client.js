'use strict';

var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var flatten = require('gulp-flatten');
var sourcemaps = require('gulp-sourcemaps');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var babelify = require('babelify');
var browserify = require('browserify');

var browserifyOpts = Object.assign({}, watchify.args, { debug: true });

var babelOpts = {
  presets: ['es2015', 'react', 'stage-0'],
  plugins: ['transform-runtime'],
};

var bundleOpts = {
  prod: false,
  watch: false,
  src: './src/client/',
  dest: './public/js/'
};

/**
 * Gets all .js files, non-recursively and then create separate browserify bundles
 */
function bundleFiles(done, options) {
  if (typeof options === 'undefined') options = bundleOpts;

  var count = 0;
  var files = fs.readdirSync(options.src);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.indexOf('.swp') >= 0) continue;
    if (file.toLowerCase().indexOf('.js' >= 0)) {
      var opts = Object.assign({}, options, { fname: options.src + file });

      if (opts.prod) {
        bundleProd(callbacksDone, opts);
      } else {
        bundle(callbacksDone, opts);
      }
    }
  }

  function callbacksDone() {
    count++;
    if (count == files.length) done();
  }
}

/**
 * Bundles a single js file into a browserify bundle
 */
function bundle(done, options) {
  if (typeof options === 'undefined') options = bundleOpts;

  gutil.log('Browserify bundling ' + options.fname);

  var b = browserify(options.fname, browserifyOpts);
  // place all transforms here
  b.transform('babelify', babelOpts);

  if (options.watch) {
    var w = watchify(b);
    gutil.log('Watching ' + options.fname);
    w.on('log', gutil.log);
    w.on('update', function() {
      bundle(undefined, options);
    });
  }

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source(options.fname))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(flatten())
    .pipe(gulp.dest(options.dest))
    .on('end', function() {
      gutil.log('Browserify finishined bundling ' + options.fname);
      if (typeof done === 'function') done();
    });
}

function bundleProd(done, options) {
  if (typeof options === 'undefined') options = bundleOpts;

  gutil.log('Browserify bundling ' + options.fname);

  var b = browserify(options.fname, browserifyOpts);
  // place all transforms here
  b.transform('babelify', babelOpts);

  return b.bundle()
    .on('error', gutil.log)
    .pipe(source(options.fname))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(flatten())
    .pipe(gulp.dest(options.dest))
    .on('end', function() {
      gutil.log('Browserify finishined bundling ' + options.fname);
      if (typeof done === 'function') done();
    });
}

module.exports = {
  bundleFiles: bundleFiles,
  bundleOpts: bundleOpts
};

