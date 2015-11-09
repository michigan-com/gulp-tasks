'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

function bundleOpts() {
  return {
    prod: false,
    src: './src/sass/**/*.scss',
    dest: './public/css'
  };
}

function bundleFiles(done, opts) {
  if (typeof opts === 'undefined') opts = bundleOpts();

  if (opts.prod) {
    bundleProd(done, opts);
  } else {
    bundleProd(done, opts);
  }
}

function bundle(done, opts) {
 return gulp.src(opts.src)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(opts.dest))
    .on('end', function() {
      gutil.log('Sass finished compiling CSS files');
      done();
    });
}

function bundleProd(done, opts) {
  return gulp.src(opts.src)
    .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError))
    .pipe(gulp.dest(opts.dest))
    .on('end', function() {
      gutil.log('Sass finished compiling CSS files');
      done();
    });
}

module.exports = {
  bundleFiles: bundleFiles,
  opts: bundleOpts
};
