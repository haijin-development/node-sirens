const expect = require('chai').expect
const O = require('../../../../src/o-language/O')

class Shape {
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

describe('When dropping behaviour from an instance', () => {
    it('drops a classification previously added', () => {
        const object = O.new()

        object.behaveAs(Shape)

        object.setPosition({ x: 10, y: 20})

        object.dropBehaviour(Shape)

        expect(object.respondsTo('getPosition')) .to .be .false

        expect(object.classifications().length) .to .eql(1)
    })

    it('does not drop other classifications', () => {
        const object = O.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.dropBehaviour(Circle)

        expect(object.respondsTo('getPosition')) .to .be .true
        expect(object.respondsTo('getRadious')) .to .be .false

        expect(object.classifications().length) .to .eql(2)
    })

    it('does not fail if the classification was not previously added', () => {
        const object = O.new()

        object.dropBehaviour(Shape)

        expect(object.respondsTo('getPosition')) .to .be .false

        expect(object.classifications().length) .to .eql(1)
    })
})