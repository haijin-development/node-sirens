const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ToolButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolButton', 'icon', 'label', 'enabled', 'action', 'tooltip']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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
        this.setToolButtonHandle( new Gtk.ToolButton() )

        this.initializeMainHandle()
    }

    setToolButtonHandle(toolButtonHandle) {
        this.toolButton = toolButtonHandle
    }

    initializeMainHandle() {
        this.toolButton.setStockId( this.icon )

        this.toolButton.setLabel( this.label )

        this.toolButton.setTooltipText( this.tooltip )

        this.toolButton.setSensitive( this.enabled )

        this.toolButton.on('clicked', this.handleClicked.bind(this) )

        this.toolButton.show()
    }

    /// Querying

    getMainHandle() {
        return this.toolButton
    }

    /// Events

    subscribeToGUISignals() {
    }

    handleClicked() {
        this.action()
    }
}



module.exports = Classification.define(ToolButtonView)