const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuItemSeparatorView {
    /// Definition

    static definition() {
        this.instanceVariables = ['separatorMenuItem']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initializeHandles() {
        this.separatorMenuItem = new Gtk.SeparatorMenuItem()

        this.separatorMenuItem.show()
    }

    /// Querying

    getMainHandle() {
        return this.separatorMenuItem
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



module.exports = Classification.define(MenuItemSeparatorView)