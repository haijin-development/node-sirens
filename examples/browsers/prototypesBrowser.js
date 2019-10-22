const Classification = require('../../src/o-language/classifications/Classification')
const ExtendedClassification = require('../../src/o-language/classifications/ExtendedClassification')
const ParamsChecker = require('../../src/o-language/classifications/ParamsChecker')
const Debuggable = require('../../src/o-language/classifications/Debuggable')

Classification.behaveAs( ExtendedClassification )

Classification.setExtendedBehaviours([
    Debuggable,
    ParamsChecker,
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