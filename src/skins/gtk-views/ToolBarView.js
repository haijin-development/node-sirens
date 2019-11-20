const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ToolBarView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolBar' ]
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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