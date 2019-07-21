const Gtk = require('node-gtk').require('Gtk', '3.0')
const View = require('./View')

class LabelView extends View {

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.Label()
    }

    /// Accessing

    setText(text) {
        this.mainHandle.label = text
    }

    getText() {
        return this.mainHandle.label
    }

    /// Events

    subscribeToGUISignals(props) {
    }
}

module.exports = LabelView