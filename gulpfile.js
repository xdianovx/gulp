const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const fileinclude = require("gulp-file-include");

// const webpack = require("webpack");
// const webpackStream = require("webpack-stream");
// const webpackConfig = require("./webpack.config.js");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
}

function clear() {
  return del("dist");
}

function html() {
  return src(["./app/**/*.html"]).pipe(
    fileinclude({
      prefix: "@@",
      basepath: "@file",
    }))
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream())
  
}

function img() {
  return src("app/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("./dist/img/"));
}

function js() {
  return (
    src(["app/js/main.js"])
      // .pipe(webpackStream(webpackConfig), webpack)
      .pipe(dest("./dist/js"))
      .pipe(browserSync.stream())
  );
}

function styles() {
  return src("app/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(scss({ outputStyle: "compressed" }).on("error", notify.onError()))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function dist() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*",
      "app/js/main.js",
      "app/**/*.html",
      "app/img/**/*",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/main.js"], js);
  watch(["app/**/*.html"], html);
  watch(["app/img/**/*"], img);
}


exports.html = html
exports.styles = styles;
exports.js = js;
exports.browsersync = browsersync;
exports.watching = watching;
exports.img = img;
exports.clear = clear;
exports.dist = dist;

exports.build = series(clear, dist, img);
exports.default = parallel(browsersync, html, styles, img, js, watching);
