const Classification = require('../../O').Classification
const OInstance = require('../../O').OInstance
const GtkView = require('../../skins/gtk-views/GtkView')
const ObjectProperty = require('./ObjectProperty')

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

        if( value.isBehavingAs( GtkView ) ) {

            const instVar = ObjectProperty.new({
                key: 'instance variables',
                value: 'GTKView objects own Gtk handles and its instance variables are not shown.'
            })

            instVars.push( instVar )

            return instVars
        }

        value.classifications().forEach( (classification) => {

            const classificationName = classification.getName()

            value.classificationInstanceVariablesDo(classification, (instVarName, instVarValue) => {

                const instVar = ObjectProperty.new({
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
