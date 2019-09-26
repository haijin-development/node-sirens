const path = require('path')
const fs = require('fs')

function globalFunction_1(param) {
    return param + 1
}

/*
    class({
        description: `
            A regular js class to use in the classEditor example. 
        `
    })
*/
class Address {
    /*
        param({
            name: 'streetName',
            protocols: [ String ]
            description: `The name of the street. Does not include the street number.`,
        })

        param({
            name: 'number',
            protocols: [ int ]
            description: `The number of the address in the street.`,
        })

        tags([
            `constructor`
        ])
    */
    constructor({ streetName: streetName, number: number }) {
        this.streetName = streetName
        this.number = number
    }

    /*
        method(`
            Returns the street name of this address.
        `)

        returns({
            protocols: [ String ]
            description: `The name of the street. Does not include the street number.`,
        })

        implementation(`
            Returns this.streetName.
        `)

        example({
            description: `
                Create an Address and get its street name.
            `,
            code: `
                const address = new Address({ streetName: streetName, number: number })

                address.getStreetName()
            `,
        })

        tags([
            'accessors'
            'getters',
        ])
    */
    getStreetName() {
        return this.streetName
    }

    /*
        method(`
            Returns the number of this address.
        `)

        returns({
            protocols: [ String ]
            description: `Returns the number of this address.`,
        })

        implementation(`
            Returns this.number.
        `)

        example({
            description: `
                Create an Address and get its number.
            `,
            code: `
                const address = new Address({ streetName: streetName, number: number })

                address.getNumber()
            `,
        })

        tags([
            'accessors',
            'setters',
        ])
    */
    getNumber() {
        return this.getNumber()
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


module.exports = { Address, User }