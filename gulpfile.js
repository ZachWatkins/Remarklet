var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');

gulp.task('default', function(){
  gulp.src('development/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest('production'));
  gulp.src('development/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('production'));
});