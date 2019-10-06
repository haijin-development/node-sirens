const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const StockIconView = require('../../gtk-views/StockIconView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class StockIcon {
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
        const iconName = this.getProps().name
        const size = this.getProps().size

        return StockIconView.new({
            iconName: iconName,
            size: size,
        })
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(StockIcon)