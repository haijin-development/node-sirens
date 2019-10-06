const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImage = require ('./GtkImage')

class StockIconView {
    /// Definition

    static definition() {
        this.instanceVariables = ['image', 'iconName', 'size']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ iconName: iconName, size: size }) {

        this.iconName = iconName
        this.size = size

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.image = Gtk.Image.newFromIconName( this.iconName, this.size )
    }

    /// Accessing

    getMainHandle() {
        return this.image
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(StockIconView)