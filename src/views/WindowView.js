const Gtk = require('node-gtk').require('Gtk', '3.0')
const Sirens = require('../Sirens')
const View = require('./View')

class WindowView extends View {
    /// Styles

    static acceptedStyles() {
        return super.acceptedStyles().concat(['title'])
    }

    /// Initializing

    initializeHandles() {
        this.mainHandle = new Gtk.Window()

        Sirens.registerWindow()

        this.mainHandle.on('delete-event', () => {
            return false
        })

        this.mainHandle.on('destroy', () => {
            Sirens.unregisterWindow()
        })
    }

    open() {
        this.mainHandle.showAll()
    }

    /// Asking

    isTopMostView() {
        return true
    }

    /// Styles

    setTitle(value) {
        this.mainHandle.setTitle(value)
    }

    getTitle(value) {
        return this.mainHandle.getTitle()
    }

    /// Events

    subscribeToGUISignals(props) {
    }
}

module.exports = WindowView