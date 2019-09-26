const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class CheckBoxView {
    /// Definition

    static definition() {
        this.instanceVariables = ['checkButton', 'onClickedBlock']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ onClicked: onClickedBlock }) {
        this.onClickedBlock = onClickedBlock

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.checkButton = new Gtk.CheckButton({label: ''})
    }

    /// Accessing

    getMainHandle() {
        return this.checkButton
    }

    setText(text) {
        this.checkButton.label = text
    }

    getText() {
        return this.checkButton.label
    }

    setValue(boolean) {
        this.checkButton.setActive(boolean)
    }

    getValue() {
        return this.checkButton.getActive()
    }

    /// Events

    subscribeToGUISignals() {
        this.checkButton.on( 'clicked', this.handleClick.bind(this) )
    }

    handleClick() {
        this.onClickedBlock()
    }
}

module.exports = Classification.define(CheckBoxView)