const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance
const Protocol = require('../../../../src/O').Protocol
const Errors = require('../../../../src/O').Errors

let extendedBehaviours
let pointDefinition
let Point

describe('The Classification classification', () => {
    before( () => {
        extendedBehaviours = Classification.getExtendedBehaviours()

        Classification.setExtendedBehaviours([])

        pointDefinition = class Point {
            static definition() {
                this.instanceVariables = ['x', 'y']
            }

            initialize({ x: x, y: y } = { x: undefined, y: undefined }) {
                this.x = x
                this.y = y
            }

            getX() {
                return this.x
            }

            getY() {
                return this.y
            }
        }

        Point = Classification.define(pointDefinition)
    })

    after( () => {
        Classification.setExtendedBehaviours( extendedBehaviours )
    })

    it('defines a new classification', () => {
        expect( Point.isBehavingAs(Classification) ) .to .be .true
    })

    it('creates an OInstnce object', () => {
        const object = Point.createObject()

        expect( object.isBehavingAs(OInstance) ) .to .be .true
        expect( object.classifications() ) .count .to .eql(1)
    })

    it('creates a classification object', () => {
        const object = Point.new()

        expect( object.isBehavingAs(OInstance) ) .to .be .true
        expect( object.isBehavingAs(Point) ) .to .be .true

        expect( object.classifications() ) .count .to .eql(2)
    })

    it('creates a classification object and calls its initialize methods with its parameters', () => {
        const object = Point.new({ x: 1, y: 2 })

        expect( object.getX() ) .to .eql(1)
        expect( object.getY() ) .to .eql(2)
    })

    it('returns its name', () => {
        expect( Point.getName() ) .to .eql( 'Point' )
    })

    it('returns its definition', () => {
        expect( Point.getClassificationDefinition() ) .to .eql( pointDefinition )
    })

    it('returns all its defined methods', () => {
        const methods = Point.getDefinedMethodNames()

        expect( methods ) .to .eql( [ 'constructor', 'initialize', 'getX', 'getY' ] )
    })

    it('returns true if it defines a method', () => {
        expect( Point.definesMethod('getX') ) .to .be .true
    })

    it('returns false if it does not define a method', () => {
        expect( Point.definesMethod('noMethod') ) .to .be .false
    })

    it('returns itself if it implements a protocol', () => {
        const PointProtocol = Protocol.define(
            class PointProcotol {
                getX(){}
                getY(){}
            }
        )

        expect( Point.implements({ protocol: PointProtocol }) ) .to .equal(Point)
    })

    it('returns false if it does not implement a protocol', () => {
        const PointProtocol = Protocol.define(
            class PointProcotol {
                getZ(){}
            }
        )

        expect( () => {

            Point.implements({ protocol: PointProtocol })

        }).to .raise({
            error: Errors.ProtocolError,
            withMessage: 'Point classification must implement the method PointProcotol.getZ to comply with the protocol implementation.',
        })
    })

    it('returns a copy of its instance variables', () => {
        const Point = Classification.define(
            class Point {
                static definition() {
                    this.instanceVariables = ['x', 'y']
                }
            }
        )

        Point.getDefinedInstanceVariables().push('z')

        expect( Point.getDefinedInstanceVariables() ) .to .eql( ['x', 'y'] )
    })

    it('set its instance variables', () => {
        const Point = Classification.define(
            class Point {
                static definition() {
                    this.instanceVariables = ['x', 'y']
                }
            }
        )

        Point.setDefinedInstanceVariables(['x', 'y', 'z'])

        expect( Point.getDefinedInstanceVariables() ) .to .eql( ['x', 'y', 'z'] )
    })

    it('returns true if it defines an instance variable', () => {
        expect( Point.definesInstanceVariable('x') ) .to .be .true
    })

    it('returns false if it does not define an instance variable', () => {
        expect( Point.definesInstanceVariable('z') ) .to .be .false
    })

    it('returns a copy of its direct assumptions', () => {
        const Classification_1_1_1 = Classification.define(
            class Classification_1_1_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_2_1 = Classification.define(
            class Classification_1_2_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_1 = Classification.define(
            class Classification_1_1 {
                static definition() {
                    this.assumes = [Classification_1_1_1]
                }
            }
        )

        const Classification_1_2 = Classification.define(
            class Classification_1_2 {
                static definition() {
                    this.assumes = [Classification_1_2_1]
                }
            }
        )

        const Classification_1 = Classification.define(
            class Classification_1 {
                static definition() {
                    this.assumes = [Classification_1_1, Classification_1_2]
                }
            }
        )

        Classification_1.getAssumptions().push(Classification_1_1_1)

        expect( Classification_1.getAssumptions() ) .to .eql([
                Classification_1_1,
                Classification_1_2,
            ])
    })

    it('sets its direct assumptions', () => {
        const Classification_1_1_1 = Classification.define(
            class Classification_1_1_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_1 = Classification.define(
            class Classification_1_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_2 = Classification.define(
            class Classification_1_2 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1 = Classification.define(
            class Classification_1 {
                static definition() {
                    this.assumes = [Classification_1_1, Classification_1_2]
                }
            }
        )

        Classification_1.setAssumptions([Classification_1_1, Classification_1_2, Classification_1_1_1])

        expect( Classification_1.getAssumptions() ) .to .eql([
                Classification_1_1,
                Classification_1_2,
                Classification_1_1_1,
            ])
    })

    it('returns all its assumptions', () => {
        const Classification_1_1_1 = Classification.define(
            class Classification_1_1_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_2_1 = Classification.define(
            class Classification_1_2_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_1 = Classification.define(
            class Classification_1_1 {
                static definition() {
                    this.assumes = [Classification_1_1_1]
                }
            }
        )

        const Classification_1_2 = Classification.define(
            class Classification_1_2 {
                static definition() {
                    this.assumes = [Classification_1_1_1, Classification_1_2_1]
                }
            }
        )

        const Classification_1 = Classification.define(
            class Classification_1 {
                static definition() {
                    this.assumes = [Classification_1_1, Classification_1_2]
                }
            }
        )

        expect( Classification_1.getRecursiveAssumptions() ) .to .eql([
                Classification_1_1_1,
                Classification_1_1,
                Classification_1_2_1,
                Classification_1_2,
            ])
    })

    it('returns all its assumptions including itself', () => {
        const Classification_1_1_1 = Classification.define(
            class Classification_1_1_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_2_1 = Classification.define(
            class Classification_1_2_1 {
                static definition() {
                    this.assumes = []
                }
            }
        )

        const Classification_1_1 = Classification.define(
            class Classification_1_1 {
                static definition() {
                    this.assumes = [Classification_1_1_1]
                }
            }
        )

        const Classification_1_2 = Classification.define(
            class Classification_1_2 {
                static definition() {
                    this.assumes = [Classification_1_1_1, Classification_1_2_1]
                }
            }
        )

        const Classification_1 = Classification.define(
            class Classification_1 {
                static definition() {
                    this.assumes = [Classification_1_1, Classification_1_2]
                }
            }
        )

        expect( Classification_1.getAssumptionsChain() ) .to .eql([
                Classification_1_1_1,
                Classification_1_1,
                Classification_1_2_1,
                Classification_1_2,
                Classification_1,
            ])
    })
})