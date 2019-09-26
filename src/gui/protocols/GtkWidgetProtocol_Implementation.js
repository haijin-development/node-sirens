const Protocol = require('../../o-language/classifications/Protocol')
const GtkViewProtocol_Implementation = require('./GtkViewProtocol_Implementation')

class GtkWidgetProtocol_Implementation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [GtkViewProtocol_Implementation]
    }

    subscribeToGUISignals() {}
}

module.exports = Protocol.define(GtkWidgetProtocol_Implementation)