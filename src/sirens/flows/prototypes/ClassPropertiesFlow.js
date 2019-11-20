const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ObjectProperty = require('../../objects/ObjectProperty')
const Sirens = require('../../../Sirens')

class ClassPropertiesFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowModel]
    }

    buildWith(flow) {
        flow.main( function(classProperties) {

            this.evaluate({ closure: classProperties.defineApplicationCommands, params: [classProperties] })

            this.whenObjectChanges( ({ newValue: aClass }) => {
                classProperties.updatePropertyChoices()
            })

            this.toggle({
                id: 'showInheritedProps',
                whenValueChanges: () => { classProperties.updatePropertyChoices() },
            })
            
            this.toggle({
                id: 'showFunctionProps',
                value: true,
                whenValueChanges: () => { classProperties.updatePropertyChoices() },
            })

            this.toggle({
                id: 'showNonFunctionProps',
                whenValueChanges: () => { classProperties.updatePropertyChoices() },
            })

            this.choice({
                id: 'properties',
                choices: [],
                whenSelectionChanges: ({ newValue: objectProperty }) => {
                    const text = classProperties.displayStringOf( objectProperty )
                    classProperties.getChild({ id: 'selectedProp' }).setValue(text)
                },
            })

            this.value({ id: 'selectedProp' })

        })

    }

    defineApplicationCommands(classProperties) {
        this.commands({ id: 'classPropertiesCommands' }, function() {

            this.command({
                id: 'browseSelectedProperty',
                enabledIf: function() {
                    return classProperties.getSelectedPropertyValue() != undefined
                },
                whenActioned: function() {
                    const selectedPropertyValue = classProperties.getSelectedPropertyValue()
                    Sirens.browseObject( selectedPropertyValue )
                }
            })

        })
    }

    /// Actions

    setBrowsedObject(object) {
        this.setObject( object )
    }

    updatePropertyChoices() {
        const properties = this.getChild({ id: 'properties' })

        const selectedClass = this.getObject()

        const selectedClassProperties = this._getPropsOf( selectedClass )

        properties.setChoices( selectedClassProperties )
    }

    /// Querying

    getSelectedPropertyValue() {
        const objectProperty = this.getChild({ id: 'properties' }).getSelectionValue()

        if( ! objectProperty ) { return null }

        return objectProperty.getValue()
    }

    _getPropsOf(object) {
        const showInheritedModel = this.getChild({ id: 'showInheritedProps' }).getValue()
        const showFunctionsModel = this.getChild({ id: 'showFunctionProps' }).getValue()
        const showPropsModel = this.getChild({ id: 'showNonFunctionProps' }).getValue()

        let props = []

        let currentPrototype = object

        while(currentPrototype !== null && currentPrototype !== undefined) {
            const ownedProps = this._getOwnedPropsOf(currentPrototype)

            props = props.concat(ownedProps)

            if(showInheritedModel === false) {
                break
            }

            currentPrototype = Object.getPrototypeOf(currentPrototype)
        }

        if(showFunctionsModel === false) {
            props = props.filter( (prop) => { return ! prop.isFunction() })
        }

        if(showPropsModel === false) {
            props = props.filter( (prop) => { return prop.isFunction() })
        }

        return props.sort( (prop1, prop2) => {
            return prop1.getKey() >= prop2.getKey()
        })
    }

    _getOwnedPropsOf(object) {
        const propertyNames = Object.getOwnPropertyNames(object)

        return propertyNames.map( (key) => {
            const objectProperty = ObjectProperty.new({
                key: key,
                value: object[key]
            })

            return objectProperty
        })
    }

    /// Displaying

    displayStringOf(objectProperty) {
        if( objectProperty === null ) { return '' }

        if(objectProperty.isFunction()) {
            return objectProperty.getValue().toString()
        } else {
            try {
                return JSON.stringify(objectProperty.getValue())
            } catch(error) {
                return objectProperty.getValue().toString()
            }
        }
    }
}

module.exports = Classification.define(ClassPropertiesFlow)
