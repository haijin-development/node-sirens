const Classification = require('../../o-language/classifications/Classification')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')

const PrototypesBrowserModel = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'inspectedObject',
            'objectPrototypesList', 'selectedPrototypeProps', 'selectedPropDescription',
            'showInherited', 'showFunctions', 'showProps',
        ]
    }

    /// Initializing

    initialize({ object: inspectedObject }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.inspectedObject = inspectedObject

        const prototypes = this._getPrototypesChainOf( this.inspectedObject )

        this.objectPrototypesList = ChoiceModel.new({
            choices: prototypes,
            selection: this.inspectedObject,
        })

        this.selectedPrototypeProps = ChoiceModel.new({
            choices: [],
            selection: null,
        })

        this.selectedPropDescription = ValueModel.new()

        this.showInherited = ValueModel.new({ value: false })
        this.showFunctions = ValueModel.new({ value: true })
        this.showProps = ValueModel.new({ value: false })

        this.connectModels()
    }

    connectModels() {
        this.objectPrototypesList.getValue().on(
            'value-changed',
            this.updatePrototypeProps.bind(this)
        )

        this.selectedPrototypeProps.getValue().on(
            'value-changed',
            this.onPropSelectionChanged.bind(this)
        )

        this.showInherited.on(
            'value-changed',
            this.updatePrototypeProps.bind(this)
        )

        this.showFunctions.on(
            'value-changed',
            this.updatePrototypeProps.bind(this)
        )

        this.showProps.on(
            'value-changed',
            this.updatePrototypeProps.bind(this)
        )
    }

    /// Accessing

    getPrototypesModel() {
        return this.objectPrototypesList
    }

    getSelectedPrototypePropsModel() {
        return this.selectedPrototypeProps
    }

    getSelectedPropDescriptionModel() {
        return this.selectedPropDescription
    }

    getShowInheritedModel() {
        return this.showInherited
    }

    getShowFunctionsModel() {
        return this.showFunctions
    }

    getShowPropsModel() {
        return this.showProps
    }

    getSelectedPrototype() {
        return this.objectPrototypesList.getSelection()
    }

    getSelectedProp() {
        return this.selectedPrototypeProps.getSelection()
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
        const showInherited = this.showInherited.getValue()
        const showFunctions = this.showFunctions.getValue()
        const showProps = this.showProps.getValue()

        let props = []

        let currentPrototype = object

        while(currentPrototype !== null && currentPrototype !== undefined) {
            const ownedProps = this._getOwnedPropsOf(currentPrototype)

            props = props.concat(ownedProps)

            if(showInherited === false) {
                break
            }

            currentPrototype = Object.getPrototypeOf(currentPrototype)
        }

        if(showFunctions === false) {
            props = props.filter( (prop) => { return ! prop.isFunction() })
        }

        if(showProps === false) {
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

        this.selectedPrototypeProps.setChoices(props)
    }

    onPropSelectionChanged() {
        const selectedProp = this.getSelectedProp()

        const text = selectedProp === undefined ? '' : this.displayStringOf(selectedProp)

        this.selectedPropDescription.setValue(text)
    }

    /// Displaying

    displayStringOf(objectProperty) {
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
})

module.exports = PrototypesBrowserModel