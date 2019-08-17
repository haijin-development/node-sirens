const expect = require('chai').expect
const O = require('../../../src/o-language/O')
const Sirens = require('../../../src/Sirens')

class Shape {
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
        return this.missingInstanceVariable;
    }

    setMissingInstanceVariable() {
        this.missingInstanceVariable = 1;
    }
}

class Circle {
    static definition() {
        this.instanceVariables = ['radious']
    }

    setRadious(radious) {
        this.radious = radious
    }

    getRadious() {
        return this.radious
    }
}

class Point {
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
}

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
 * with each other.
 *
 * Other classifications may access these private instance variables values though getters and setters provided
 * by each classification.
 *
 * This gives programmers a great deal of flexibility to decide whether a classification should use its own
 * namespace for keeping its state values or to rely on other classification(s) for that matter, and allows for
 * different classifications to coexist without name conflicts instead of overriding their values.
 */
describe('When setting instance variables values to an O instance', () => {
    it('sets the given value on an object', () => {
        const object = O.new()

        object.behaveAs(Shape)

        object.ownProp = 10

        expect(object.ownProp) .to .equal(10)
    })

    it('sets the given value on a single classification instantiation', () => {
        const object = O.new()

        object.behaveAs(Shape)

        object.setX(10)

        expect(object.getX()) .to .equal(10)
    })

    it('sets the given value on a classification among many classification instantiations', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setRadious(10)

        expect(object.getRadious()) .to .equal(10)
        expect(object.getX()) .to .be .undefined
    })

    it('sets the given value on a classification that uses the same inst var names as another one', () => {
        const object = O.new()

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

    it('raises an error if a classification tries to set the value to an inexistent instance variable of its own', () => {
        const object = O.new()

        object.behaveAs(Shape)

        expect( () => {
            object.setMissingInstanceVariable()
        }) .to .throw(Error, `'missingInstanceVariable' is not an instance variable of Shape Classification.`)
    })
})