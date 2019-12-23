const Classification = require('../../src/O').Classification
const ExtendedClassification = require('../../src/O').ExtendedClassification
const MethodCallContraints = require('../../src/O').MethodCallContraints
const Debuggable = require('../../src/O').Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    MethodCallContraints,
])

const Sirens = require('../../src/Sirens')

const Gdk = require('node-gtk').require('Gdk', '3.0')

Sirens.browseObject( Gdk )