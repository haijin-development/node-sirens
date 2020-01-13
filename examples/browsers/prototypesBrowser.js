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

class User {
    constructor({names: names, lastNames: lastNames, addresses: addresses}) {
        this.names = names
        this.lastNames = lastNames
        this.addresses = addresses
    }
}

const user = new User({
    names: ['Lisa'],
    lastNames: ['Simpson'],
    addresses: []
})

Sirens.useGtkViews()
Sirens.browsePrototypes( user )