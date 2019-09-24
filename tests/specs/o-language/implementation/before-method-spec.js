const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const OInstance = require('../../../../src/o-language/classifications/OInstance')

describe('When calling the beforeMethod hook', () => {
    it('calls it with the method name, params and classification object', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)

        object.setPosition({ x: 10, y: 20 })

        const beforeMethodsCalled = object.getFirstProxyBeforeMethodCalls()

        expect( beforeMethodsCalled.length ) .to .equal( 2 )

        expect( beforeMethodsCalled[0].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[0].methodName ) .to .eql( 'setPosition' )
        expect( beforeMethodsCalled[0].params ) .to .eql( [{ x: 10, y: 20 }] )
        expect( beforeMethodsCalled[0].classification === Shape ) .to .be .true

        expect( beforeMethodsCalled[1].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[1].methodName ) .to .eql( 'getFirstProxyBeforeMethodCalls' )
        expect( beforeMethodsCalled[1].params ) .to .eql( [] )
        expect( beforeMethodsCalled[1].classification === ShapeProxy ) .to .be .true

    })
})

describe('When calling the beforeMethod hook on a method that calls previousClassificationDo', () => {
    it('calls it with the method name, params and classification object', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)
        object.behaveAs(ShapeProxyCallingPreviousClassification)

        object.setPosition({ x: 10, y: 20 })

        const allBeforeMethodCalls = [].concat(
            object.getFirstProxyBeforeMethodCalls(),
            object.getSecondProxyBeforeMethodCalls(),
        )

        expect( allBeforeMethodCalls.length ) .to .equal( 8 )

        expect( allBeforeMethodCalls[0].proxy ) .to .eql( 'ShapeProxy' )
        expect( allBeforeMethodCalls[0].methodName ) .to .eql( 'behaveAs' )
        expect( allBeforeMethodCalls[0].params ) .to .eql( [ ShapeProxyCallingPreviousClassification ] )
        expect( allBeforeMethodCalls[0].classification === OInstance ) .to .be .true

        expect( allBeforeMethodCalls[1].proxy ) .to .eql( 'ShapeProxy' )
        expect( allBeforeMethodCalls[1].methodName ) .to .eql( 'isBehavingAs' )
        expect( allBeforeMethodCalls[1].params ) .to .eql( [ ShapeProxyCallingPreviousClassification ] )
        expect( allBeforeMethodCalls[1].classification === OInstance ) .to .be .true

        expect( allBeforeMethodCalls[2].proxy ) .to .eql( 'ShapeProxy' )
        expect( allBeforeMethodCalls[2].methodName ) .to .eql( 'setPosition' )
        expect( allBeforeMethodCalls[2].params ) .to .eql( [{ x: 10, y: 20 }] )
        expect( allBeforeMethodCalls[2].classification === Shape ) .to .be .true

        expect( allBeforeMethodCalls[3].proxy ) .to .eql( 'ShapeProxy' )
        expect( allBeforeMethodCalls[3].methodName ) .to .eql( 'getFirstProxyBeforeMethodCalls' )
        expect( allBeforeMethodCalls[3].params ) .to .eql( [] )
        expect( allBeforeMethodCalls[3].classification === ShapeProxy ) .to .be .true

        expect( allBeforeMethodCalls[4].proxy ) .to .eql( 'ShapeProxy' )
        expect( allBeforeMethodCalls[4].methodName ) .to .eql( 'getSecondProxyBeforeMethodCalls' )
        expect( allBeforeMethodCalls[4].params ) .to .eql( [] )
        expect( allBeforeMethodCalls[4].classification === ShapeProxyCallingPreviousClassification ) .to .be .true

        expect( allBeforeMethodCalls[5].proxy ) .to .eql( 'ShapeProxyCallingPreviousClassification' )
        expect( allBeforeMethodCalls[5].methodName ) .to .eql( 'setPosition' )
        expect( allBeforeMethodCalls[5].params ) .to .eql( [{ x: 10, y: 20 }] )
        expect( allBeforeMethodCalls[5].classification === Shape ) .to .be .true

        expect( allBeforeMethodCalls[6].proxy ) .to .eql( 'ShapeProxyCallingPreviousClassification' )
        expect( allBeforeMethodCalls[6].methodName ) .to .eql( 'getFirstProxyBeforeMethodCalls' )
        expect( allBeforeMethodCalls[6].params ) .to .eql( [] )
        expect( allBeforeMethodCalls[6].classification === ShapeProxy ) .to .be .true

        expect( allBeforeMethodCalls[7].proxy ) .to .eql( 'ShapeProxyCallingPreviousClassification' )
        expect( allBeforeMethodCalls[7].methodName ) .to .eql( 'getSecondProxyBeforeMethodCalls' )
        expect( allBeforeMethodCalls[7].params ) .to .eql( [] )
        expect( allBeforeMethodCalls[7].classification === ShapeProxyCallingPreviousClassification ) .to .be .true
    })
})

describe('When calling other methods from within the beforeMethod', () => {
    it('calls the other method but not a new beforeMethod', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxyCallingItsOwnMethod)

        object.setPosition({ x: 10, y: 20 })

        const allProxiesBeforeMethodCalls = [].concat(
            object.getThirdProxyBeforeMethodCalls(),
        )

        allProxiesBeforeMethodCalls.forEach( (methodCalls) => {
            expect( methodCalls.methodName ) .not .to .equal('ownProxyMethod')
        })

        expect( object.ownMethodWasCalled() ) .to .be .true
    })
})

