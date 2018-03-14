var autoprefixer = require('gulp-autoprefixer');
var bower = require('gulp-bower');
var filter = require('gulp-filter');
var fs = require('fs');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var header = require('gulp-header');
var htmlmin = require('gulp-htmlmin');
var htmlhint = require('gulp-htmlhint');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var jade = require('gulp-jade');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var path = require('path');
var pkg = require('./package.json');
var pxtorem = require('gulp-pxtorem');
var rename = require('gulp-rename');
var run = require('run-sequence');
var sass = require('gulp-sass');
var using = require('gulp-using');
var util = require('gulp-util');
var rimraf = require('gulp-rimraf');
var replace = require('gulp-replace');

var cfg = {
    baseDir: path.dirname(process.cwd()),
    sourceDir: './src',
    targetDir: './build',
    distDir: './dist',
    fontName: 'cui-font',
    isVerbose: true,
    banner: [
        '/*! ',
        ' * ' + pkg.name + ' - ' + pkg.description,
        ' * @version ' + pkg.version,
        ' * @home ' + pkg.homepage,
        ' * @license ' + pkg.license,
        ' */',
        ' '].join('\n')
    };


    /*
    * Pre-Build Task
    */
    gulp.task('pre', ['clean'], function() {
        run(['pkg:views', 'pkg:docs']);
    });


    /*
    * Build Task
    */
    gulp.task('default', function() {
        run(['compile:fonts', 'pkg:images', 'pkg:bower', 'pkg:changelog', 'pkg:broadcast'], 'replace:version', 'pkg:examples');
    });


    /*
    * Distribution Task
    * Copies the built files into the dist/ folder
    */
    gulp.task('dist', ['clean:dist'], function() {
        run(['pkg:copydist']);
    });

    /*
    * Task: clean
    * Removes the build folder
    */
    gulp.task('clean', function() {
        return gulp.src(cfg.targetDir)
        .pipe(rimraf({ read: false, force: true }));
    });

    /*
    * Task: clean:dist
    * Removes the dist folder
    */
    gulp.task('clean:dist', function() {
        return gulp.src(cfg.distDir)
        .pipe(rimraf({ read: false, force: true }));
    });

    /*
    * Task: replace:version
    */
    gulp.task('replace:version', function() {
        return gulp.src(cfg.targetDir + '/docs/**/*.html')
            .pipe(replace("{{VERSION}}", pkg.version))
            .pipe(gulp.dest(cfg.targetDir + '/docs/'));
    });

    /*
    * Task: iconfont
    */
    gulp.task('iconfont', function() {
        return gulp.src(cfg.sourceDir + '/icons/*.svg')
            .pipe(gulpIf(cfg.isVerbose, using()))
            .pipe(iconfontCss({
                fontName: cfg.fontName,
                path: 'src/icons/template/_icons.scss',
                targetPath: '../../../../src/scss/base/_' + cfg.fontName + '.scss',
                fontPath: cfg.sourceDir + '/fonts/'
            }))
            .pipe(iconfont({
                fontName: cfg.fontName,
                formats: ['ttf','eot','woff','woff2','svg'],
                normalize: true
            }))
            .pipe(gulp.dest(cfg.targetDir + '/docs/assets/fonts/'));
    });

    /*
    * Task: compile:fonts
    */
    gulp.task('compile:fonts', function() {
        return gulp.src([cfg.sourceDir + '/fonts/**/*'])
        .pipe(gulp.dest(cfg.targetDir + '/fonts/'))
        .pipe(gulp.dest(cfg.targetDir + '/docs/assets/fonts/'));
    });

    /*
    * Task: compile:sass
    */
    gulp.task('compile:sass', function() {
        return gulp.src(cfg.sourceDir + '/scss/**/*.scss')
        .pipe(sass({ cache: false }))
        .pipe(pxtorem({ rootValue: 10 }))
        .pipe(autoprefixer())
        .pipe(header(cfg.banner))
        .pipe(gulp.dest(cfg.targetDir + '/css'))
        .pipe(gulp.dest(cfg.targetDir + '/docs/assets/css'))
        .pipe(minifycss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(cfg.targetDir + '/css'))
        .pipe(gulp.dest(cfg.targetDir + '/docs/assets/css'));
    });


    /*
    * Task: pkg:bower
    */
    gulp.task('pkg:bower', function() {
        if (fs.existsSync(cfg.baseDir + '/bower.json')) {
            return bower({
                directory: cfg.targetDir + '/js/bower_components',
                cwd: cfg.baseDir
            });
        }
    });

    /*
    * Task: pkg:images
    */
    gulp.task('pkg:images', function() {
        gulp.src([
            cfg.sourceDir + '/img/**/*.gif',
            cfg.sourceDir + '/img/**/*.jpg',
            cfg.sourceDir + '/img/**/*.png',
            cfg.sourceDir + '/img/**/*.svg'
        ])
        .pipe(gulpIf(cfg.isVerbose, using()))
        .pipe(gulp.dest(cfg.targetDir + '/img'))
        .pipe(gulp.dest(cfg.targetDir + '/docs/assets/img'));
    });

    /*
    * Task: pkg:docs
    */
    gulp.task('pkg:docs', function(done) {
        run('iconfont', 'compile:fonts', 'compile:sass', done);
    });

    /*
    * Task: pkg:views
    */
    gulp.task('pkg:views', function() {
        var filterCmd, htmlFilter, jadeFilter;
        htmlFilter = filter('**/*.html', {
            restore: true
        });
        filterCmd = ['**/*.jade'];
        if (cfg.skipJadeFiles) {
            filterCmd = filterCmd.concat(_.map(cfg.skipJadeFiles, function(item) {
                return '!' + item;
            }));
        }
        jadeFilter = filter(filterCmd, {
            restore: true
        });
        return gulp.src([cfg.sourceDir + '/**/*.html'])
        .pipe(gulpIf(cfg.isVerbose, using()))
        .pipe(htmlFilter)
        .pipe(htmlhint.reporter())
        .pipe(minifyhtml())
        .pipe(htmlFilter.restore)
        .pipe(jadeFilter)
        .pipe(jadeFilter.restore)
        .pipe(gulp.dest(cfg.targetDir));
    });

    /*
    * Task: pkg:examples
    */
    gulp.task('pkg:examples', function() {
        gulp.src(cfg.targetDir + '/docs/public/examples/*.html')
        .pipe(gulp.dest(cfg.targetDir + '/docs/assets'));
    });

    /*
    * Task: pkg:changelog
    */
    gulp.task('pkg:changelog', function() {
        gulp.src('./changelog.md')
        .pipe(gulp.dest(cfg.targetDir + '/docs'));
    });

    /*
    * Task: pkg:broadcast
    */
    gulp.task('pkg:broadcast', function() {
        gulp.src('./broadcast.json')
        .pipe(gulp.dest(cfg.targetDir + '/docs'));
    });

    /*
    * Task: pkg:copydist
    */
    gulp.task('pkg:copydist', function() {
        gulp.src(cfg.targetDir + '/docs/assets/css/*.css')
        .pipe(gulp.dest(cfg.distDir + '/css'));

        gulp.src(cfg.targetDir + '/docs/assets/fonts/**/*')
        .pipe(gulp.dest(cfg.distDir + '/fonts'));

        gulp.src(cfg.targetDir + '/docs/assets/img/**/*')
        .pipe(gulp.dest(cfg.distDir + '/img'));
    });
