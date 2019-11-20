const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuItemView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menuItem', 'label', 'action']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([
                'enabled',
            ])
        })
    }

    /// Initializing

    initialize({ label: label, action: action }) {
        if( typeof( action ) !== 'function' ) {
            throw new Error(`Menu action '${label}' must be a function, got ${action}.`)
        }

        this.label = label
        this.action = action

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.menuItem = new Gtk.MenuItem({ label: this.label })

        this.menuItem.on('activate', this.handleActivate.bind(this) )

        this.menuItem.show()
    }

    /// Properties

    setEnabled(boolean) {
        this.menuItem.setSensitive( boolean )
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