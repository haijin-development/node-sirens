const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const Protocol = require('../../../../src/o-language/classifications/Protocol')

class PointProcotol {
    getX() {}
    setX(value) {}

    getY() {}
    setY(value) {}
}

PointProcotol = Protocol.define(PointProcotol)

class Point {
    /// Definition

    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    // Accessing

    getX() {
        return this.x
    }

    setX(value) {
        this.x = value
    }

    getY() {
        return this.y
    }

    setY(value) {
        this.y = value
    }
}

Point = Classification.define(Point)

class Circle {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }
}

Circle = Classification.define(Circle)

describe('A Protocol classification', () => {
    it('is implemented by a concrete classification', () => {
        expect( PointProcotol.isImplementedBy({ classification: Point }) ) .to .be .true
    })

    it('raises an error if it is not implemented by a concrete classification', () => {
        expect( () => {
            PointProcotol.isImplementedBy({ classification: Circle })
        }) .to .throw(Error, 'Circle classification must implement the method PointProcotol.getX to comply with the protocol implementation.')
    })

    it('evaluates a given closure if it is not implemented by a concrete classification', () => {
        expect( PointProcotol.isImplementedBy({
            classification: Circle, ifNot: () => { return 'not' }
        }) ) .to .equal( 'not' )
    })
})