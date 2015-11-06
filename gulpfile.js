'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');

gulp.task('client', function(done) {
  bundleFiles(done);
});

gulp.task('watch', function(done) {
  bundleFiles(done, true);
});

/**
 * Gets all .js files, non-recursively and then creates separate browserify bundles
 */
function bundleFiles(done, watch, src) {
  if (typeof src === 'undefined') src = './src/client/';

  var count = 0;
  var files = fs.readdirSync(src);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.indexOf('.swp') >= 0) continue;
    if (file.toLowerCase().indexOf('.js' >= 0)) {
      bundle(callbacksDone, watch, src + file);
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
function bundle(done, watch, fname) {
  gutil.log('Browserify bundling ' + fname);

  var browserifyOpts = Object.assign({}, watchify.args, { debug: true });
  var babelOpts = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime'],
  };

  var b = browserify(fname, browserifyOpts);
  // place all transforms here
  b.transform('babelify', babelOpts);

  if (watch) {
    var w = watchify(b);
    gutil.log('Watching ' + fname);
    w.on('log', gutil.log);
    w.on('update', function() {
      bundle(undefined, false, fname);
    });
  }

  b.bundle()
    .on('error', gutil.log)
    .pipe(source(fname))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(flatten())
    .pipe(gulp.dest('./public/js'))
    .on('end', function() {
      gutil.log('Browserify finishined bundling ' + fname);
      if (typeof done === 'function') done();
    });

  return b;
}


