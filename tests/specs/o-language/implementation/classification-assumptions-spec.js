/*
 * In the O language there is no concept of a classification to require or include another classification since
 * that would impose a hard static constraint on the behaviour of an object.
 *
 * There is a similar but subtly different concept though: a classification assumptions.
 *
 * In some cases a classification to make sense assumes that an objet behaves as another classification.
 *
 * For instance a Shape asumes that the object behaves as a Positionable.
 *
 * This allows to split the behaviours into many different classifications with specific concerns and 
 * responsibilities and yet to make all of the different classifications to be aware and colaborate with each other.
 *
 * If the assumptions of a classifications are explicitly declared in its definition then the assumed 
 * classifications are instantiated on the object before the classification if they had not been instantiated 
 * already:
 *
 *      const Shape = Classification.define( class {
 *          static definition() {
 *              this.assumes = [Positionable, Coloured]
 *          }
 *      })
 *
 * This definition clearly expresses the assumptions of a classification and simplifies the creation of an object.
 * In that sense it resembles the inheritance relation of the classes in the object oriented classes.
 *
 * The difference with the inhneritance mechanism is that this assumptions are not static nor mandatory.
 *
 * It is possible to change an assume behaviour of an instance after it has been fully instantiated.
 *
 * Note that this is the actual cognitive mechanism that we persons apply in our logic.
 * When a professional diagnoses some condition to a patient based on symptoms he is making the following
 * reasoning:
 *
 *      const SymptonPresence = Classification.define( class {
 *          static definition() {
 *              this.assumes = [PatientCondition]
 *          }
 *      })
 *
 *      const patient = OInstance.new()
 *
 *      patient.behaveAs(SymptonPresence)
 *
 *      patient.isBehavingAs(SymptonPresence) === true
 *      patient.isBehavingAs(PatientCondition) === true
 *
 * This relation is not a hard static contraint, thou.
 *
 * When the sympton disappears the SymptonPresence classification is no longer instantiated in the patient
 *
 *      patient.dropBehaveiour(SymptonPresence)
 *
 * however it is a common and extended mistake for the professional not to also drop the PatientCondition
 * that was assumed from the SymptonPresence.
 *
 *      patient.isBehavingAs(SymptonPresence) === false
 *      patient.isBehavingAs(PatientCondition) === true
 *
 * This cognitive error is usual and common in the conditions named as cronic conditions.
 */

const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const OInstance = require('../../../../src/O').OInstance

const Positionable = Classification.define( class {

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

const Coloured = Classification.define( class {
    static definition() {
        this.instanceVariables = ['color']
    }

    setColor(value) {
        this.color = color
    }

    getColor() {
        return this.color
    }
})

const Shape = Classification.define( class {
    static definition() {
        this.assumes = [Positionable, Coloured]
    }
})

const Circle = Classification.define( class {
    static definition() {
        this.instanceVariables = ['radius']
        this.assumes = [Shape]
    }

    setRadius(radius) {
        this.radius = radius
    }

    getRadius() {
        return this.radius
    }
})

describe('When adding classifications that assumes previous classifications', () => {
    it('adds the assumed direct classifications if they are not present already', () => {
        const object = OInstance.new()

        object.behaveAs(Shape)

        expect(object.isBehavingAs(Coloured)) .to .be .true
        expect(object.isBehavingAs(Positionable)) .to .be .true
        expect(object.isBehavingAs(Shape)) .to .be .true

        expect(object.classifications() ) .count .to .eql(4)
    })

    it('adds the indirect assumed classifications if they are not present already', () => {
        const object = OInstance.new()

        object.behaveAs(Circle)

        expect(object.isBehavingAs(Coloured)) .to .be .true
        expect(object.isBehavingAs(Positionable)) .to .be .true
        expect(object.isBehavingAs(Shape)) .to .be .true
        expect(object.isBehavingAs(Circle)) .to .be .true

        expect(object.classifications() ) .count .to .eql(5)
    })
})