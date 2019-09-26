const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const SplitterView = require('../../gtk-views/SplitterView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Splitter {
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
        return SplitterView.new({ orientation: this.getProps().orientation })
    }

    synchronizeViewFromModel() {
    }

    addChildComponent(component) {
        component.getView().splitProportion = component.getProps().splitProportion

        this.previousClassificationDo( () => {
            this.addChildComponent(component)
        })
    }
}

module.exports = Classification.define(Splitter)