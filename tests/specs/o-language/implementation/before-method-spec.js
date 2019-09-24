const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const OInstance = require('../../../../src/o-language/classifications/OInstance')

describe('When calling the beforeMethod hook', () => {
    it('calls it with the method name, params and classification object', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)

        object.setPosition({ x: 10, y: 20 })

        expect( object.getFirstProxyBeforeMethodCalls() ) .to .eql([{
            proxy: 'ShapeProxy',
            methodName: 'setPosition',
            params: [{ x: 10, y: 20 }],
            classification: Shape,
        }])
    })
})

describe('When calling the beforeMethod hook on a method that calls previousClassificationDo', () => {
    it('calls it with the method name, params and classification object', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)
        object.behaveAs(ShapeProxyCallingPreviousClassification)

        object.setPosition({ x: 10, y: 20 })

        const firstProxyBeforeMethodCalls = object.getFirstProxyBeforeMethodCalls()

        expect( firstProxyBeforeMethodCalls[0] ) .to .eql({
                proxy: 'ShapeProxy',
                methodName: 'behaveAs',
                params: [ShapeProxyCallingPreviousClassification],
                classification: OInstance,
            })

        expect( firstProxyBeforeMethodCalls[1] ) .to .eql({
            proxy: 'ShapeProxy',
            methodName: 'setPosition',
            params: [{ x: 10, y: 20 }],
            classification: Shape,
        })

        expect( firstProxyBeforeMethodCalls[2] ) .to .eql({
            proxy: 'ShapeProxy',
            methodName: 'getFirstProxyBeforeMethodCalls',
            params: [],
            classification: ShapeProxy,
        })

        const secondProxyBeforeMethodCalls = object.getSecondProxyBeforeMethodCalls()

        expect( secondProxyBeforeMethodCalls[0] ) .to .eql({
                proxy: 'ShapeProxyCallingPreviousClassification',
                methodName: 'setPosition',
                params: [{ x: 10, y: 20 }],
                classification: Shape,
            })
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

    it('does not call the method but does call other beforeMethod hooks', () => {
        const object = Shape.new()

        object.behaveAs(ShapeProxy)
        object.behaveAs(ShapeProxySkippingMethodCall)

        object.setPosition({ x: 10, y: 20 })

        const allProxiesBeforeMethodCalls = [].concat(
            object.getFirstProxyBeforeMethodCalls(),
        )

        expect( allProxiesBeforeMethodCalls.length ) .to .equal(3)

        expect( object.getPosition() ) .to .eql({ x: undefined, y: undefined })
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
        this.beforeMethodWasCalled = true

        return {
            methodName: null,
        }
    }

    getBeforeMethodWasCalled() {
        return this.beforeMethodWasCalled
    }
})
