const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class ToolBarSeparatorView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'separator']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initializeHandles() {
        this.separator = new Gtk.SeparatorToolItem()

        this.separator.show()
    }

    /// Querying

    getMainHandle() {
        return this.separator
    }

    /// Events

    subscribeToGUISignals() {
    }

    onAction() {
        this.action()
    }
}



module.exports = Classification.define(ToolBarSeparatorView)