var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var chmod = require('gulp-chmod');
var merge = require('merge-stream');

gulp.task('scripts', function() {
  var raw = gulp.src('src/*.js')
    .pipe(gulp.dest('bin'));
  var src = gulp.src('src/*.es6')
    .pipe(babel())
    .pipe(rename(function (path) { path.extname = ".js"; }))
    .pipe(gulp.dest('bin'));
  var cli = gulp.src(['cli.es6','test.es6'])
    .pipe(babel())
    .pipe(rename(function (path) { path.extname = ".js"; }))
    .pipe(insert.prepend('#!/usr/bin/env node\n\n'))
    .pipe(chmod(755))
    .pipe(gulp.dest('bin'));
  return merge(raw, src, cli);
});

gulp.task('default', ['scripts']);
