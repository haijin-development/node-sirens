const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance

const Possitionable = Classification.define( class Possitionable {

})

class _Shape {
    static definition() {
        this.instanceVariables = ['x', 'y']
        this.assumes = [Possitionable]
    }

    setPosition({x: x, y: y}) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return { x: this.x, y: this.y }
    }
}

class _Circle {
    static definition() {
        this.instanceVariables = ['radius']
        this.assumes = []
    }

    setRadius(radius) {
        this.radius = radius
    }

    getRadius() {
        return this.radius
    }
}

const Shape = Classification.define( _Shape )

describe('When creating a new classification', () => {
    it('it responds its name', () => {
        expect( Shape.getName() ) .to .equal( '_Shape' )
    })

    it('it responds its definition', () => {
        expect( Shape.getClassificationDefinition() ) .to .equal( _Shape )
    })

    it('it responds its defined methods names', () => {
        expect( Shape.getDefinedMethodNames() ) .to .eql([
            'constructor',
            'setPosition',
            'getPosition',
        ])
    })

    it('it responds if its defines a method', () => {
        expect( Shape.definesMethod('setPosition') ) .to .be .true
        expect( Shape.definesMethod('setPos') ) .to .be .false
    })

    it('it responds its defined instance variables', () => {
        expect( Shape.getDefinedInstanceVariables() ) .to .eql([
            'x',
            'y',
        ])
    })

    it('it responds if its defines an instance variable', () => {
        expect( Shape.definesInstanceVariable('x') ) .to .be .true
        expect( Shape.definesInstanceVariable('z') ) .to .be .false
    })

    it('it responds its assumptions', () => {
        expect( Shape.getAssumptions() ) .to .eql([ Possitionable ])
    })

    it('it responds its recursive assumptions', () => {
        expect( Shape.getRecursiveAssumptions() ) .to .eql([ Possitionable ])
    })

    it('it responds its recursive assumptions chain', () => {
        expect( Shape.getAssumptionsChain() ) .to .eql([ Possitionable, Shape ])
    })
})

describe('When dynamically setting its instance variables', () => {
    let Shape

    beforeEach( () => {
        Shape = Classification.define( _Shape )
    })

    it('sets the new instances variables', () => {
        Shape.setDefinedInstanceVariables([ 'a', 'b' ])

        expect( Shape.getDefinedInstanceVariables() ) .to .eql([
            'a',
            'b',
        ])
    })
})

describe('When dynamically setting its assumptions', () => {
    let Shape

    beforeEach( () => {
        Shape = Classification.define( _Shape )
    })

    it('sets the new instances variables', () => {
        Shape.setAssumptions([])

        expect( Shape.getAssumptions() ) .to .eql( [] )
    })
})

