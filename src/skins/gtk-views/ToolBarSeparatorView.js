const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ToolBarSeparatorView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'separator']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(ToolBarSeparatorView)