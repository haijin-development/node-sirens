const Classification = require('../../o-language/classifications/Classification')
const ObjectProperty = require('./ObjectProperty')
const OInstance = require('../../o-language/classifications/OInstance')
const GtkView = require('../../gui/gtk-views/GtkView')

class OInstanceObjectProperty {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectProperty]
    }

    objectPropertyClassification() {
        return this.thisClassification()
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

            const instVar = this.objectPropertyClassification().new({
                key: 'instance variables',
                value: 'GTKView objects own Gtk handles and its instance variables are not shown.'
            })

            instVars.push( instVar )

            return instVars
        }

        value.classifications().forEach( (classification) => {

            value.classificationInstanceVariablesDo(classification, (instVarName, instVarValue) => {

                const instVar = this.objectPropertyClassification().new({
                    key: instVarName,
                    value: instVarValue
                })

                instVars.push( instVar )
            })

        })

        return instVars
    }
}

module.exports = Classification.define(OInstanceObjectProperty)
