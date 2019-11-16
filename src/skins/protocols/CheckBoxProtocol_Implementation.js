const Protocol = require('../../O').Protocol
const ComponentBehaviourProtocol_Implementation = require('./ComponentBehaviourProtocol_Implementation')

class CheckBoxProtocol_Implementation {
    /// Definition

    static definition() {
        this.assumes = [ComponentBehaviourProtocol_Implementation]
    }
    
    defaultModelValue() {}

    getSelectionFromModel() {}

    setValueFromViewToModel({ newValue: viewValue }) {}
}

module.exports = Protocol.define(CheckBoxProtocol_Implementation)