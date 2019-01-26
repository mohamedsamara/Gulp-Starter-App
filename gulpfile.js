'use strict';

/**************** Gulp.js 4 configuration ****************/

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const minifycss = require('gulp-uglifycss');
const sass = require('gulp-sass');
const less = require('gulp-less');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const lec = require('gulp-line-ending-corrector');
const plumber = require('gulp-plumber');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');

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

// Compile Sass production
function sassProd(done) {
  gulp
    .src('src/sass/*.scss')
    .pipe(plumber())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
        precision: 10
      })
    )
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('sass.css'))
    .on('error', console.error.bind(console))
    .pipe(
      minifycss({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(
      notify({
        title: 'Build Successfully',
        message: 'Sass file compiled: "<%= file.relative %>"',
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

// Compile Less Production
function lessProd(done) {
  gulp
    .src('src/less/*.less')
    .pipe(less({ compress: true }))
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('less.css'))
    .on('error', console.error.bind(console))
    .pipe(
      minifycss({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(
      notify({
        title: 'Build Successfully',
        message: 'Less file compiled: "<%= file.relative %>"',
        icon: './src/images/success-icon.png'
      })
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest('dist/css'));
  done();
}

// CSS Development
function cssDev(done) {
  gulp
    .src('src/css/*.css')
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('styles.css'))
    .pipe(
      notify({
        title: 'SUCCESS: CSS concatenated...',
        message: 'Sass file concatenated: "<%= file.relative %>"',
        icon: './src/images/success-icon.png',
        timeout: 3
      })
    )
    .pipe(gulp.dest('dist/css'));
  done();
}

// CSS production
function cssProd(done) {
  gulp
    .src('src/css/*.css')
    .pipe(postcss([autoprefixer(autoprefixerOptions), cssnano()]))
    .pipe(concat('styles.css'))
    .on('error', console.error.bind(console))
    .pipe(
      minifycss({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(
      notify({
        title: 'Build Successfully',
        message: 'Css file minified: "<%= file.relative %>"',
        icon: './src/images/success-icon.png'
      })
    )
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest('dist/css'));
  done();
}

function scripts(done) {
  ['main.js'].map(function(entry) {
    return browserify({
      entries: ['./src/js/' + entry]
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(entry))
      .pipe(
        rename({
          extname: '.min.js'
        })
      )
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browserSync.stream());
  });
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
  gulp.watch('./src/js/**/*.js', scripts, reload);
  gulp.src('./dist/js/' + 'main.min.js').pipe(
    notify({
      title: 'Gulp is Watching Successfully',
      message: 'File: "<%= file.relative %> compiled"',
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
    scripts,
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
      copyHtml,
      imageMin,
      fonts,
      scripts,
      sassProd,
      cssProd,
      lessProd
    )
  )
);

// npm run watch
gulp.task('watch', gulp.parallel(watch, server));

// npm run clean
gulp.task('clean', clean);
