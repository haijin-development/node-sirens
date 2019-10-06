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

