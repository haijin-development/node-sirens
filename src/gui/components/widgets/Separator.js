const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const SeparatorView = require('../../gtk-views/SeparatorView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Separator {

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
        const orientation = this.getProps().orientation

        return SeparatorView.new({ orientation: orientation })
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Separator)