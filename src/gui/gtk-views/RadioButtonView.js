const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class RadioButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = ['radioButton']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([ 'text' ])
        })
    }

    /// Initializing

    initializeHandles() {
        this.radioButton = new Gtk.RadioButton()
    }

    /// Accessing

    getMainHandle() {
        return this.radioButton
    }

    setText(text) {
        this.radioButton.label = text
    }

    getText() {
        return this.radioButton.label
    }

    setValue(boolean) {
        this.radioButton.setActive(boolean)
    }

    getValue() {
        return this.radioButton.active
    }


    /// Events

    subscribeToGUISignals() {
    }

    connectToParentHandleOwnerView() {
        this.previousClassificationDo( () => {
            this.connectToParentHandleOwnerView()
        })

        const radioButtonSiblings = this.radioButton.getParent().getChildren()

        const siblingsCount = radioButtonSiblings.length

        if(siblingsCount > 1) {
            const previousRadioButtonHandle = radioButtonSiblings[siblingsCount - 2]

            this.radioButton.group = previousRadioButtonHandle
        }
    }
}

module.exports = Classification.define(RadioButtonView)
