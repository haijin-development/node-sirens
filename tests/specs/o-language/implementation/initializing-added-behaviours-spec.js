/*
 * In the O language right after a classification is instantiated on an object if the classification defines
 * a method called
 *                          afterInstantiation()
 * that method is invoked:
 *
 *      const Shape = Classification.define( class {
 *          static definition() {
 *              this.instanceVariables = ['x', 'y']
 *          }
 *
 *          afterInstantiation() {
 *              this.x = 0
 *              this.y = 0
 *          }
 *      })
 *
 * The optional method afterInstantiation can be used to, for instance, initialize instance variables, dynamically 
 * add further classifications to itself dependening on the current state of the object or check the integrity of 
 * the object, just to name a few possibiltiies.
 *
 * When the method afterInstantiation()is invoked the object is in a valid state, thus it is possible to initialize
 * its state querying the state of the classifications previouly instantiated.
 * For instance, the following example uses a design pattern that allows a classification to act as a temporary 
 * snapshot or version of an existing object:
 *
 *      const PositionSnapshot = Classification.define( class {
 *          static definition() {
 *              this.instanceVariables = ['x', 'y']
 *          }
 *
 *          afterInstantiation() {
 *              let x = 0
 *              let y = 0
 *
 *               this.previousClassificationDo( () => {
 *                  x = this.getX()
 *                  y = this.getY()
 *              })
 *
 *              this.x = x
 *              this.y = y
 *          }
 *      })
 *
 * If the classification does not defined a method afterInstantiation() then nothing happens.
 */

const expect = require('chai').expect
const Classification = require('../../../../src/o-language/classifications/Classification')
const OInstance = require('../../../../src/o-language/classifications/OInstance')

const Shape = Classification.define( class {
    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    afterInstantiation() {
        this.x = 0
        this.y = 0
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }
})

const Point = Classification.define( class {
    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }
})

describe('When adding behaviour to an O instance', () => {
    it('if the classification instantiated has a method afterInstantiation that method is invoked', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect(object.getPosition()) .to .eql({ x: 0, y: 0})
    })

    it('if the classification instantiated does not have a method afterInstantiation defined nothing happens', () => {
        const object = OInstance.new()

        object.behaveAs(Point)

        expect(object.getPosition()) .to .eql({ x: undefined, y: undefined})
    })
})