describe('When skipping a method call from the beforeMethod hook', () => {
    it('does not call the method', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxySkippingMethodCall)

        object.setPosition({ x: 10, y: 20 })

        expect( object.getPosition() ) .to .eql({ x: undefined, y: undefined })
    })

    it('does call other beforeMethod hooks', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)
        object.behaveAs(ShapeProxySkippingMethodCall)

        object.setPosition({ x: 10, y: 20 })

        const beforeMethodsCalled = object.getFirstProxyBeforeMethodCalls()

        expect( beforeMethodsCalled.length ) .to .equal( 4 )

        expect( beforeMethodsCalled[0].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[0].methodName ) .to .eql( 'behaveAs' )
        expect( beforeMethodsCalled[0].params ) .to .eql( [ ShapeProxySkippingMethodCall ] )
        expect( beforeMethodsCalled[0].classification === OInstance ) .to .be .true

        expect( beforeMethodsCalled[1].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[1].methodName ) .to .eql( 'isBehavingAs' )
        expect( beforeMethodsCalled[1].params ) .to .eql( [ ShapeProxySkippingMethodCall ] )
        expect( beforeMethodsCalled[1].classification === OInstance ) .to .be .true

        expect( beforeMethodsCalled[2].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[2].methodName ) .to .eql( 'setPosition' )
        expect( beforeMethodsCalled[2].params ) .to .eql( [{ x: 10, y: 20 }] )
        expect( beforeMethodsCalled[2].classification === Shape ) .to .be .true

        expect( beforeMethodsCalled[3].proxy ) .to .eql( 'ShapeProxy' )
        expect( beforeMethodsCalled[3].methodName ) .to .eql( 'getFirstProxyBeforeMethodCalls' )
        expect( beforeMethodsCalled[3].params ) .to .eql( [] )
        expect( beforeMethodsCalled[3].classification === ShapeProxy ) .to .be .true
    })
})

describe('When overriding the original method call parameters from the beforeMethod hook', () => {
    it('passes along the overriden parameters', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxyOverridingMethodCallParams)

        object.setPosition({ x: 10, y: 20 })

        expect( object.getPosition() ) .to .eql({ x: 100, y: 200 })
    })
})

describe('When calling the beforeMethod hook in a stand alone proxy', () => {
    it('passes along the overriden parameters', () => {
        const object = StandAloneProxy.new()

        object.anyMethod()

        expect( object.getBeforeMethodWasCalled() ) .to .be .true
    })
})

const Shape = Classification.define( class Shape {
    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
})

const ShapeProxy = Classification.define( class ShapeProxy {
    static definition() {
        this.instanceVariables = ['firstProxyBeforeMethodCalls']
    }

    afterInstantiation() {
        this.firstProxyBeforeMethodCalls = []
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        this.firstProxyBeforeMethodCalls.push({
            proxy: 'ShapeProxy',
            methodName: methodName,
            params: params,
            classification: classification,
        })
    }

    getFirstProxyBeforeMethodCalls() {
        return this.firstProxyBeforeMethodCalls
    }
})

const ShapeProxyCallingPreviousClassification = Classification.define( class ShapeProxyCallingPreviousClassification {
    static definition() {
        this.instanceVariables = ['secondProxyBeforeMethodCalls']
    }

    afterInstantiation() {
        this.secondProxyBeforeMethodCalls = []
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        const result = this.previousClassificationDo( () => {
            return this.beforeMethod({ methodName: methodName, params: params, classification: classification })
        })

        this.secondProxyBeforeMethodCalls.push({
            proxy: 'ShapeProxyCallingPreviousClassification',
            methodName: methodName,
            params: params,
            classification: classification,
        })

        return result
    }

    getSecondProxyBeforeMethodCalls() {
        return this.secondProxyBeforeMethodCalls
    }

})

const ShapeProxyCallingItsOwnMethod = Classification.define( class ShapeProxy {
    static definition() {
        this.instanceVariables = ['thirdProxyBeforeMethodCalls', 'ownMethodWasCalled']
    }

    afterInstantiation() {
        this.thirdProxyBeforeMethodCalls = []
        this.ownMethodWasCalled = false
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        if( this.thisClassification() === classification ) { return }

        this.thirdProxyBeforeMethodCalls.push({
            proxy: 'ShapeProxyCallingItsOwnMethod',
            methodName: methodName,
            params: params,
            classification: classification,
        })

        this.ownProxyMethod()
    }

    getThirdProxyBeforeMethodCalls() {
        return this.thirdProxyBeforeMethodCalls
    }

    ownProxyMethod() {
        this.ownMethodWasCalled = true
    }

    ownMethodWasCalled() {
        return this.ownMethodWasCalled
    }
})

const ShapeProxySkippingMethodCall = Classification.define( class ShapeProxy {
    static definition() {
        this.instanceVariables = []
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        const result = this.previousClassificationDo( () => {
            return this.beforeMethod({ methodName: methodName, params: params, classification: classification })
        })

        if( methodName === 'setPosition' ) {
            return {
                methodName: null
            }
        }

        return result
    }
})

const ShapeProxyOverridingMethodCallParams = Classification.define( class ShapeProxy {
    static definition() {
        this.instanceVariables = []
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        const result = this.previousClassificationDo( () => {
            return this.beforeMethod({ methodName: methodName, params: params, classification: classification })
        })

        if( methodName === 'setPosition' ) {
            return {
                params: [ { x: 100, y: 200 } ]
            }
        }

        return result
    }
})

const StandAloneProxy = Classification.define( class StandAloneProxy {
    static definition() {
        this.instanceVariables = ['beforeMethodWasCalled']
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
        if( methodName === 'getBeforeMethodWasCalled' ) { return }

        this.beforeMethodWasCalled = true

        return {
            methodName: null,
            params: null,
        }
    }

    getBeforeMethodWasCalled() {
        return this.beforeMethodWasCalled
    }
})
