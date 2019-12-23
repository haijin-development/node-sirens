/*
    These are the valid attributes of a class definition.
*/
const classDefinitionAttributes = [
    'length',
    'prototype',
    'name',
 
    'definition',
    'instanceVariables',
    'assumes',
    'implements',
    'classificationBehaviours',
    'expects',

    'implementsBeforeAfterMethods',
]

class ClassificationDefinition {

    static initialize({ classificationDefinition: classificationDefinition }) {
        if( classificationDefinition.definition !== undefined ) {
            classificationDefinition.definition()
        }

        if( classificationDefinition.instanceVariables === undefined ) {
            classificationDefinition.instanceVariables = []
        }

        if( classificationDefinition.assumes === undefined ) {
            classificationDefinition.assumes = []
        }

        if( classificationDefinition.implements === undefined ) {
            classificationDefinition.implements = []
        }

        if( classificationDefinition.expects === undefined ) {
            classificationDefinition.expects = []
        }

        if( classificationDefinition.classificationBehaviours === undefined ) {
            classificationDefinition.classificationBehaviours = []
        }

        const classificationDefinitionProps = Object.getOwnPropertyNames( classificationDefinition )

        classificationDefinitionProps.forEach( (attribute) => {
            if( ! classDefinitionAttributes.includes( attribute ) ) {
                throw new Error(`Uknown classification definition '${attribute}'.`)
            }  
        })

        classificationDefinition.implementsBeforeAfterMethods =
            ClassificationDefinition.checkIfImplementsBeforeAfterMethods({
                classificationDefinition: classificationDefinition
            })
    }

    /*
     * Instantiates a classification for the given object.
     */
    static instantiateClassification({ classificationDefinition: classificationDefinition }) {
        const instantiation = Object.create(null)

        instantiation.definition = classificationDefinition

        return instantiation
    }

    static getClassificationDefinition({ classificationInstantiation: classificationInstantiation }) {
        return classificationInstantiation.definition
    }

    static getName({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.name
    }

    static getDefinedMethodNames({ classificationDefinition: classificationDefinition }) {
        return Object.getOwnPropertyNames( classificationDefinition.prototype )
    }

    static hasMethodDefined({
        classificationDefinition: classificationDefinition, methodName: methodName
    }) {
        const method = classificationDefinition.prototype[methodName]

        return method !== undefined
    }

    static defineMethod({
        classificationDefinition: classificationDefinition, methodName: methodName, methodClosure: methodClosure,
    }) {
        classificationDefinition.prototype[methodName] = methodClosure
    }

    static getMethod({ classificationDefinition: classificationDefinition, methodName: methodName }) {
        return classificationDefinition.prototype[methodName]
    }

    static getDefinedInstanceVariables({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.instanceVariables.slice()
    }

    static setDefinedInstanceVariables({
        classificationDefinition: classificationDefinition, instanceVariables: instanceVariables
    }) {
        classificationDefinition.instanceVariables = instanceVariables.slice()
    }

    static hasInstanceVariableDefined({
        classificationDefinition: classificationDefinition, instanceVariableName: instanceVariableName
    }) {
        return classificationDefinition.instanceVariables.includes(instanceVariableName)
    }

    static getAssumptions({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.assumes.slice()
    }

    static setAssumptions({
        classificationDefinition: classificationDefinition, assumptions: classificationsObjects }
    ) {
        classificationDefinition.assumes = classificationsObjects.slice()
    }

    static getClassificationBehaviours({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.classificationBehaviours.slice()
    }

    static setClassificationBehaviours({
        classificationDefinition: classificationDefinition, classificationsObjects: classificationsObjects }
    ) {
        classificationDefinition.classificationBehaviours = classificationsObjects.slice()
    }

    static getImplementedProtocols({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.implements.slice()
    }

    static setImplementedProtocols({
        classificationDefinition: classificationDefinition, implementedProtocols: implementedProtocols }
    ) {
        classificationDefinition.implements = implementedProtocols.slice()
    }

    static getExpectedProtocols({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.expects.slice()
    }

    static setExpectedProtocols({
        classificationDefinition: classificationDefinition, expectedProtocols: expectedProtocols }
    ) {
        classificationDefinition.expects = expectedProtocols.slice()
    }

    /// beforeMethod/afterMethod optimization

    static implementsBeforeAfterMethods({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.implementsBeforeAfterMethods
    }

    static checkIfImplementsBeforeAfterMethods({ classificationDefinition: classificationDefinition }) {
        return  ClassificationDefinition.hasMethodDefined({
                    classificationDefinition: classificationDefinition,
                    methodName: 'beforeMethod',
                })
                ||
                ClassificationDefinition.hasMethodDefined({
                    classificationDefinition: classificationDefinition,
                    methodName: 'afterMethod',
                })
    }
}

module.exports = ClassificationDefinition

