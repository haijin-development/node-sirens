const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ContainerView = require('../../gtk-views/ContainerView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Container {

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
        return ContainerView.new()
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Container)