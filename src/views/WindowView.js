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

    /// Styles

    setWidth(value) {
        let [width, height] = this.getMainHandle().getDefaultSize()

        width = value

        this.getMainHandle().setDefaultSize(width, height)
    }

    getWidth(value) {
        return this.getMainHandle().getDefaultSize()[0]
    }

    setHeight(value) {
        let [width, height] = this.getMainHandle().getDefaultSize()

        height = value

        this.getMainHandle().setDefaultSize(width, height)
    }

    getHeight(value) {
        return this.getMainHandle().getDefaultSize()[1]
    }

    /// Events

    subscribeToGUISignals(props) {
    }
}

module.exports = WindowView