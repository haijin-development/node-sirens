const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuBarView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuBar' ]
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initializeHandles() {
        this.menuBar = new Gtk.MenuBar()
    }

    /// Querying

    getMainHandle() {
        return this.menuBar
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(MenuBarView)