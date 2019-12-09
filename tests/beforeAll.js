const O = require('../src/O')

const Classification = O.Classification
const ExtendedClassification = O.ExtendedClassification
const ParamsChecker = O.ParamsChecker
const Debuggable = O.Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    ParamsChecker,
])

require('./specs/o-language/o-language-expectations.js')
require('./specs/finger-tips/finger-tips-expectations.js')