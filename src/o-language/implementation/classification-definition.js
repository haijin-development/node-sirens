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

    static initialize(classificationDefinition) {
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

    static getInstanceVariablesOf(classificationDefinition) {
        return classificationDefinition.instanceVariables
    }


    /*
     * Instantiates a classification for the given object.
     */
    static instantiateClassificationFrom(classificationDefinition) {
        return new classificationDefinition()
    }
}


module.exports = ClassificationDefinition

