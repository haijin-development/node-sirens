const Sirens = require('../../src/Sirens')
const {Address, User} = require('../samples/AddressAndUser')

const address = new Address({
    streetName: 'Evergreen', number: 742
})

const user = new User({
    names: ['Lisa'],
    lastNames: ['Simpson'],
    addresses: [address]
})

Sirens.do( () => {
    Sirens.browsePrototypes( user )
})