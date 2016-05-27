'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task) {
    return require('./gulp_tasks/' + task)(gulp, plugins);
}

gulp.task('tslint', getTask('tslint'));
gulp.task('doc', getTask('typedoc'));

gulp.task('ts', getTask('typescript'));
gulp.task('browserify', ['ts'], getTask('browserify'));

gulp.task('server:light', getTask('server-light'));
gulp.task('server:stats', getTask('server-stats'));
gulp.task('server', ['server:light', 'server:stats']);

gulp.task('default', ['tslint', 'doc', 'browserify']);
