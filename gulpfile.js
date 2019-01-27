'use strict';

/**************** Gulp.js 4 configuration ****************/

const gulp = require('gulp'),
  gulpIf = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  minifycss = require('gulp-uglifycss'),
  sass = require('gulp-sass'),
  less = require('gulp-less'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  lec = require('gulp-line-ending-corrector'),
  plumber = require('gulp-plumber'),
  del = require('del'),
  htmlreplace = require('gulp-html-replace'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  babelify = require('babelify');

const autoprefixerOptions = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const browserSyncOptions = {
  notify: false,
  server: {
    baseDir: './dist/'
  },
  reloadOnRestart: true,
  open: true,
  injectChanges: true,
  port: 3000
};

function reload(done) {
  browserSync.reload();
  done();
}

// browser-sync
function server(done) {
  if (browserSync) browserSync.init(browserSyncOptions);
  done();
}

function copyHtml(done) {
  gulp.src('src/*.html').pipe(gulp.dest('dist'));
  done();
}

function copyImage(done) {
  gulp.src('src/images/*').pipe(gulp.dest('dist/images'));
  done();
}

function imageMin(done) {
  gulp
    .src('src/images/*')
    .pipe(
      cache(
        imagemin({
          gif: {
            interlaced: true
          }
        })
      )
    )
    .pipe(gulp.dest('dist/images'));
  done();
}

function fonts(done) {
  gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));

  done();
}

// Compile Sass Development
function sassDev(done) {
  gulp
    .src('src/sass/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: false,
        outputStyle: 'expanded',
        precision: 10
      })
    )
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('sass.css'))
    .on(
      'error',
      notify.onError({
        title: 'ERROR: Sass Compilation...',
        message: 'Check console for details. <%= error.message %>',
        icon: './src/images/error-icon.png'
      })
    )
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(
      notify({
        title: 'SUCCESS: Sass Compiled...',
        message: 'Sass file compiled: "<%= file.relative %>"',
        icon: './src/images/success-icon.png',
        timeout: 3
      })
    )
    .pipe(plumber.stop())
    .pipe(lec({ verbose: true, eolc: 'LF', encoding: 'utf8' }))
    .pipe(gulp.dest('dist/css'));
  done();
}

// Compile Less Development
function lessDev(done) {
  gulp
    .src('src/less/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({ compress: false }))
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('less.css'))
    .on(
      'error',
      notify.onError({
        title: 'ERROR: Less Compilation...',
        message: 'Check console for details. <%= error.message %>',
        icon: './src/images/error-icon.png'
      })
    )
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(
      notify({
        title: 'SUCCESS: Less Compiled...',
        message: 'Less file compiled: "<%= file.relative %>"',
        icon: './src/images/success-icon.png',
        timeout: 3
      })
    )
    .pipe(gulp.dest('dist/css'));
  done();
}

// CSS Development
function cssDev(done) {
  gulp
    .src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(
      notify({
        title: 'SUCCESS: CSS concatenated...',
        message: 'CSS file concatenated: "<%= file.relative %>"',
        icon: './src/images/success-icon.png',
        timeout: 3
      })
    )
    .pipe(gulp.dest('dist/css'));
  done();
}

function scriptsDev() {
  return browserify({
    extensions: ['.js'],
    entries: './src/js/main.js'
  })
    .transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
}

function scriptsProd() {
  return browserify({
    extensions: ['.js', '.jsx'],
    entries: './src/js/main.js'
  })
    .transform(babelify, { presets: ['@babel/preset-env'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
}

// Replace HTML block for Js and Css file upon build and copy to /dist
function replaceHtmlBlock(done) {
  gulp
    .src(['./src/*.html'])
    .pipe(
      htmlreplace({
        js: 'js/bundle.min.js',
        css: 'css/main.min.css'
      })
    )
    .pipe(gulp.dest('dist/'));
  done();
}

// compile & concatenate & minify sass, less, css files for production
function bundleCSS(done) {
  gulp
    .src(['src/sass/*.scss', 'src/less/*.less', 'src/css/*.css'])
    .pipe(plumber())
    //compile only if it is sass file
    .pipe(
      gulpIf(
        '*.scss',
        sass({
          errLogToConsole: true,
          outputStyle: 'compressed',
          precision: 10
        })
      )
    )
    .pipe(gulpIf('*.less', less({ compress: true }))) //compile only if it is less file
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .on('error', console.error.bind(console))
    .pipe(concat('main.css'))
    .pipe(
      minifycss({ keepSpecialComments: 0, maxLineLen: 80, uglyComments: true })
    )
    .pipe(
      notify({
        title: 'Build Successfully',
        message:
          'sass & less compiled and bundled in one file: "<%= file.relative %>"',
        icon: './src/images/success-icon.png'
      })
    )
    .pipe(plumber.stop())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(lec({ verbose: false, eolc: 'LF', encoding: 'utf8' }))
    .pipe(gulp.dest('dist/css'));

  done();
}

// clean files
function clean(done) {
  del.sync(['./dist']);
  done();
}

function watch(done) {
  gulp.watch('./src/sass/*.scss', gulp.series(sassDev, reload));
  gulp.watch('./src/less/*.less', gulp.series(lessDev, reload));
  gulp.watch('./src/css/*.css', gulp.series(cssDev, reload));
  gulp.watch('./src/*.html', gulp.series(copyHtml, reload));
  gulp.watch('./src/fonts/**/*.*', gulp.series(fonts, reload));
  gulp.watch('./src/images/**/*.*', gulp.series(copyImage, reload));
  gulp.watch('./src/js/**/*.js', scriptsDev, reload);
  gulp.src('./dist/js/' + 'bundle.js').pipe(
    notify({
      title: 'Gulp is Watching Successfully',
      message: 'File: "<%= file.relative %> is being watched"',
      icon: './src/images/smiling-icon.png',
      timeout: 3
    })
  );
  done();
}

// npm start
gulp.task(
  'dev',
  gulp.parallel(
    copyHtml,
    copyImage,
    fonts,
    scriptsDev,
    sassDev,
    lessDev,
    cssDev,
    server
  )
);

// // npm run build
gulp.task(
  'build',
  gulp.series(
    clean,
    gulp.parallel(
      replaceHtmlBlock,
      imageMin,
      fonts,
      scriptsProd,
      bundleCSS,
      server
    )
  )
);

// gulp.task('watch', gulp.series(clean, gulp.parallel(watch, server)));

// npm run watch
gulp.task('watch', gulp.parallel(watch, server));

// npm run clean
gulp.task('clean', clean);
