const JSFileStructureParser = require('./JsFileParser/JSFileStructureParser')

const JsFileParser = {
    parser: {
        fileType: '.js',
        parser: JSFileStructureParser,
    },
}

module.exports = JsFileParser