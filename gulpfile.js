var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function(){
  return gulp.src('development/script/*.js') // read all of the files that are in script/lib with a .js extension
    .pipe(jshint()) // run their contents through jshint
    .pipe(jshint.reporter('default')) // report any findings from jshint
    .pipe(concat('all.js')) // concatenate all of the file contents into a file titled 'all.js'
    .pipe(gulp.dest('dist/js')) // write that file to the dist/js directory
    .pipe(rename('all.min.js')) // now rename the file in memory to 'all.min.js'
    .pipe(uglify()) // run uglify (for minification) on 'all.min.js'
    .pipe(gulp.dest('dist/js')); // write all.min.js to the dist/js file
});