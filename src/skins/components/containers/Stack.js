const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const StackView = require('../../gtk-views/StackView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Stack {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        return StackView.new({ orientation: this.getProps().orientation })
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Stack)