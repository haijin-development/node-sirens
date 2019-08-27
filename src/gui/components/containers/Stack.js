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

    addComponent(component) {
        component.getView().packExpand = component.getProps().packExpand
        component.getView().packFill = component.getProps().packFill
        component.getView().packPadding = component.getProps().packPadding

        this.previousClassificationDo( () => {
            this.addComponent( component )
        })
    }
}

module.exports = Classification.define(Stack)