const Classification = require('../../../O').Classification
const CheckBox = require('./CheckBox')
const CheckBoxProtocol_Implementation = require('../../protocols/CheckBoxProtocol_Implementation')

class SingleSelectionCheckBox {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [CheckBox]
        this.implements = [CheckBoxProtocol_Implementation]
    }

    /// Initializing

    defaultModelValue() {
        return false
    }

    /// Synchronizing

    getSelectionFromModel() {
        return this.getModel().getValue()
    }

    setValueFromViewToModel({ newValue: viewValue }) {
        this.getModel().setValue( viewValue )
    }
}

module.exports = Classification.define(SingleSelectionCheckBox)