const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuItemView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuItem', 'label', 'enabled', 'action']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ label: label, enabled: enabled, action: action }) {
        if( typeof( action ) !== 'function' ) {
            throw new Error(`Menu action '${label}' must be a function, got ${action}.`)
        }

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

        this.menuItem.on('activate', this.handleActivate.bind(this) )

        this.menuItem.show()
    }

    /// Querying

    getMainHandle() {
        return this.menuItem
    }

    /// Events

    subscribeToGUISignals() {
    }

    handleActivate() {
        this.action()
    }
}



module.exports = Classification.define(MenuItemView)