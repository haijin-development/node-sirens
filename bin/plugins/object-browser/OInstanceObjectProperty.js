const Classification = require('../../../src/O').Classification
const OInstance = require('../../../src/O').OInstance
const ObjectProperty = require('../../../src/sirens/objects/ObjectProperty')

/*
    Class(`
        This classification is a plugin to attach to an ObjectProperty to browse
        the child properties of an OInstance object.

        An OInstance object is a Proxy to a complex object composed of classification
        instances. As a javascript object it is only a proxy and the ObjectBrowser
        does not show the object in a meaningful format.

        This OInstanceObjectProperty is aware of the implementation of an OInstance
        and correctly shows the OInstance object child properties and values.
    `)
*/
class OInstanceObjectProperty {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    /// Querying

    getChildProperties() {
        if( this.isOInstance() ) {
            return this.getOInstanceProperties()
        }

        return this.previousClassificationDo( () => {
            return this.getChildProperties()
        })
    }

    /// Asking

    isOInstance() {
        return OInstance.isOInstance( this.getValue() )
    }

    getOInstanceProperties() {
        const instVars = []

        const value = this.getValue()

        value.classifications().forEach( (classification) => {

            const classificationName = classification.getName()

            value.classificationInstanceVariablesDo(classification, (instVarName, instVarValue) => {

                const objectPropertyPlugins =
                    this.namespace().ObjectPropertyPlugins.new()

                const instVar = objectPropertyPlugins.newObjectProperty({
                    key: classificationName + '.' + instVarName,
                    value: instVarValue,
                })

                instVars.push( instVar )
            })

        })

        return instVars
    }
}

module.exports = Classification.define(OInstanceObjectProperty)
