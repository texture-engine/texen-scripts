var server = require('./lib/server');

module.exports = function (gulp, plugins) {
    return function (done) {
        var path = './test/output/server-stats.png';
        var mod = require('../node_modules/texen-core/dist/texen-core-stats');
        plugins.util.log(server(path, mod));
        done();
    };
};
