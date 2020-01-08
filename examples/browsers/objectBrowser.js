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


/*
    This is a regular comment.
*/
class Address {

    /*
        Construct the receiver.
    */
    constructor({ streetName: streetName, number: number } = {}) {
        this.streetName = streetName
        this.number = number
    }

    /*
        Returns the street name.
    */
    getStreetName() {
        return this.streetName
    }

    getNumber() {
        return this.number
    }
}

class User {
    constructor({names: names, lastNames: lastNames, addresses: addresses}) {
        this.names = names
        this.lastNames = lastNames
        this.addresses = addresses
    }
}


const address = new Address({
    streetName: 'Evergreen', number: 742
})

const user = new User({
    names: ['Lisa'],
    lastNames: ['Simpson'],
    addresses: [address]
})


Sirens.useGtkViews()
Sirens.browseObject( user )
