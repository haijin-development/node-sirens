const ChoiceModel = require('../../models/ChoiceModel')
const ValueModel = require('../../models/ValueModel')
const PropertyModel = require('./PropertyModel')

class PrototypesBrowserModel {
    /// Initializing

    constructor(inspectedObject) {
        this.inspectedObject = inspectedObject

        const prototypes = this._getPrototypesChainOf(this.inspectedObject)

        this.objectPrototypesList = new ChoiceModel({
            choices: prototypes,
            selection: this.inspectedObject,
        })

        this.selectedPrototypeProps = new ChoiceModel({
            choices: [],
            selection: null,
        })

        this.selectedPropDescription = new ValueModel()

        this.showInherited = new ValueModel({value: false})
        this.showFunctions = new ValueModel({value: true})
        this.showProps = new ValueModel({value: false})

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

    getshowInheritedModel() {
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
        return this.getSelectedProp().getValue()
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
            return new PropertyModel({
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

        const text = selectedProp === undefined ? '' : selectedProp.displayString()

        this.selectedPropDescription.setValue(text)
    }
}

module.exports = PrototypesBrowserModel