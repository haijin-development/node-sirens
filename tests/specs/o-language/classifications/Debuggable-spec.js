const expect = require('chai').expect
const OInstance = require('../../../../src/o-language/classifications/OInstance')
const Debuggable = require('../../../../src/o-language/classifications/Debuggable')

class Shape {
    static definition() {
        this.instanceVariables = ['x', 'y', 'overriden']
        this.assumptions = [Debuggable]
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
}

class Circle {
    static definition() {
        this.instanceVariables = ['radious', 'overriden']
        this.assumptions = [Debuggable]
    }

    setRadious(radious) {
        this.radious = radious
    }

    getRadious() {
        return this.radious
    }

    setOverriden(value) {
        this.overriden = value

        this.previousClassificationDo( () => {
            this.setOverriden( value + 10 )
        })
    }
}

describe('The Debuggable classification', () => {
    it('prints an new object', () => {
        const object = OInstance.new()
                        .behaveAs(Debuggable)

        const debugString = object.debugString()

        const expectedString = 
`Debuggable {
}
OInstance {
}
`
        expect(debugString) .to .equal(expectedString)
    })

    it('prints an object with many classifications', () => {
        const object = OInstance.new()
                        .behaveAs(Debuggable)
                        .behaveAs(Shape)
                        .behaveAs(Circle)

        const debugString = object.debugString()

        const expectedString = 
`Circle {
    radious: undefined
    overriden: undefined
}
Shape {
    x: undefined
    y: undefined
    overriden: undefined
}
Debuggable {
}
OInstance {
}
`
        expect(debugString) .to .equal(expectedString)
    })

    it('prints an object with nested objects', () => {
        const circle = OInstance.new()
                        .behaveAs(Circle)

        const shape = OInstance.new()
                        .behaveAs(Debuggable)
                        .behaveAs(Shape)

        shape.setOverriden(circle)

        const debugString = shape.debugString()

        const expectedString = 
`Shape {
    x: undefined
    y: undefined
    overriden: 
        Circle {
            radious: undefined
            overriden: undefined
        }
        Debuggable {
        }
        OInstance {
        }

}
Debuggable {
}
OInstance {
}
`
        expect(debugString) .to .equal(expectedString)
    })
})