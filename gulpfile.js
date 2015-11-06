'use strict';

var gulp = require('gulp');
var ClientTask = require('./tasks/client');

gulp.task('client', function(done) {
  ClientTask.bundleFiles(done);
});

gulp.task('client:watch', function(done) {
  var opts = Object.assign({}, ClientTask.bundleOpts, { watch: true });
  ClientTask.bundleFiles(done, opts);
});

gulp.task('client:prod', function(done) {
  var opts = Object.assign({}, ClientTask.bundleOpts, { prod: true });
  ClientTask.bundleFiles(done, opts);
});

