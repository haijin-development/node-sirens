const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationDefinition = require('./classification-definition')

class O_Object {
    static getInstantiatedClassificationAtOffset({ object: object, index: index }) {
        return object.impl.instantiatedClassifications[index]
    }    

    static getMostRecentInstantiatedClassification({ object: object }) {
        return O_Object.getInstantiatedClassificationAtOffset({
            object: object,
            index: 0,
        })
    }    

    static getMostRecentClassificationObject({ object: object }) {
        const firstInstantiatedClassification = O_Object.getMostRecentInstantiatedClassification({
                object: object
            })

        return ClassificationInstantiation.getSourceClassification({
            instantiatedClassification: firstInstantiatedClassification
        })
    }    
}


module.exports = O_Object

