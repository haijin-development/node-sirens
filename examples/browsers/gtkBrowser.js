const Classification = require('../../src/o-language/classifications/Classification')
const ClassificationWithTypeChecking = require('../../src/o-language/classifications/ClassificationWithTypeChecking')
/// Enable dynamic strict type checking
//Classification.behaveAs( ClassificationWithTypeChecking )
const Sirens = require('../../src/Sirens')

const Gtk = require('node-gtk').require('Gtk', '3.0')

Sirens.browseObject( Gtk )