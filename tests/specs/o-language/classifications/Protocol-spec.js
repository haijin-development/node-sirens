const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Protocol = require('../../../../src/O').Protocol

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


    describe('when declared in the implementations array of a Classification', () => {

        class Point {
            /// Definition

            static definition() {
                this.instanceVariables = ['x', 'y']
                this.implements = [PointProcotol]
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

        class Circle {
            /// Definition

            static definition() {
                this.instanceVariables = []
                this.implements = [PointProcotol]
            }
        }

        it('does not raise an error if the classification implements the protocol', () => {
            expect( () => {
                Classification.define(Point)
            }) .not .to .throw( Error )
        })

        it('raises an error if the classification does not implement the protocol', () => {
            expect( () => {
                Classification.define(Circle)
            }) .to .throw(Error, 'Circle classification must implement the method PointProcotol.getX to comply with the protocol implementation.')
        })

    })

})