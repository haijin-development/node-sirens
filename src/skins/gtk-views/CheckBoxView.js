const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class CheckBoxView {
    /// Definition

    static definition() {
        this.instanceVariables = ['checkButton', 'onClickedClosure']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ onClicked: onClickedClosure }) {
        this.onClickedClosure = onClickedClosure

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.checkButton = new Gtk.CheckButton({ label: '' })
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
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'clicked',
            from: this.checkButton,
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

module.exports = Classification.define(CheckBoxView)