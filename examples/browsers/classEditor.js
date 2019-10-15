const Classification = require('../../src/o-language/classifications/Classification')
const ClassificationWithTypeChecking = require('../../src/o-language/classifications/ClassificationWithTypeChecking')
/// Enable dynamic strict type checking
//Classification.behaveAs( ClassificationWithTypeChecking )
const Sirens = require('../../src/Sirens')

const sampleFilename = `${__dirname}/../samples/Address.js`

Sirens.openClassEditor({ filename: undefined })