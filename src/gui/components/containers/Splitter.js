const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const SplitterView = require('../../views/SplitterView')

class Splitter {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return SplitterView.new({ orientation: this.getProps().orientation })
    }

    synchronizeViewFromModel() {
    }

    addComponent(component) {
        component.getView().splitProportion = component.getProps().splitProportion

        this.previousClassificationDo( () => {
            this.addComponent(component)
        })
    }
}

module.exports = Classification.define(Splitter)