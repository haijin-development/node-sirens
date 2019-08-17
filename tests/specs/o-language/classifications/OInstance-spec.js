const expect = require('chai').expect
const OInstance = require('../../../../src/o-language/classifications/OInstance')

class Shape {
    static definition() {
        this.instanceVariables = ['x', 'y', 'overriden']
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }

    setOverriden(value) {
        this.overriden = value
    }

    getOverriden(value) {
        return this.overriden
    }

    getThisClassification() {
        return this.thisClassification()
    }

    getPreviousClassification() {
        return this.previousClassification()
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

    setOverriden(value) {
        this.previousClassificationDo( () => {
            this.setOverriden( value + 10 )
        })
    }
}

describe('The OInstance classification', () => {
    it('creates a new O instance object', () => {
        const object = OInstance.new()

        expect(object.isBehavingAs(OInstance)) .to .be .true

        expect(object.classifications().length) .to .eql(1)
    })

    it('answers if it behaves as a classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect( object.isBehavingAs(OInstance) ) .to .be .true
        expect( object.isBehavingAs(Shape) ) .to .be .true
        expect( object.isBehavingAs(Circle) ) .to .be .false
    })

    it('answers if it behaves as a classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect( object.isBehavingAs(OInstance) ) .to .be .true
        expect( object.isBehavingAs(Shape) ) .to .be .true
        expect( object.isBehavingAs(Circle) ) .to .be .false
    })

    it('answers if it responds to a message', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect( object.respondsTo('getPosition') ) .to .be .true
        expect( object.respondsTo('getRadious') ) .to .be .false
        expect( object.respondsTo('respondsTo') ) .to .be .true
    })

    it('starts behaving as a classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect( object.isBehavingAs(Shape) ) .to .be .true
        expect( object.isBehavingAs(Circle) ) .to .be .true
    })

    it('stops behaving as a classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.dropBehaviour(Circle)

        expect( object.isBehavingAs(Shape) ) .to .be .true
        expect( object.isBehavingAs(Circle) ) .to .be .false
    })

    it('evaluates a closure in the context of a previous classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.setOverriden(1)

        expect( object.getOverriden() ) .to .equal(11)
    })

    it('answers all of its classification instantiated', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect( object.classifications() ) .to .eql([
            Circle,
            Shape,
            OInstance,
        ])
    })

    it('answers its active classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect( object.getThisClassification() ) .to .equal(Shape)
    })

    it('answers the classification previous to its active classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        expect( object.getPreviousClassification() ) .to .equal(OInstance)
    })

    it('evaluates a closure in the context of a given classification', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)
        object.behaveAs(Circle)

        object.withClassificationDo(Shape, () => {
            object.setOverriden(1)
        })

        expect( object.getOverriden() ) .to .equal(1)
    })
})