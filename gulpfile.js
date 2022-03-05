const { src, dest, watch, series, parallel } = require('gulp')

const gulpSourcemaps = require('gulp-sourcemaps')
const gulpSass = require('gulp-sass')(require('sass'))
const gulpPostcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const gulpConcat = require('gulp-concat')
const gulpUglify = require('gulp-uglify')
const gulpReplace = require('gulp-replace')

const browserSync = require('browser-sync').create()

const files = {
  jsPath: 'src/**/*.js',
  sassPath: 'src/scss/**/*.scss',
  htmlPath: 'src/*.html',
  cssPath: 'src/css'
}

function sassTask() {
  return src(files.sassPath)
    .pipe(src('src/**/*.scss'))
    .pipe(gulpSass())
    .pipe(dest('src/css')
  );
}



function jsTask() {
  return src([files.jsPath])
    .pipe(gulpConcat('all.js'))
    .pipe(gulpUglify())
    .pipe(dest('dist')
  );
}

function browsersyncServe(cb){
  browserSync.init({
    server: {
      baseDir: 'src'
    }    
  });
  cb();
}

  function browsersyncReload(cb){
  browserSync.reload();
  cb();
}

const cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(gulpReplace(/cb=\d+/, 'cb=' + cbString))
        .pipe(dest('.'));
}

function watchTask(){
  watch(files.htmlPath, browsersyncReload);
    watch(
        [files.sassPath, files.jsPath],
        series(sassTask, jsTask, browsersyncReload)
    )
}

exports.default = series(
  sassTask,
  jsTask,
  browsersyncServe,
  watchTask
)
