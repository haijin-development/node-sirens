const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

const RadioButtonView = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle']
        this.assumptions = [GtkWidget]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat([ 'text' ])
        })
    }

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.RadioButton()
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

    setValue(boolean) {
        this.mainHandle.setActive(boolean)
    }

    getValue() {
        return this.mainHandle.active
    }


    /// Events

    subscribeToGUISignals() {
    }

    onAddedToParentView(parentView) {
        const length = parentView.getChildViews().length

        const previousRadioButtonView = parentView.getChildViews()[length - 2]

        if(previousRadioButtonView !== undefined) {
            this.mainHandle.group = previousRadioButtonView.getMainHandle()
        }
    }
})

module.exports = RadioButtonView