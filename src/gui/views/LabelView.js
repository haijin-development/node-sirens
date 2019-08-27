const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class LabelView {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.Label()
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    setText(text) {
        this.getMainHandle().label = text
    }

    getText() {
        return this.getMainHandle().label
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(LabelView)