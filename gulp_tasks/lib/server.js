var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var PNG = require('pngjs').PNG;

module.exports = function (file, mod) {
    var TexEn = require('../../dist/texen-scripts');
    var formula = require('../../node_modules/texen-samples').data[0];
    var wrap = new TexEn.Wrap(mod);
    var options = new TexEn.Options();
    options.width = 512;
    options.height = 512;
    wrap.run(JSON.stringify(formula), options);
    var png = new PNG({
        width: options.width,
        height: options.height,
        filterType: -1
    });
    TexEn.Canvas.draw(png.data, wrap);
    mkdirp.sync(path.dirname(file));
    png.pack().pipe(fs.createWriteStream(file));

    return wrap.log();
};
