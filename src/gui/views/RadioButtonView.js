const View = require('./View')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class RadioButtonView extends View {
    /// Styles

    static acceptedStyles() {
        return super.acceptedStyles().concat(['text'])
    }

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.RadioButton()
    }

    /// Accessing

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
        const length = parentView.childViews.length

        const previousRadioButtonView = parentView.childViews[length - 2]

        if(previousRadioButtonView !== undefined) {
            this.mainHandle.group = previousRadioButtonView.getMainHandle()
        }
    }

    subscribeToGUISignals(props) {
    }
}

module.exports = RadioButtonView