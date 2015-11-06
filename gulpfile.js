'use strict';

var gulp = require('gulp');
var ClientTask = require('./tasks/client');
var SassTask = require('./tasks/sass');

gulp.task('dev', ['client', 'sass']);
gulp.task('prod', ['client:prod', 'sass:prod']);
gulp.task('watch', ['client:watch', 'sass:watch']);

/**
 * Client-side tasks
 */

gulp.task('client', function(done) {
  ClientTask.bundleFiles(done);
});

gulp.task('client:watch', function(done) {
  var opts = Object.assign({}, ClientTask.opts, { watch: true });
  ClientTask.bundleFiles(done, opts);
});

gulp.task('client:prod', function(done) {
  var opts = Object.assign({}, ClientTask.opts, { prod: true });
  ClientTask.bundleFiles(done, opts);
});

/**
 * Sass tasks
 */

gulp.task('sass', function(done) {
  SassTask.bundleFiles(done);
});

gulp.task('sass:watch', function() {
  gulp.watch(SassTask.opts.src, ['sass']);
});

gulp.task('sass:prod', function(done) {
  var opts = Object.assign({}, SassTask.opts, { prod: true });
  SassTask.bundleFiles(done, opts);
});

/**
 * Server tasks
 */
