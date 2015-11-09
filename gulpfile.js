'use strict';

var gulp = require('gulp');
var ClientTask = require('./tasks/client');
var ServerTask = require('./tasks/server');
var SassTask = require('./tasks/sass');

gulp.task('default', ['client:prod', 'server', 'sass:prod']);
gulp.task('dev', ['client', 'server', 'sass']);
gulp.task('watch', ['client:watch', 'server:watch', 'sass:watch']);

/**
 * Client-side tasks
 */

gulp.task('client', function(done) {
  ClientTask.bundleFiles(done);
});

gulp.task('client:watch', function(done) {
  var opts = ClientTask.opts();
  opts.watch = true;

  ClientTask.bundleFiles(done, opts);
});

gulp.task('client:prod', function(done) {
  var opts = ClientTask.opts();
  opts.prod = true;

  ClientTask.bundleFiles(done, opts);
});

/**
 * Server tasks
 */

gulp.task('server', function(done) {
  var opts = ServerTask.opts();
  opts.babel = ClientTask.opts().babel;

  ServerTask.bundleFiles(done, opts);
});

gulp.task('server:watch', function(done) {
  gulp.watch(ServerTask.opts().src, ['server']);
});

/**
 * Sass tasks
 */

gulp.task('sass', function(done) {
  SassTask.bundleFiles(done);
});

gulp.task('sass:watch', function() {
  gulp.watch(SassTask.opts().src, ['sass']);
});

gulp.task('sass:prod', function(done) {
  var opts = SassTask.opts();
  opts.prod = true;

  SassTask.bundleFiles(done, opts);
});

