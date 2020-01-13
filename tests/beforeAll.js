const O = require('../src/O')

const Classification = O.Classification
const ExtendedClassification = O.ExtendedClassification
const MethodCallConstraints = O.MethodCallConstraints
const Debuggable = O.Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    MethodCallConstraints,
])

require('./o-language-expectations.js')
require('./finger-tips-expectations.js')