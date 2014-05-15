'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var minifyCSS = require('gulp-minify-css');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var size = require('gulp-size');

var extended = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

var succint = ' <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %> licensed. <%= pkg.homepage %>';
var succjs = '//' + succint + '\n';
var succss = '/*' + succint + ' */\n';

gulp.task('clean', function () {
  gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('build-css', ['bump'], function () {
  var pkg = require('./package.json');

  return gulp.src('./src/flexarea.styl')
    .pipe(stylus())
    .pipe(header(extended, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'))
    .pipe(rename('flexarea.min.css'))
    .pipe(minifyCSS())
    .pipe(header(succss, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build-css'], function () {
  var pkg = require('./package.json');

  return browserify('./src/flexarea.js')
    .bundle({ debug: true, standalone: 'flexarea' })
    .pipe(source('flexarea.js'))
    .pipe(streamify(header(extended, { pkg : pkg } )))
    .pipe(gulp.dest('./dist'))
    .pipe(streamify(rename('flexarea.min.js')))
    .pipe(streamify(uglify()))
    .pipe(streamify(header(succjs, { pkg : pkg } )))
    .pipe(streamify(size()))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bump', function () {
  var bumpType = process.env.BUMP || 'patch'; // major.minor.patch

  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('tag', ['build'], function (cb) {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  gulp.src('./')
    .pipe(git.commit(message))
    .pipe(gulp.dest('./'))
    .on('end', tag);

  function tag () {
    git.tag(v, message);
    git.push('origin', 'master', '--tags').end();
    cb();
  }
});

gulp.task('npm', ['tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('release', ['npm']);
