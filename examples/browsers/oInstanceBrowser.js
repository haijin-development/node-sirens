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

class Address {

    static definition() {
        this.instanceVariables = ['streetName', 'number']
    }

    initialize({ streetName: streetName, number: number }) {
        this.streetName = streetName
        this.number = number
    }

    getStreetName() {
        return this.streetName
    }

    getNumber() {
        return this.number
    }
}

Address = Classification.define(Address)

class GeoLocated {

    static definition() {
        this.instanceVariables = ['lat', 'long']
    }

    setLat({ lat: lat }) {
        this.lat = lat
    }

    setLong({ long: long }) {
        this.long = long
    }
}

GeoLocated = Classification.define(GeoLocated)


const address = Address.new({
    streetName: 'Evergreen', number: 742
})

address.behaveAs( GeoLocated )

address.setLat({ lat: 1.1 })
address.setLong({ long: 1.2 })

Sirens.browseObject( address )