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

Sirens.do( () => {
    Sirens.browsePrototypes( user )
})