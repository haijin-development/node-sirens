const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuItemSeparatorView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'separatorMenuItem']
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
}



module.exports = Classification.define(MenuItemSeparatorView)