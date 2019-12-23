const O = require('../src/O')

const Classification = O.Classification
const ExtendedClassification = O.ExtendedClassification
const MethodCallContraints = O.MethodCallContraints
const Debuggable = O.Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    MethodCallContraints,
])

require('./specs/o-language/o-language-expectations.js')
require('./specs/finger-tips/finger-tips-expectations.js')
