const Classification = require('../../src/O').Classification
const ExtendedClassification = require('../../src/O').ExtendedClassification
const MethodCallConstraints = require('../../src/O').MethodCallConstraints
const Debuggable = require('../../src/O').Debuggable

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    MethodCallConstraints,
])

const Sirens = require('../../src/Sirens')

const Gdk = require('node-gtk').require('Gdk', '3.0')

Sirens.useGtkViews()
Sirens.browseObject( Gdk )