const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class MenuItemView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuItem', 'label', 'enabled', 'action']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ label: label, enabled: enabled, action: action }) {
        this.label = label
        this.enabled = enabled === undefined ? true : enabled
        this.action = action

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.menuItem = new Gtk.MenuItem({ label: this.label })

        this.menuItem.setSensitive( this.enabled )

        this.menuItem.on('activate', this.onAction.bind(this) )

        this.menuItem.show()
    }

    /// Querying

    getMainHandle() {
        return this.menuItem
    }

    /// Events

    subscribeToGUISignals() {
    }

    onAction() {
        this.action()
    }
}



module.exports = Classification.define(MenuItemView)