const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ObjectProperty = require('../../objects/ObjectProperty')
const Sirens = require('../../../Sirens')

class ClassPropertiesFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    buildWith(flow) {
        flow.main({ id: 'playground' }, function(classProperties) {

            this.defineFlowCommandsIn({ method: classProperties.flowCommands })

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
                    classProperties.getChildFlow({ id: 'selectedProp' }).setValue(text)
                },
            })

            this.value({ id: 'selectedProp' })

        })

    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {
            this.command({
                id: 'browseSelectedProperty',
                enabledIf: function() {
                    return thisFlow.getSelectedPropertyValue() != undefined
                },
                whenActioned: thisFlow.browseSelectedProperty.bind(thisFlow),
            })
        })
    }

    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getSelectedPropertyValue()

        Sirens.browseObject( selectedPropertyValue )        
    }

    setBrowsedObject(object) {
        this.setValue( object )
    }

    updatePropertyChoices() {
        const properties = this.getChildFlow({ id: 'properties' })

        const selectedClass = this.getValue()

        const selectedClassProperties = this._getPropsOf( selectedClass )

        properties.setChoices( selectedClassProperties )
    }

    /// Querying

    getSelectedPropertyValue() {
        const objectProperty = this.getChildFlow({ id: 'properties' }).getSelection()

        if( ! objectProperty ) { return null }

        return objectProperty.getValue()
    }

    _getPropsOf(object) {
        const showInheritedModel = this.getChildFlow({ id: 'showInheritedProps' }).getValue()
        const showFunctionsModel = this.getChildFlow({ id: 'showFunctionProps' }).getValue()
        const showPropsModel = this.getChildFlow({ id: 'showNonFunctionProps' }).getValue()

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
