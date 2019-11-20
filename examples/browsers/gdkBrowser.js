const Classification = require('../../src/O').Classification
const ExtendedClassification = require('../../src/O').ExtendedClassification
const ParamsChecker = require('../../src/O').ParamsChecker
const Debuggable = require('../../src/O').Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    ParamsChecker,
])

const Sirens = require('../../src/Sirens')

const Gdk = require('node-gtk').require('Gdk', '3.0')

Sirens.browseObject( Gdk )