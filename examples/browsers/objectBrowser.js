const Classification = require('../../src/o-language/classifications/Classification')
const ClassificationWithTypeChecking = require('../../src/o-language/classifications/ClassificationWithTypeChecking')
/// Enable dynamic strict type checking
//Classification.behaveAs( ClassificationWithTypeChecking )
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


Sirens.browseObject( user )