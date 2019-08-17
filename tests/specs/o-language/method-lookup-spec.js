const expect = require('chai').expect
const O = require('../../../src/o-language/O')
const Sirens = require('../../../src/Sirens')

class Shape {
    static definition() {
        this.instanceVariables = ['x', 'y', 'shapeWasCalled']
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y

        if( this.shapeWasCalled === undefined ) {
            this.shapeWasCalled = 0
        }

        this.shapeWasCalled += 1
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }

    getShapeWasCalled() {
        return this.shapeWasCalled
    }
}

class OptimizedShape {
    static definition() {
        this.instanceVariables = ['optimizedShapeWasCalled']
    }

    setPosition({x: x, y: y}) {
        this.previousClassificationDo( () => {
            this.setPosition({x: x, y: y})  
        })

        if( this.optimizedShapeWasCalled === undefined ) {
            this.optimizedShapeWasCalled = 0
        }

        this.optimizedShapeWasCalled += 1
    }

    getOptimizedShapeWasCalled() {
        return this.optimizedShapeWasCalled
    }
}

class CustomizedShape {
    static definition() {
        this.instanceVariables = ['customizedShapeWasCalled']
    }

    setPosition({x: x, y: y}) {

        this.previousClassificationDo( () => {
            this.setPosition({x: x, y: y})  
        })

        if( this.customizedShapeWasCalled === undefined ) {
            this.customizedShapeWasCalled = 0
        }

        this.customizedShapeWasCalled += 1
    }

    getConstant() {
        return this.getConstantFromNestedMethod()
    }

    getConstantFromNestedMethod() {
        return 'a constant'
    }

    getCustomizedShapeWasCalled() {
        return this.customizedShapeWasCalled
    }
}

describe('When calling nested methods on an object', () => {
    it('calls the nested methods', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        expect(object.getConstant()) .to .equal('a constant')
    })
})

describe('When calling a method on an object', () => {
    it('activates the method in a given classification', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        object.withClassificationDo( Shape, () => {
            object.setPosition({x: 10, y: 20})
        })

        expect( object.getCustomizedShapeWasCalled() ) .to .be .undefined
        expect( object.getOptimizedShapeWasCalled() ) .to .be .undefined
        expect( object.getShapeWasCalled() ) .to .equal(1)
    })

    it('activates the method from the previous classification', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        object.setPosition({x: 10, y: 20})

        expect( object.getCustomizedShapeWasCalled() ) .to .be .equal(1)
        expect( object.getOptimizedShapeWasCalled() ) .to .equal(1)
        expect( object.getShapeWasCalled() ) .to .equal(1)
    })
})