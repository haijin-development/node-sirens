const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImageBuilder = require('./constants/GtkImageBuilder')

class ToolButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolButton', 'imageProps', 'label', 'enabled', 'action', 'tooltip']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ imageProps: imageProps, label: label, tooltip: tooltip, enabled: enabled, action: action }) {
        this.imageProps = imageProps
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
        {
            const image = GtkImageBuilder.build( this.imageProps )

            this.toolButton.setLabelWidget( image )
        }

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