var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function(){
  return gulp.src('development/script/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('dependencies.js'))
    .pipe(gulp.dest('development'))
    .pipe(rename('dependencies.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('production'));
});