const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const StackView = require('../../views/StackView')

class Stack {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return StackView.new({ orientation: this.getProps().orientation })
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Stack)