const gulp = require('gulp')
const ts = require('gulp-typescript')
const notifier = require("node-notifier")
const debug = require('gulp-debug')
const del = require('del')

const browserify = require('browserify');
const source = require('vinyl-source-stream');


const tsProject = ts.createProject('tsconfig_background.json')


gulp.task('compile:ts', function () {
  return tsProject.src()
      .pipe(tsProject())
      .js
      .on('error', (error) => {
        notifier.notify({title: "Gulp", message: "Error when compiling TypeScript"});
        console.log(error)
      })
      .pipe(gulp.dest('./lib'));
});


gulp.task('bundle:backgroundScript', function() {
  return browserify('./lib/background/background_script.js')
        .bundle()
        .pipe(source('background_script_bundle.js'))
        .pipe(gulp.dest('./lib/build/'));
});

gulp.task('bundle:yandexContentScript', function() {
  return browserify('./lib/content_scripts/yandex_music_content_script.js')
        .bundle()
        .pipe(source('yandex_music_content_script_bundle.js'))
        .pipe(gulp.dest('./lib/build/'));
});

gulp.task('bundle:toolbarButtonScript', function() {
  return browserify('./lib/action_button/toolbar_button.js')
        .bundle()
        .pipe(source('toolbar_button_bundle.js'))
        .pipe(gulp.dest('./lib/build/'));
});




gulp.task("build:backgroundScript", gulp.series('compile:ts', 'bundle:backgroundScript'))

gulp.task("bundle", gulp.series('bundle:backgroundScript', 'bundle:yandexContentScript', 'bundle:toolbarButtonScript'))

gulp.task("build", gulp.series("compile:ts", "bundle"))

//gulp.task('build', gulp.series('compileTypeScript'))

gulp.task('clean', async function() {
  return del('lib')
})

gulp.task('watch', async function() {
  gulp.watch('src/**/*.ts', gulp.series('compile:ts'))
})
