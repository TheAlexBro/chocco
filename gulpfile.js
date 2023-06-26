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
const env = process.env.NODE_ENV;

const {SRC_PATH, DEST_PATH, STYLE_LIBS, JS_LIBS} = require('./gulp.config')


const styles = [
  'node_modules/normalize.css/normalize.css',
  'src/styles/main.scss'
];


task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
  .pipe(dest(DEST_PATH))
  .pipe(reload({ stream: true }));
});

task('copy:img', () => {
  return src(`${SRC_PATH}/images/**/*`)
  .pipe(dest(`${DEST_PATH}/images`))
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

task('styles', () => {
 return src([...STYLE_LIBS, 'src/styles/main.scss'])
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
  // 'node_modules/jquery/dist/jquery.min.js',
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
  return src('src/images/icons/*.svg')
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/images/icons'));
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
  watch('./src/images/icons/*.svg', series('icons'));
  watch('./src/images/**/*', series('copy:img'));
 });

task("default", 
  series(
    'clean', 
    parallel('copy:html', 'copy:img', 'copy:video', 'styles', 'scripts', 'icons'),
    parallel('watch', 'server')
  )
);

task('build',
 series(
   'clean',
   parallel('copy:html', 'copy:img', 'copy:video', 'styles', 'scripts', 'icons'))
);