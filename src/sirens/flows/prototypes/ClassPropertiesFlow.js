const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const ObjectProperty = require('../../objects/ObjectProperty')

class ClassPropertiesFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    buildWith(flow) {
        flow.main({ id: 'playground' }, function(thisFlow) {

            this.command({
                id: 'browseSelectedProperty',
                enabledIf: function() {
                    return thisFlow.getSelectedPropertyValue() != undefined
                },
                whenActioned: thisFlow.browseSelectedProperty.bind(thisFlow),
            })

            this.whenObjectChanges( ({ newValue: aClass }) => {
                thisFlow.updatePropertyChoices()
            })

            this.toggle({
                id: 'showInheritedProps',
                whenValueChanges: () => { thisFlow.updatePropertyChoices() },
            })
            
            this.toggle({
                id: 'showFunctionProps',
                value: true,
                whenValueChanges: () => { thisFlow.updatePropertyChoices() },
            })

            this.toggle({
                id: 'showNonFunctionProps',
                whenValueChanges: () => { thisFlow.updatePropertyChoices() },
            })

            this.choice({
                id: 'properties',
                choices: [],
                whenSelectionChanges: ({ newValue: objectProperty }) => {
                    const text = thisFlow.displayStringOf( objectProperty )
                    thisFlow.getChildFlow({ id: 'selectedProp' }).setValue(text)
                },
            })

            this.value({ id: 'selectedProp' })

        })

    }

    /// Actions

    browseSelectedProperty() {
        const selectedPropertyValue = this.getSelectedPropertyValue()

        require('../../../Sirens').browseObject( selectedPropertyValue )        
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
            const objectProperty = this.mainNamespace().ObjectProperty.new({
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

    mainNamespace() {
        return this.bubbleUp({ command: 'mainNamespace' })
    }
}

module.exports = Classification.define(ClassPropertiesFlow)
