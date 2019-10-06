const Classification = require('../../../o-language/classifications/Classification')
const ComponentBehaviour = require('../ComponentBehaviour')
const TabPageView = require('../../gtk-views/TabPageView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class TabPage {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentBehaviour]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        return TabPageView.new()
    }

    getMainComponent() {
        throw Error(`The ${this.constructor.name} has no main child component.`)
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(TabPage)