const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class ToolBarView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolBar' ]
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initializeHandles() {
        this.toolBar = new Gtk.Toolbar()
    }

    /// Querying

    getMainHandle() {
        return this.toolBar
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(ToolBarView)