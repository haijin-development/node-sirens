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