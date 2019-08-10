const View = require('./View')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class CheckBoxView extends View {
    /// Initializing

    constructor({onClicked: onClickedBlock}) {
        super()

        this.onClickedBlock = onClickedBlock
    }

    initializeHandles() {
        this.mainHandle = new Gtk.CheckButton({label: ''})
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
        return this.mainHandle.getActive()
    }

    /// Events

    subscribeToGUISignals() {
        this.mainHandle.on('clicked', this.onClick.bind(this))
    }

    onClick() {
        this.onClickedBlock()
    }
}

module.exports = CheckBoxView