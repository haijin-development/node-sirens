const Sirens = require('../../src/Sirens')

object = {
    names: ['Lisa'],
    lastNames: ['Simpson'],
    addresses: [
        {
            streetName: 'Evergreen',
            number: 742
        }
    ],

    getStreetName: () => {
        return this.streetName
    },
}

class Address {
    constructor() {
        this.streetName = 'Evergreen'
        this.number = 742
    }

    getStreetName() {
        return this.streetName
    }

    getNumber() {
        return this.getNumber()
    }
}

class User {
    constructor() {
        this.names = ['Lisa']
        this.lastNames = ['Simpson']
        this.addresses = [
            new Address()
        ]
    }
}

Sirens.do( () => {
    Sirens.browse({object: object})
})