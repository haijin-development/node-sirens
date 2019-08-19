const Gtk = require('node-gtk').require('Gtk', '3.0')
const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')

class RadioButtonView {
    /// Instantiating

    static new() {
        return OInstance.new().yourself( (checkbox) => {
            checkbox
                .behaveAs(this)
                .initializeHandles()
        })
    }

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

    onAddedToParentView(parentView) {
        const length = parentView.getChildViews().length

        const previousRadioButtonView = parentView.getChildViews()[length - 2]

        if(previousRadioButtonView !== undefined) {
            this.mainHandle.group = previousRadioButtonView.getMainHandle()
        }
    }
}

module.exports = RadioButtonView