const Classification = require('../../src/o-language/classifications/Classification')
const ClassificationWithTypeChecking = require('../../src/o-language/classifications/ClassificationWithTypeChecking')
/// Enable dynamic strict type checking
//Classification.behaveAs( ClassificationWithTypeChecking )
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

function topMost() {
    const address = new Address({
        streetName: 'Evergreen', number: 742
    })

    const user = new User({
        names: ['Lisa'],
        lastNames: ['Simpson'],
        addresses: [address]
    })

    const top = {
        value: user
    }

    middle(top)
}

function middle(top) {
    const middle = {
        value: 2
    }

    bottomMost(top, middle)
}

function bottomMost(top, middle) {
    const bottom = {
        value: 3
    }

    Sirens.browseStack(arguments)
}

topMost()