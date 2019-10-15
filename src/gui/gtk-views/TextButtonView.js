const Classification = require('../../o-language/classifications/Classification')
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
        this.button.on( 'clicked', this.handleClick.bind(this) )
    }

    handleClick() {
        this.onClickedClosure()
    }
}

module.exports = Classification.define(TextButtonView)
