const Classification = require('../../o-language/classifications/Classification')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')

class PrototypesBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'inspectedObject',
            'objectPrototypesListModel', 'selectedPrototypePropsModel', 'selectedPropDescriptionModel',
            'showInheritedModel', 'showFunctionsModel', 'showPropsModel',
        ]
    }

    /// Initializing

    initialize({ object: inspectedObject }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.inspectedObject = inspectedObject

        const prototypes = this._getPrototypesChainOf( this.inspectedObject )

        this.objectPrototypesListModel = ChoiceModel.new({
            choices: prototypes,
            selection: this.inspectedObject,
        })

        this.selectedPrototypePropsModel = ChoiceModel.new({
            choices: [],
            selection: null,
        })

        this.selectedPropDescriptionModel = ValueModel.new()

        this.showInheritedModel = ValueModel.new({ value: false })
        this.showFunctionsModel = ValueModel.new({ value: true })
        this.showPropsModel = ValueModel.new({ value: false })

        this.connectModels()
    }

    connectModels() {
        this.objectPrototypesListModel.onSelectionChanged(
            this.updatePrototypeProps.bind(this)
        )

        this.selectedPrototypePropsModel.onSelectionChanged(
            this.onPropSelectionChanged.bind(this)
        )

        this.showInheritedModel.onValueChanged(
            this.updatePrototypeProps.bind(this)
        )

        this.showFunctionsModel.onValueChanged(
            this.updatePrototypeProps.bind(this)
        )

        this.showPropsModel.onValueChanged(
            this.updatePrototypeProps.bind(this)
        )
    }

    /// Accessing

    getPrototypesModel() {
        return this.objectPrototypesListModel
    }

    getSelectedPrototypePropsModel() {
        return this.selectedPrototypePropsModel
    }

    getSelectedPropDescriptionModel() {
        return this.selectedPropDescriptionModel
    }

    getShowInheritedModel() {
        return this.showInheritedModel
    }

    getShowFunctionsModel() {
        return this.showFunctionsModel
    }

    getShowPropsModel() {
        return this.showPropsModel
    }

    getSelectedPrototype() {
        return this.objectPrototypesListModel.getSelectionValue()
    }

    getSelectedProp() {
        return this.selectedPrototypePropsModel.getSelectionValue()
    }

    getSelectedPropValue() {
        const selectedProp = this.getSelectedProp()

        if(selectedProp) {
            return selectedProp.getValue()
        }

        return undefined
    }

    _getPrototypesChainOf(object) {
        const prototypes = []

        let currentPrototype = object

        while(currentPrototype !== null && currentPrototype !== undefined) {
            prototypes.push(currentPrototype)

            currentPrototype = Object.getPrototypeOf(currentPrototype)
        }

        return prototypes.reverse()
    }

    _getOwnedPropsOf(object) {
        const propertyNames = Object.getOwnPropertyNames(object)

        return propertyNames.map( (key) => {
            return ObjectProperty.new({
                key: key,
                value: object[key]
            })
        })
    }

    _getPropsOf(object) {
        const showInheritedModel = this.showInheritedModel.getValue()
        const showFunctionsModel = this.showFunctionsModel.getValue()
        const showPropsModel = this.showPropsModel.getValue()

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

    /// Events

    updatePrototypeProps() {
        const selectedObject = this.getSelectedPrototype()

        const props = this._getPropsOf(selectedObject)

        this.selectedPrototypePropsModel.setChoices(props)
    }

    onPropSelectionChanged() {
        const selectedProp = this.getSelectedProp()

        const text = this.displayStringOf( selectedProp )

        this.selectedPropDescriptionModel.setValue(text)
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

module.exports = Classification.define(PrototypesBrowserModel)
