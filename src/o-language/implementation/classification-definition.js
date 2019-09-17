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
    }

    static getInstanceVariables({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.instanceVariables
    }

    /*
     * Instantiates a classification for the given object.
     */
    static instantiateClassification({ classificationDefinition: classificationDefinition }) {
        const instantiation = new classificationDefinition()

        return instantiation
    }

    static setAssumptions({
        classificationDefinition: classificationDefinition, assumptions: assumptions }
    ) {
        classificationDefinition.assumes = assumptions.slice()
    }

    static getName({ classificationDefinition: classificationDefinition }) {
        return classificationDefinition.name
    }
}


module.exports = ClassificationDefinition

