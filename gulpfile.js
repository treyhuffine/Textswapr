var gulp  = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default', ['js', 'watch']);

gulp.task('js', function(cb) {
  return gulp.src('./source/javascripts/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('watch', function(cb){
  return gulp.watch('./source/javascripts/**/*', ['js']);
});
