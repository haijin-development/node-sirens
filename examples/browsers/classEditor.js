const Classification = require('../../src/o-language/classifications/Classification')
const ExtendedClassification = require('../../src/o-language/classifications/ExtendedClassification')
const ParamsChecker = require('../../src/o-language/classifications/ParamsChecker')
const Debuggable = require('../../src/o-language/classifications/Debuggable')

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    ParamsChecker,
])

const Sirens = require('../../src/Sirens')

const sampleFilename = `${__dirname}/../samples/Address.js`

Sirens.openClassEditor({ filename: undefined })