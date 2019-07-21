const Sirens = require('../../src/Sirens')

class Address {
    constructor({streetName: streetName, number: number}) {
        this.streetName = streetName
        this.number = number
    }

    getStreetName() {
        return this.streetName
    }

    getNumber() {
        return this.getNumber()
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

Sirens.browseObject(user)