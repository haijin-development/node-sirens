const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

class CheckBoxView {
    /// Instantiating

    static new({ onClicked: onClickedBlock }) {
        return OInstance.new().yourself( (checkbox) => {
            checkbox
                .behaveAs(this)
                .initialize({ onClicked: onClickedBlock })
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle', 'onClickedBlock']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ onClicked: onClickedBlock }) {
        this.onClickedBlock = onClickedBlock

        this.initializeHandles()

        this.subscribeToGUISignals()
    }

    initializeHandles() {
        this.mainHandle = new Gtk.CheckButton({label: ''})
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