const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImageBuilder = require('./constants/GtkImageBuilder')

class ToolButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'toolButton', 'imageProps', 'label', 'action', 'tooltip']
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

    initialize({ imageProps: imageProps, label: label, tooltip: tooltip, action: action }) {
        if( typeof(action) !== 'function' ) { throw new Error(`ToolButtonView invalid action callback: ${action}.`) }

        this.imageProps = imageProps
        this.label = label !== undefined ? label : ''
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

        this.toolButton.show()
    }

    /// Properties

    setEnabled(boolean) {
        if( boolean === null || boolean === undefined ) { boolean = false }

        this.toolButton.setSensitive( boolean )
    }

    /// Querying

    getMainHandle() {
        return this.toolButton
    }

    /// Events

    subscribeToGUISignals() {
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'clicked',
            from: this.toolButton,
            do: this.handleClicked,
            with: this,
        })
    }

    handleClicked() {
        this.action()
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



module.exports = Classification.define(ToolButtonView)