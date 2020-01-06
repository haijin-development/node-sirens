/*
 * In the O language any classification previously added to an instance can be dropped by that instance:
 *
 *      const object = OInstance.new()
 *
 *      object.behaveAs(Point)
 *      object.setX(0)
 *      object.setY(0)
 *
 *      object.dropBehaviour(Point)
 *
 * If the object did not behaved as the dropped classification nothing happens, making the dropBehaviour an
 * idempotent operation:
 *
 *      const object = OInstance.new()
 *
 *      object.dropBehaviour(Point)
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

describe('When dropping behaviour from an instance', () => {
    it('drops a classification previously added', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        object.dropBehaviour(Shape)

        expect(object.respondsTo('getPosition')) .to .be .false

        expect(object.classifications()) .count .to .eql(1)
    })

    it('does not drop other classifications', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.dropBehaviour(Circle)

        expect(object.respondsTo('getPosition')) .to .be .true
        expect(object.respondsTo('getRadius')) .to .be .false

        expect(object.classifications()) .count .to .eql(2)
    })

    it('does not fail if the classification was not previously added', () => {
        const object = OInstance.new()

        object.dropBehaviour(Shape)

        expect(object.respondsTo('getPosition')) .to .be .false

        expect(object.classifications()) .count .to .eql(1)
    })
})