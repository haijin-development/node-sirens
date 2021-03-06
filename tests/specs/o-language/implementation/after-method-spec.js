const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance

let Shape
let ShapeProxy
let ShapeProxyOverridingResult

let extendedBehaviours

describe('When calling the afterMethod hook', () => {
    before( () => {
        extendedBehaviours = Classification.getExtendedBehaviours()

        Classification.setExtendedBehaviours([])

        Shape = Classification.define( class Shape {
            static definition() {
                this.instanceVariables = ['x', 'y']
            }

            setPosition({x: x, y: y}) {
                this.x = x
                this.y = y

                return true
            }

            getPosition() {
                return {
                    x: this.x,
                    y: this.y
                }
            }
        })

        ShapeProxy = Classification.define( class ShapeProxy {
            static definition() {
                this.instanceVariables = ['firstProxyAfterMethodCalls']
            }

            afterInstantiation() {
                this.firstProxyAfterMethodCalls = []
            }

            afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
                this.firstProxyAfterMethodCalls.push({
                    proxy: 'ShapeProxy',
                    methodName: methodName,
                    params: params,
                    result: result,
                    classification: classification,
                })
            }

            getFirstProxyAfterMethodCalls() {
                return this.firstProxyAfterMethodCalls
            }
        })

        ShapeProxyOverridingResult = Classification.define( class ShapeProxy {
            static definition() {
                this.instanceVariables = []
            }

            afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
                return {
                    callResult: false
                }
            }
        })
    })

    after( () => {
        Classification.setExtendedBehaviours( extendedBehaviours )
    })

    it('calls it with the method name, params, classification object and result', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)

        object.setPosition({ x: 10, y: 20 })

        const afterMethodsCalled = object.getFirstProxyAfterMethodCalls()

        expect( afterMethodsCalled ) .count .to .equal( 2 )

        expect( afterMethodsCalled[0].proxy ) .to .eql( 'ShapeProxy' )
        expect( afterMethodsCalled[0].methodName ) .to .eql( 'setPosition' )
        expect( afterMethodsCalled[0].params ) .to .eql( [{ x: 10, y: 20 }] )
        expect( afterMethodsCalled[0].classification === Shape ) .to .be .true

        expect( afterMethodsCalled[1].proxy ) .to .eql( 'ShapeProxy' )
        expect( afterMethodsCalled[1].methodName ) .to .eql( 'getFirstProxyAfterMethodCalls' )
        expect( afterMethodsCalled[1].params ) .to .eql( [] )
        expect( afterMethodsCalled[1].classification === ShapeProxy ) .to .be .true
    })
})

describe('When overriding the original method result in the afterMethod hook', () => {
    it('returns the overriden result', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxyOverridingResult)

        const result = object.setPosition({ x: 10, y: 20 })

        expect(result) .to .be .false
    })
})