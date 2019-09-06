const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class TextButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle', 'onClickedBlock']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({onClicked: onClickedBlock}) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.onClickedBlock = onClickedBlock

        this.initializeHandles()
    }

    initializeHandles() {
        this.mainHandle = new Gtk.Button({label: ''})
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    setText(text) {
        this.mainHandle.label = text
    }

    getText() {
        return this.mainHandle.label
    }

    /// Events

    subscribeToGUISignals(props) {
        this.mainHandle.on('clicked', this.onClick.bind(this))
    }

    onClick() {
        this.onClickedBlock()
    }
}

module.exports = Classification.define(TextButtonView)
