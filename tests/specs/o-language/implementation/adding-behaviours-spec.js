/*
 * In the O language any classification can be added to any object, making the object to adquire the
 * classification behaviour:
 *
 *      const object = OInstance.new()
 *
 *      object.behaveAs(Point)
 *
 * If the object already behaves as the added classification nothing happens, making the behaveAs an idempotent
 * operation:
 *
 *      const object = OInstance.new()
 *
 *      object.behaveAs(Point)
 *
 */

const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance

const Shape = Classification.define( class {
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

const Circle = Classification.define( class {
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

describe('When adding behaviour to an O instance', () => {
    it('behaves as a given classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications() ) .count .to .eql(2)
    })

    it('behaves as more than one classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadius(3)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})
        expect(object.getRadius()) .to .eql(3)

        expect(object.classifications() ) .count .to .eql(3)
    })

    it('does nothing if the object already is behaving as the given classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadius(3)

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications() ) .count .to .eql(3)
    })
})