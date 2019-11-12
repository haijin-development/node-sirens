const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class SeparatorView {
    /// Definition

    static definition() {
        this.instanceVariables = ['separator']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ orientation: orientation }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(orientation == 'horizontal') {
            this.separator = new Gtk.HSeparator()
        } else {
            this.separator = new Gtk.VSeparator()
        }
    }

    getMainHandle() {
        return this.separator
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(SeparatorView)
