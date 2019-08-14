const expect = require('chai').expect
const O = require('../../../src/o-language/O')
const Sirens = require('../../../src/Sirens')

class Shape {
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
}

class OptimizedShape {
    setPosition({x: x, y: y}) {
        this.previousClassificationDo( () => {
            this.setPosition({x: x, y: y})  
        })

        if( this.optimizedShapeWasCalled === undefined ) {
            this.optimizedShapeWasCalled = 0
        }

        this.optimizedShapeWasCalled += 1
    }
}

class CustomizedShape {
    setPosition({x: x, y: y}) {
        
        this.previousClassificationDo( () => {
            this.setPosition({x: x, y: y})  
        })

        if( this.customizedShapeWasCalled === undefined ) {
            this.customizedShapeWasCalled = 0
        }

        this.customizedShapeWasCalled += 1
    }
}

xdescribe('When calling a method on an object', () => {
    it('activates the method in a given classification', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        object.withClassificationDo( Shape, () => {
            this.setPosition({x: 10, y: 20})
        })

        expect(object.customizedShapeWasCalled) .to .be .undefined
        expect(object.optimizedShapeWasCalled) .to .be .undefined
        expect(object.shapeWasCalled) .to .equal(1)
    })
})