/*
 * A classification may call a method on a previously instantiated classification by using the method
 *
 *                      this.previousClassificationDo( () => {
 *                          // ...
 *                      }).
 *
 * This allows to not only override or replace the behaviour of another classification but to extend it
 * without modifying any of the original behaviour in a similar fashion as 'super' does in object orianted classes:
 *
 *   const Point = Classification.define( class {
 *      static definition() {
 *          this.instanceVariables = ['x', 'y']
 *      }
 *
 *      setX(value) {
 *          this.x = value
 *      }
 *
 *      getX() {
 *          return this.x
 *      }
 *  })
 *
 *  const PointModel = Classification.define( class {
 *      setX(value) {
 *          const oldValue = this.getX()
 *
 *          this.previousClassificationDo( () => {
 *              this.setX(value)
 *          })
 *
 *          this.trigger({
 *              event: 'x-coordinate-changed',
 *              oldValue: oldValue,
 *              newValue: newValue,
 *          })
 *      }
 *  })
 *
 *  const point = OInstance.new()
 *                  .behaveAs(Point)
 *                  .behaveAs(PointModel)
 *
 * Note that the order in which the classifications are added to an object matters for the method
 *      previousClassificationDo( () => {} )
 */

const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const OInstance = require('../../../../src/o-language/classifications/OInstance')

const Shape = Classification.define( class {
    static definition() {
        this.instanceVariables = ['x', 'y', 'shapeWasCalled']
    }

    setPosition({ x: x, y: y }) {
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
})

const OptimizedShape = Classification.define( class {
    static definition() {
        this.instanceVariables = ['optimizedShapeWasCalled']
    }

    setPosition({ x: x, y: y }) {
        this.previousClassificationDo( () => {
            this.setPosition({ x: x, y: y })
        })

        if( this.optimizedShapeWasCalled === undefined ) {
            this.optimizedShapeWasCalled = 0
        }

        this.optimizedShapeWasCalled += 1
    }

    getOptimizedShapeWasCalled() {
        return this.optimizedShapeWasCalled
    }

    firstLevelMethod() {
        return this.getConstantFromNestedMethod()
    }
})

const CustomizedShape = Classification.define( class {
    static definition() {
        this.instanceVariables = ['customizedShapeWasCalled']
    }

    setPosition({ x: x, y: y }) {

        this.previousClassificationDo( () => {
            this.setPosition({ x: x, y: y })  
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

    firstLevelMethod() {
        return this.previousClassificationDo( () => {
            return this.firstLevelMethod()  
        })        
    }
})

describe('When calling nested methods on an object', () => {
    it('calls the nested methods', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        expect(object.getConstant()) .to .equal('a constant')
    })
})

describe('When calling a method on an object', () => {
    it('activates the method in a given classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        object.withClassificationDo( Shape, () => {
            object.setPosition({ x: 10, y: 20 })
        })

        expect( object.getCustomizedShapeWasCalled() ) .to .be .undefined
        expect( object.getOptimizedShapeWasCalled() ) .to .be .undefined
        expect( object.getShapeWasCalled() ) .to .equal(1)
    })

    it('activates the method from the previous classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        object.setPosition({ x: 10, y: 20 })

        expect( object.getCustomizedShapeWasCalled() ) .to .be .equal(1)
        expect( object.getOptimizedShapeWasCalled() ) .to .equal(1)
        expect( object.getShapeWasCalled() ) .to .equal(1)
    })

    it('activates the method from the previous classification only on the first level of messages', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(OptimizedShape)
        object.behaveAs(CustomizedShape)

        const result = object.firstLevelMethod()

        expect(result) .to .equal('a constant')
    })
})