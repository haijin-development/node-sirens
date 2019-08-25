const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWrapModes = require('./GtkWrapModes')
const MenuView = require('./MenuView')

const TextView = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainHandle', 'onTextChanged', 'textView']
        this.assumptions = [GtkWidget]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(['wrapMode'])
        })
    }

    /// Initializing

    initialize({ onTextChanged: onTextChangedBlock }) {
        this.onTextChanged = onTextChangedBlock

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.textView = new Gtk.TextView()

        this.mainHandle = new Gtk.ScrolledWindow()

        this.mainHandle.setPolicy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.ALWAYS)

        this.mainHandle.add(this.textView)
    }

    /// Accessing

    getMainHandle() {
        return this.mainHandle
    }

    clearText() {
        this.setText('')
    }

    setText(text) {
        if(text === undefined) {
            text = ''
        }

        this.textView.getBuffer().text = text
    }

    getText() {
        return this.textView.getBuffer().text
    }

    getSelectedText() {
        const [hasSelection, iterFrom, iterTo] = this.textView.buffer.getSelectionBounds()

        if(hasSelection === false) {
            return ''
        }

        return this.textView.buffer.getText(iterFrom, iterTo, false)
    }

    /// Events

    subscribeToGUISignals() {
        this.textView.on('populate-popup', (menuHandle) => {
            const menu = MenuView.newFromGtkWidget(menuHandle)

            this.populatePopupMenu({ menu: menu })
        })

        const onTextChanged = this.onTextChanged

        this.textView.getBuffer().on('changed', () => {
            onTextChanged( this.getText() )
        })
    }

    /// Styles

    setWrapMode(mode) {
        this.textView.setWrapMode(GtkWrapModes[mode])
    }

    getWrapMode() {
        const gtkConstant = this.textView.getWrapMode()

        const mode = Object.keys(GtkWrapModes).find( (key) => {
            return gtkConstant === GtkWrapModes[key]
        })

        return mode
    }
})

module.exports = TextView