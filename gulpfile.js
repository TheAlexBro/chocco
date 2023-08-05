const {src, dest, task, series, watch, parallel} = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const sassGlob = require('gulp-sass-glob');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const pxToRem = require('gulp-px2rem-converter')
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const env = process.env.NODE_ENV;

const {SRC_PATH, DEST_PATH, STYLE_LIBS, JS_LIBS} = require('./gulp.config');

task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
  .pipe(dest(DEST_PATH))
  .pipe(reload({ stream: true }));
});

task('copy:img', () => {
  return src(['src/img/**/*.*', '!src/img/icons/*.svg'])
  .pipe(imagemin())
  .pipe(dest('dist/img'))
  .pipe(reload({ stream: true }));
});

task('copy:video', ()=> {
  return src(`${SRC_PATH}/video/**/*`)
  .pipe(dest(`${DEST_PATH}/video`))
});

task( 'clean', () => {
  console.log(env);
  return src( `${DEST_PATH}/**/*`, { read: false })
    .pipe( rm() )
});

const stylesPlugin = [
  'node_modules/normalize.css/normalize.css',
  'node_modules/bxslider/dist/jquery.bxslider.min.css',
  'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css',
  'node_modules/video.js/dist/video-js.min.css'
];

task('styles:plugin', () => {
  return src(stylesPlugin)
    .pipe(concat('plugin.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('dist'))
});

task('styles', () => {
 return src('src/styles/main.scss')
   .pipe(gulpif(env === 'dev', sourcemaps.init()))
   .pipe(concat('main.min.scss'))
   .pipe(sassGlob())
   .pipe(sass().on('error', sass.logError))
   .pipe(pxToRem())
   .pipe(gulpif(env === 'prod', autoprefixer({
       browsers: ['last 2 versions'],
       cascade: false
    })))
   .pipe(gulpif(env === 'prod', gcmq()))
   .pipe(gulpif(env === 'prod', cleanCSS()))
   .pipe(gulpif(env === 'dev', sourcemaps.write()))
   .pipe(dest(DEST_PATH))
   .pipe(reload({ stream: true }));
});

const scripts = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bxslider/dist/jquery.bxslider.min.js',
  'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
  'node_modules/video.js/dist/video.min.js',
  'node_modules/video.js/dist/lang/ru.js',
  'node_modules/jquery-touchswipe/jquery.touchSwipe.min.js',
  'node_modules/mobile-detect/mobile-detect.min.js',
  'src/scripts/*.js'
]; 

task( 'scripts', () => {
  return src(scripts) 
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.js'))
    .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({ stream: true }));
});

task('icons', () => {
  return src(['src/img/icons/*.svg'])
    // .pipe(svgo({
    //   plugins: [
    //     {
    //       removeAttrs: {
    //         attrs: '(fill|stroke|style|width|height|data.*)'
    //       }
    //     }
    //   ]
    // }))
    // .pipe(svgSprite({
    //   mode: {
    //     symbol: {
    //       sprite: '../sprite.svg'
    //     }
    //   }
    // }))
    .pipe(dest('dist/img/icons'));
});

task('server', () => {
  browserSync.init({
      server: {
          baseDir: DEST_PATH
      },
      open: false
  });
});

task('watch', () => {
  watch('./src/styles/**/*.scss', series('styles'));
  watch('./src/*.html', series('copy:html'));
  watch('./src/scripts/*.js', series('scripts'));
  watch('./src/img/icons/*.svg', series('icons'));
  watch('./src/img/**/*', series('copy:img'));
 });

task("default", 
  series(
    'clean', 
    parallel('styles:plugin', 'copy:html', 'copy:img', 'copy:video', 'styles', 'scripts', 'icons'),
    parallel('watch', 'server')
  )
);

task('build',
 series(
   'clean',
   parallel('styles:plugin', 'copy:html', 'copy:img', 'copy:video', 'styles', 'scripts', 'icons'))
);