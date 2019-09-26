const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class TextButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = ['button', 'onClickedClosure']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ onClicked: onClickedClosure }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.onClickedClosure = onClickedClosure

        this.initializeHandles()
    }

    initializeHandles() {
        this.button = new Gtk.Button({label: ''})
    }

    /// Accessing

    getMainHandle() {
        return this.button
    }

    setText(text) {
        this.button.label = text
    }

    getText() {
        return this.button.label
    }

    /// Events

    subscribeToGUISignals(props) {
        this.button.on('clicked', this.handleClick.bind(this))
    }

    handleClick() {
        this.onClickedClosure()
    }
}

module.exports = Classification.define(TextButtonView)
