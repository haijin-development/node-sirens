const Classification = require('../../src/o-language/classifications/Classification')
const ClassificationWithTypeChecking = require('../../src/o-language/classifications/ClassificationWithTypeChecking')
/// Enable dynamic strict type checking
//Classification.behaveAs( ClassificationWithTypeChecking )
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