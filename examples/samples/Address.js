const path = require('path')
const fs = require('fs')

function globalFunction_1(param) {
    return param + 1
}

/*
    Class(`
        A regular js class to use in the classEditor example.

        An Address object models a street name and number.
    `)

    Implementation(`
        This class exists only as an example of its documentation. Do not take it as an example of good practices.
    `)

    Example({
        Description: `
            Creates an Address with a given street name and number.
        `,
        Code: `
            const Address = require('../../../examples/samples/Address')

            const address = new Address({ streetName: 'Evergreen', number: 742 })

            address.getStreetName()
            address.getNumber()
        `,
    })

    Example({
        Description: `
            Creates an empty Address.
        `,
        Code: `
            const Address = require('../../../examples/samples/Address')

            const address = new Address()

            address.getStreetName()
            address.getNumber()
        `,
    })
*/
class Address {
    /*
        Param({
            Name: 'streetName',
            Protocols: [ String ],
            Description: `The name of the street. Does not include the street number.`,
        })

        Param({
            Name: 'number',
            Protocols: [ int ],
            Description: `The number of the address in the street.`,
        })

        Example({
            Description: `
                Creates an Address with a given street name and number.
            `,
            Code: `
                const Address = require('../../../examples/samples/Address')

                new Address({ streetName: 'Evergreen', number: 742 })
            `,
        })

        Example({
            Description: `
                Creates an empty Address.
            `,
            Code: `
                const Address = require('../../../examples/samples/Address')

                new Address()
            `,
        })

        Tags([
            `constructor`,
        ])
    */
    constructor({ streetName: streetName, number: number } = {}) {
        this.streetName = streetName
        this.number = number
    }


    /*
        Method(`
            Returns the street name of this address.
        `)

        Returns({
            Protocols: [ String ],
            Description: `The name of the street. Does not include the street number.`,
        })

        Implementation(`
            Returns this.streetName.
        `)

        Example({
            Description: `
                Create an Address and get its street name.
            `,
            Code: `
                const Address = require('../../../examples/samples/Address')

                const address = new Address({ streetName: 'Evergreen', number: 742 })

                address.getStreetName()
            `,
        })

        Tags([
            'accessors',
            'getters',
        ])
    */
    getStreetName() {
        return this.streetName
    }


    /*
        Method(`
            Returns the number of this address.
        `)

        Returns({
            Protocols: [ String ],
            Description: `Returns the number of this address.`,
        })

        Implementation(`
            Returns this.number.
        `)

        Example({
            Description: `
                Create an Address and get its number.
            `,
            Code: `
                const Address = require('../../../examples/samples/Address')

                const address = new Address({ streetName: 'Evergreen', number: 742 })

                address.getNumber()
            `,
        })

        Tags([
            'accessors',
            'setters',
        ])
    */
    getNumber() {
        return this.number
    }
}

function globalFunction_2(param) {
    return param + 1
}


class User {
    constructor({names: names, lastNames: lastNames, addresses: addresses}) {
        this.names = names
        this.lastNames = lastNames
        this.addresses = addresses
    }
}

function globalFunction_3(param) {
    return param + 1
}


module.exports = Address