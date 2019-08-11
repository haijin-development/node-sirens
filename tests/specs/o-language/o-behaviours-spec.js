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

describe('When instantiating a new O instance', () => {
    it('does not have any classification', () => {
        const object = new O();

        expect(object.classifications.length) .to .eql(0)
    })
})

describe('When adding behaviour to an O instance', () => {
    it('behaves as a given classification', () => {
        const object = new O();

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications.length) .to .eql(1)
    })

    it('behaves as more than one classification', () => {
        const object = new O();

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadious(3)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})
        expect(object.getRadious()) .to .eql(3)

        expect(object.classifications.length) .to .eql(2)
    })

    it('does nothing if the object already is behaving as the given classification', () => {
        const object = new O();

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setPosition({ x: 10, y: 20})
        object.setRadious(3)

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect(object.getPosition()) .to .eql({ x: 10, y: 20})

        expect(object.classifications.length) .to .eql(2)
    })
})

describe('When dropping behaviour from an instance', () => {
    it('drops a classification previously added', () => {
        const object = new O();

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        object.dropBehaviour(Shape)

        expect(object.getPosition) .to .be .undefined

        expect(object.classifications.length) .to .eql(0)
    })

    it('does not fail if the classification was not previously added', () => {
        const object = new O();

        object.dropBehaviour(Shape)

        expect(object.getPosition) .to .be .undefined

        expect(object.classifications.length) .to .eql(0)
    })
})