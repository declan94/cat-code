var gulp = require('gulp');
var concat = require('gulp-concat');
var minimist = require('minimist');
var rimraf = require('rimraf');
var wrap = require("gulp-wrap");
var insert = require('gulp-insert');
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
      .pipe(insert.transform(function(contents, file) {
        var parts = file.path.split('/');
        var comment_prefix = '// ';
        var comment_suffix = '';
        if (ext == 'html') {
          comment_prefix = '<!-- ';
          comment_suffix = ' -->';
        } else if (ext == 'sh' || ext == 'py') {
          comment_prefix = '# ';
        }
        var comment = comment_prefix + "Filename: " + parts[parts.length-1] + comment_suffix + '\n';
        return comment + contents + "\n\n";
      }))
      .pipe(concat("concat." + ext))
      .pipe(gulp.dest(output));
    gulp.src([options.folder + "/**/bower_components/**/*." + ext])
      .pipe(concat("concat." + ext))
      .pipe(gulp.dest(output + "/bower"));
  }
  return taskFunc;
}

var exts = ['py', 'java', 'scala', 'html', 'js', 'css', 'less', 'sh', 'jade'];

for (var i = 0; i < exts.length; i++) {
  var ext = exts[i];
  gulp.task(ext, gulpConcatExt(ext));
}

gulp.task('all', exts);

gulp.task('default', function() {
  runSequence(['clean', 'all']);
});