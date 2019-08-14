const expect = require('chai').expect
const O = require('../../../src/o-language/O')
const Sirens = require('../../../src/Sirens')

class Shape {
    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }
}

class Circle {
    setRadious(radious) {
        this.radious = radious
    }

    getRadious() {
        return this.radious
    }
}

describe('When adding behaviour to an O instance', () => {
    it('behaves as a given classification', () => {
        const object = O.new()

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications.length) .to .eql(2)
    })

    it('behaves as more than one classification', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadious(3)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})
        expect(object.getRadious()) .to .eql(3)

        expect(object.classifications.length) .to .eql(3)
    })

    it('does nothing if the object already is behaving as the given classification', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadious(3)

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications.length) .to .eql(3)
    })
})