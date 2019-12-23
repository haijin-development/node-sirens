const O = require('../src/O')
const Preferences = require('../src/sirens/Preferences')

const Classification = O.Classification
const ExtendedClassification = O.ExtendedClassification
const MethodCallConstraints = O.MethodCallConstraints
const Debuggable = O.Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    MethodCallConstraints,
])

require('./specs/o-language/o-language-expectations.js')
require('./specs/finger-tips/finger-tips-expectations.js')

Preferences.cssFile = null