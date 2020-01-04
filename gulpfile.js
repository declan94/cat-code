var gulp = require('gulp');
var concat = require('gulp-concat');
var minimist = require('minimist');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');

var knownOptions = {
  string: ["folder", "output"]
};

var options = minimist(process.argv.slice(1), knownOptions);
var output = options.output;
if (!output) {
  output = "./output"
}

gulp.task('clean', function(cb) {
  rimraf(output, cb);
});

var gulpConcatExt = function(ext) {
  var taskFunc = function() {
    gulp.src([options.folder + "/**/*." + ext,
        "!" + options.folder + "/**/bower_components/**/*",
        "!" + options.folder + "/**/node_modules/**/*",
        "!" + options.folder + "/**/dist/**/*",
        "!" + options.folder + "/**/lib/**/*",
        "!" + options.folder + "/**/webapp/**/*"
      ])
      .pipe(concat("concat." + ext))
      .pipe(gulp.dest(output));
    gulp.src([options.folder + "/**/bower_components/**/*." + ext])
      .pipe(concat("concat." + ext))
      .pipe(gulp.dest(output + "/bower"));
  }
  return taskFunc;
}

var exts = ['js', 'java', 'html', 'css', 'less', 'py', 'sh', 'jade'];

for (var i = 0; i < exts.length; i++) {
  var ext = exts[i];
  gulp.task(ext, gulpConcatExt(ext));
}

gulp.task('all', exts);

gulp.task('default', function() {
  runSequence(['clean', 'all']);
});