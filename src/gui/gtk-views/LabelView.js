const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class LabelView {
    /// Definition

    static definition() {
        this.instanceVariables = ['labelView']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initializeHandles() {
        this.labelView = new Gtk.Label()

        this.labelView.setSelectable( true )
    }

    /// Accessing

    getMainHandle() {
        return this.labelView
    }

    setText(text) {
        this.labelView.label = text
    }

    getText() {
        return this.labelView.label
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(LabelView)