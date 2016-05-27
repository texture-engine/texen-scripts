var merge = require('merge2');

module.exports = function (gulp, plugins) {
    return function () {
        var result = gulp.src('src/*.ts')
            .pipe(plugins.typescript({
                module: 'commonjs',
                target: 'ES5',
                noImplicitAny: true,
                declarationFiles: true,
                out: 'texen-scripts.js'
            }));

        return merge([
            result.js.pipe(gulp.dest('build')),
            result.dts.pipe(gulp.dest('.'))
        ]);
    };
};
