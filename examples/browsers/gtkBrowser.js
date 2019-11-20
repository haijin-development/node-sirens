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

const Gtk = require('node-gtk').require('Gtk', '3.0')

Sirens.browseObject( Gtk )