describe('When dynamically setting a classification definition', () => {
    let Shape

    beforeEach( () => {
        Shape = Classification.define( _Shape )
        Shape.setClassificationDefinition( _Circle )
    })

    it('it responds its name', () => {
        expect( Shape.getName() ) .to .equal( '_Circle' )
    })

    it('it responds its definition', () => {
        expect( Shape.getClassificationDefinition() ) .to .equal( _Circle )
    })

    it('it responds its defined methods names', () => {
        expect( Shape.getDefinedMethodNames() ) .to .eql([
            'constructor',
            'setRadius',
            'getRadius',
        ])
    })

    it('it responds if its defines a method', () => {
        expect( Shape.definesMethod('setRadius') ) .to .be .true
        expect( Shape.definesMethod('setPos') ) .to .be .false
    })

    it('it responds its defined instance variables', () => {
        expect( Shape.getDefinedInstanceVariables() ) .to .eql([
            'radius',
        ])
    })

    it('it responds if its defines an instance variable', () => {
        expect( Shape.definesInstanceVariable('radius') ) .to .be .true
        expect( Shape.definesInstanceVariable('z') ) .to .be .false
    })

    it('it responds its assumptions', () => {
        expect( Shape.getAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions', () => {
        expect( Shape.getRecursiveAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions chain', () => {
        expect( Shape.getAssumptionsChain() ) .to .eql([ Shape ])
    })
})


describe('The Classification classification', () => {
    it('it responds its name', () => {
        expect( Classification.getName() ) .to .equal( 'Classification' )
    })

    it('it responds its definition', () => {
        expect( Classification.getClassificationDefinition().name ) .to .equal( 'Classification' )
        expect( typeof Classification.getClassificationDefinition() ) .to .equal( 'function' )
    })

    it('it responds its defined methods names', () => {
        expect( Classification.getDefinedMethodNames() ) .to .eql([
            'constructor',
            'define',
            'createObject',
            'new',
            'getName',
            'getClassificationDefinition',
            'initializeClassificationDefinition',
            'setClassificationDefinition',
            'getDefinedMethodNames',
            'definesMethod',
            'getDefinedInstanceVariables',
            'setDefinedInstanceVariables',
            'definesInstanceVariable',
            'getAssumptions',
            'setAssumptions',
            'getRecursiveAssumptions',
            'getAssumptionsChain',
            'getClassificationBehaviours',
            'setClassificationBehaviours',
            'getImplementedProtocols',
            'setImplementedProtocols',
            'getExpectedProtocols',
            'setExpectedProtocols',
            'implements',
            'compliesWith',
        ])
    })

    it('it responds if its defines a method', () => {
        expect( Classification.definesMethod('getClassificationDefinition') ) .to .be .true
        expect( Classification.definesMethod('setPos') ) .to .be .false
    })

    it('it responds its defined instance variables', () => {
        expect( Classification.getDefinedInstanceVariables() ) .to .eql([
            'classificationDefinition',
        ])
    })

    it('it responds if its defines an instance variable', () => {
        expect( Classification.definesInstanceVariable('classificationDefinition') ) .to .be .true
        expect( Classification.definesInstanceVariable('z') ) .to .be .false
    })

    it('it responds its assumptions', () => {
        expect( Classification.getAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions', () => {
        expect( Classification.getRecursiveAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions chain', () => {
        expect( Classification.getAssumptionsChain() ) .to .eql([ Classification ])
    })
})


describe('The OInstance classification', () => {
    it('it responds its name', () => {
        expect( OInstance.getName() ) .to .equal( 'OInstance' )
    })

    it('it responds its definition', () => {
        expect( OInstance.getClassificationDefinition().name ) .to .equal( 'OInstance' )
        expect( typeof OInstance.getClassificationDefinition() ) .to .equal( 'function' )
    })

    it('it responds its defined methods names', () => {
        expect( OInstance.getDefinedMethodNames() ) .to .eql([
            'constructor',
            'initialize',
            'isBehavingAs',
            'respondsTo',
            'compliesWith',
            'behaveAs',
            'behaveAsAll',
            'pushBehaviour',
            'dropBehaviour',
            'previousClassificationDo',
            'duringClassificationDo',
            'classificationInstanceVariablesDo',
            'withClassificationDo',
            'bindYourself',
            'beforeMethod',
            'afterMethod',
            'yourself',
            'classifications',
            'getClassificationNames',
            'thisClassification',
            'previousClassification',
        ])
    })

    it('it responds if its defines a method', () => {
        expect( OInstance.definesMethod('isBehavingAs') ) .to .be .true
        expect( OInstance.definesMethod('setPos') ) .to .be .false
    })

    it('it responds its defined instance variables', () => {
        expect( OInstance.getDefinedInstanceVariables() ) .to .eql([])
    })

    it('it responds if its defines an instance variable', () => {
        expect( OInstance.definesInstanceVariable('z') ) .to .be .false
    })

    it('it responds its assumptions', () => {
        expect( OInstance.getAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions', () => {
        expect( OInstance.getRecursiveAssumptions() ) .to .eql([])
    })

    it('it responds its recursive assumptions chain', () => {
        expect( OInstance.getAssumptionsChain() ) .to .eql([ OInstance ])
    })
})
