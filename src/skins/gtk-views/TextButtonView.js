const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImageBuilder = require('./constants/GtkImageBuilder')

class TextButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = ['button', 'image', 'onClickedClosure']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ onClicked: onClickedClosure, image: image }) {
        this.onClickedClosure = onClickedClosure
        this.image = image

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.button = new Gtk.Button({ label: '' })

        if( this.image !== undefined ) {
            const imageHandle = GtkImageBuilder.build( this.image )

            this.button.setImage( imageHandle )
            this.button.setAlwaysShowImage( true )
        }
    }

    /// Accessing

    getMainHandle() {
        return this.button
    }

    setText(text) {
        this.button.setLabel( text )
    }

    getText() {
        return this.button.getLabel()
    }

    /// Events

    subscribeToGUISignals() {
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'clicked',
            from: this.button,
            do: this.handleClick,
            with: this,
        })
    }

    handleClick() {
        this.onClickedClosure()
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

module.exports = Classification.define(TextButtonView)
