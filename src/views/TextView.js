const Gtk = require('node-gtk').require('Gtk', '3.0')
const View = require('./View')
const WrapModes = require('./WrapModes')
const MenuView = require('./MenuView')


class TextView extends View {
    /// Styles

    static acceptedStyles() {
        return super.acceptedStyles().concat(['wrapMode'])
    }

    /// Initializing

    constructor({onTextChanged: onTextChangedBlock})
    {
        super()

        this.onTextChanged = onTextChangedBlock
    }

    initializeHandles() {
        this.textView = new Gtk.TextView()

        this.mainHandle = new Gtk.ScrolledWindow()

        this.mainHandle.setPolicy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.ALWAYS)

        this.mainHandle.add(this.textView)
    }

    /// Accessing

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
        this.textView.on('populate-popup', (menu) => {
            console.log('To do: implement GtkMenu wrapper.')
        })

        this.textView.getBuffer().on('changed', () => {
            this.onTextChanged(this.getText())
        })
    }

    /// Styles

    setWrapMode(mode) {
        this.textView.setWrapMode(WrapModes[mode])
    }

    getWrapMode() {
        const gtkConstant = this.textView.getWrapMode()

        const mode = Object.keys(WrapModes).find( (key) => {
            return gtkConstant === WrapModes[key]
        })

        return mode
    }
}

module.exports = TextView