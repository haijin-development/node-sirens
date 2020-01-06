/*
 * In the O language the instance variables of classifications are always private and can not be set nor read from
 * outside of a classification method.
 *
 * Classifications keeping their own state using the objects props may lead to different classifications to
 * unintentionally override their values and may eventually create conflicts between them.
 *
 * The following expression:
 *
 *              object.value = 1
 *
 * sets the prop 'value' to the object but not to any of the classifications instantiated on it.
 *
 * Classifications can also have their own set of private and owned named instance variables that will not conflict
 * with other classifications.
 *
 * Other classifications may access these private instance variables values though getters and setters provided
 * by each classification.
 *
 * This gives programmers a great deal of flexibility to decide whether a classification should use its own
 * namespace for keeping its state values or to rely on other classification(s) for that matter, and allows for
 * different classifications to coexist without name conflicts instead of overriding their values.
 *
 * The instance variables of a classification must be declared in the classification definition:
 *
 *      const Point = Classification.define( class {
 *          static definition() {
 *              this.instanceVariables = ['x', 'y']
 *          }
 *      })
 *
 * One of the reasons is that it makes the classification to clearly express the instance variables its uses.
 *
 * However, since the definition of a classification is a regular javascript object its instances variables can
 * be accessed with
 *
 *      Point.instanceVariables
 *
 * and can be modified if needed to, for instance to create dynamic classes on the fly.
 *
 */

const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance
const Errors = require('../../../../src/O').Errors

const Shape = Classification.define( class Shape {
    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    setX(value) {
        this.x = value
    }

    setY(value) {
        this.y = value
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    getMissingInstanceVariable() {
        return this.missingInstanceVariable
    }

    setMissingInstanceVariable() {
        this.missingInstanceVariable = 1
    }

    setUnclassifiedPropertyValue(value) {
        this.setUnclassifiedProperty({
            name: 'unclassifiedValue',
            value: value,
        })
    }
})

const Circle = Classification.define( class Circle {
    static definition() {
        this.instanceVariables = ['radius']
    }

    setRadius(radius) {
        this.radius = radius
    }

    getRadius() {
        return this.radius
    }
})

const Point = Classification.define( class Point {
    static definition() {
        this.instanceVariables = ['x', 'y']
    }

    setX(value) {
        this.x = value
    }

    setY(value) {
        this.y = value
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }
})

describe('When setting instance variables values to an O instance', () => {
    it('sets the given value on an object', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.ownProp = 10

        expect(object.ownProp) .to .equal(10)
    })

    it('sets the given value on a single classification instantiation', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.setX(10)

        expect(object.getX()) .to .equal(10)
    })

    it('sets the given value on a classification among many classification instantiations', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setRadius(10)

        expect(object.getRadius()) .to .equal(10)
        expect(object.getX()) .to .be .undefined
    })

    it('sets the given value on a classification that uses the same inst var names as another one', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.setX(0)
        expect(object.getX()) .to .equal(0)

        object.behaveAs(Point)

        expect(object.getX()) .to .be .undefined

        object.setX(1)
        expect(object.getX()) .to .be .equal(1)

        object.dropBehaviour(Point)

        expect(object.getX()) .to .be .equal(0)
    })

    it('sets the given value on the object as an unclassified property', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.setUnclassifiedPropertyValue( 0 )

        expect( object.unclassifiedValue ) .to .equal(0)
    })

    it('raises an error if a classification tries to set the value to an inexistent instance variable of its own', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect( () => {
            object.setMissingInstanceVariable()
        }) .to .raise({
            error: Errors.InstanceVariableNotFoundError,
            withMessage: `'missingInstanceVariable' is not an instance variable of Shape Classification.`
        })
    })
})