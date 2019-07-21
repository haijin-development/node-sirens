const View = require('./View')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class TextButtonView extends View {
    /// Initializing

    constructor({onClicked: onClickedBlock}) {
        super()

        this.onClickedBlock = onClickedBlock
    }

    initializeHandles() {
        this.mainHandle = new Gtk.Button({label: ''})
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
        this.mainHandle.on('clicked', this.onClick.bind(this))
    }

    onClick() {
        this.onClickedBlock()
    }
}

module.exports = TextButtonView