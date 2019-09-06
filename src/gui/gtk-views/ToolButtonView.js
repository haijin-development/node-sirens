const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class ToolButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolButton', 'icon', 'label', 'enabled', 'action', 'tooltip']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ icon: icon, label: label, tooltip: tooltip, enabled: enabled, action: action }) {
        this.icon = icon
        this.label = label !== undefined ? label : ''
        this.enabled = enabled === undefined ? true : enabled
        this.action = action
        this.tooltip = tooltip !== undefined ? tooltip : ''

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.toolButton = new Gtk.ToolButton()

        this.toolButton.setStockId( this.icon )

        this.toolButton.setLabel( this.label )

        this.toolButton.setTooltipText( this.tooltip )

        this.toolButton.setSensitive( this.enabled )

        this.toolButton.on('clicked', this.onAction.bind(this) )

        this.toolButton.show()
    }

    /// Querying

    getMainHandle() {
        return this.toolButton
    }

    /// Events

    subscribeToGUISignals() {
    }

    onAction() {
        this.action()
    }
}



module.exports = Classification.define(ToolButtonView)