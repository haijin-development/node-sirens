const Classification = require('../../../O').Classification
const CheckBox = require('./CheckBox')
const CheckBoxProtocol_Implementation = require('../../protocols/CheckBoxProtocol_Implementation')

class MultipleSelectionCheckBox {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [CheckBox]
        this.implements = [CheckBoxProtocol_Implementation]
    }

    /// Initializing

    defaultModelValue() {
        return []
    }

    initializeProps() {
        this.previousClassificationDo( () => {
            this.initializeProps()
        })

        if( this.getItem() === undefined ) {
            throw new Error(`A MultipleSelectionCheckBox expects an item defined.`)
        }
    }

    /// Synchronizing

    getItem() {
        return this.getProps().item
    }

    getSelectionFromModel() {
        const model = this.getModel()

        if( ! model ) { return false }

        const allItems = model.getValue()

        return allItems.includes( this.getItem() )
    }

    setValueFromViewToModel({ newValue: viewValue }) {
        const model = this.getModel()

        if( model === null ) { return }

        const allItems = model.getValue()

        const thisItem = this.getItem()

        const itemIsIncluded = allItems.includes( thisItem )

        let newItems

        if( viewValue === true ) {

            if( itemIsIncluded === true ) { return }

            newItems = allItems.concat( [thisItem] )

        } else {

            if( itemIsIncluded === false ) { return }

            newItems = allItems.filter( (eachItem) => {
                return eachItem != thisItem
            })

        }

        this.getModel().setValue( newItems )
    }
}

module.exports = Classification.define(MultipleSelectionCheckBox)