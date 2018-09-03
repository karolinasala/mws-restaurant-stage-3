var gulp = require('gulp');
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
//    uglify = require('gulp-uglify');
    sourcemaps = require('gulp-sourcemaps');
    browserSync = require('browser-sync').create();
    connect = require('gulp-connect');
    modRewrite = require('connect-modrewrite');
    open = require('gulp-open');
    minify = require('gulp-minify');
    imagemin = require('gulp-imagemin');

const js = {
  task: 'js',
  path: 'js/*.js',
  dest: 'dist/js',
  bundleName: 'app.js'
}

const jsDist = {
  task: 'js-dist',
  path: 'js/*.js',
  dest: 'dist/js'
}

const style = {
  task: 'style',
  path: 'sass/*.scss',
  dest: 'dist/css'
};

const img = {
  task: 'copy-images',
  path: 'img/*',
  dest: 'dist/img'
};

const copyHtml = {
  task: 'copy-html',
  path: '*.html',
  dest: 'dist'
}

const sw = {
  task: 'sw',
  path: 'service-worker.js',
  dest: 'dist'
}

gulp.task(style.task, function(){
  gulp.src(style.path)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(style.dest))
});

gulp.task(js.task, function(){
  gulp.src(js.path)
    .pipe(minify())
    .pipe(gulp.dest(js.dest))
});

gulp.task(jsDist.task, function(){
  gulp.src(jsDist.path)
    .pipe(sourcemaps.init())
  //  .pipe(uglify().on('error', e => console.log(e)))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(js.dest))
});

gulp.task(img.task, function() {
  gulp.src(img.path)
    .pipe(imagemin())
    .pipe(gulp.dest(img.dest));
});

gulp.task(copyHtml.task, function() {
  gulp.src([copyHtml.path, 'manifest.json'])
    .pipe(gulp.dest(copyHtml.dest));
});

gulp.task(sw.task, function(){
  gulp.src(sw.path)
      .pipe(gulp.dest(sw.dest))
});

gulp.task('browserSync', function(){
  browserSync.init({
      port:8000,
      server: "dist"
  });
});

gulp.task('default', ['browserSync', style.task, js.task, jsDist.task, img.task, copyHtml.task, sw.task]);

gulp.task('run',['default', 'browserSync', 'connect-https'], function(){
  console.log('Starting the app');
  connect.server({
    root: 'dist',
    name: 'HTTP',
    port: 80,
    https: false,
    debug: false,
    middleware: function(connect, options) {
      return [
        modRewrite([
          '/* https://localhost:443/ [L,R=301]'
        ])
      ];
    }
  });
  gulp.src(__filename)
  .pipe(open({uri: 'https://localhost'}));
});

gulp.task('connect-https', function() {
  connect.server({
    root: 'dist',
    name: 'HTTPS',
    port: 443,
    https: true
  });
});

gulp.task('watch', () => {
  gulp.watch(js.path, [js.task])
  gulp.watch(jsDist.path, [jsDist.task])
  gulp.watch(style.path, [style.task])
  gulp.watch(img.path, [img.task])
  gulp.watch(copyHtml.path, [copyHtml.task])
  gulp.watch(sw.path, [sw.task])
});
