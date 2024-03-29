var _           = require('lodash');
var gulp        = require('gulp');
var deploy      = require('gulp-gh-pages');
var ejs         = require("gulp-ejs");
var gutil       = require('gulp-util');
var livereload  = require('gulp-livereload');
var express     = require('express');

var config      = require('./config.json');
var en          = require('./src/assets/languages/en.json');
var ru          = require('./src/assets/languages/ru.json');

require('shelljs/global');

var data_en = {config:  _.cloneDeep(config.data)};
_.merge(data_en.config, en);

var data_ru = {config: _.cloneDeep(config.data)};
_.merge(data_ru.config, ru);


/**
 *  Templates
 */

var templates = function(src, dst, data){
    gulp.src([src])
        .pipe(ejs(data)).on('error', gutil.log)
        .pipe(gulp.dest(dst));
}

gulp.task('templates', function(){
    templates(config.templates, config.buildpath, data_en);
    templates(config.templates, config.buildpath_ru, data_ru);
});


/**
 *  HTML
 */

var html = function(src, dst, data){
    gulp.src([src + '/*.html', src + '/CNAME'])
        .pipe(gulp.dest(dst));
}

gulp.task('html', function(){
    html(config.src, config.buildpath, data_en);
    html(config.src, config.buildpath_ru, data_ru);
});

/**
 *  Assets
 */

var assets = function(assets, dst, data){
    gulp.src([assets])
        .pipe(gulp.dest(dst + '/assets'));
}

gulp.task('assets', function(){
    assets(config.assets, config.buildpath, data_en);
    assets(config.assets, config.buildpath_ru, data_ru);
});

/**
 *  Build
 */
gulp.task('build', ['templates', 'html', 'assets'], function(data) {
});

/**
 *  Server
 */
gulp.task('server', function(next) {
    server = express();
    server.use(express.static(config.buildpath)).listen(process.env.PORT || 9000, next);
});

/**
 *  Watch
 */
gulp.task('watch', ['server'], function() {
    var server = livereload();

    // watch source
    gulp.watch(config.src + '/**', ['build']);

    // watch destination
    gulp.watch(config.buildpath + '/**').on('change', function(file) {
        server.changed(file.path);
    });
});

/**
 *  Default
 */
gulp.task('default', ['build', 'watch'], function() {
});

/**
 *  Push build to gh-pages
 */
gulp.task('deploy', function () {
    return gulp.src(config.buildpath + '/**/*')
        .pipe(deploy())
});