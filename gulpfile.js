var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    runSequence = require('run-sequence'),
    reload = browserSync.reload;

// Uglyfies js on to /js/minjs
gulp.task('scripts', function(){
  gulp.src('app/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest("app/js/minjs"));
});

// Compiles less on to /css
gulp.task('less', function () {
  gulp.src('app/less/**/*.less')
   .pipe(plumber())
   .pipe(less())
   .pipe(gulp.dest('app/css'))
   .pipe(reload({stream:true}));
});

// reload server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "app"
        }
    });
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// watch for changes on files
gulp.task('watch', function(){
  gulp.watch('app/js/*.js', ['scripts']);
  gulp.watch('app/less/*.less', ['less']);
  gulp.watch("app/*.html", ['bs-reload']);
});

// run through script tag and combine to main.min.js
gulp.task('useref',function(){
    gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dest'))
});

//copy the fonts to output
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

// delete the dist folder when clean:dist
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// run in sequence for build
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['scripts', 'less', 'useref', 'images', 'fonts'],
    callback
  )
});

//deploy
gulp.task('default', function (callback) {
  runSequence(['scripts', 'less','browser-sync','watch'],
    callback
  )
});
