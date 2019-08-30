const Sirens = require('../../src/Sirens')

class Object {
}

class Address extends Object {
    constructor() {
        super()

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

class User extends Object {
    constructor() {
        super()

        this.names = ['Lisa']
        this.lastNames = ['Simpson']
        this.addresses = [
            new Address()
        ]
    }
}

Sirens.do( () => {
    Sirens.browsePrototypes(new User())
})