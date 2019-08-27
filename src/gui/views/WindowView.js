const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Sirens = require('../../Sirens')

class WindowView {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'mainHandle',
        ]

        this.assumptions = [GtkWidget]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(['title'])
        })
    }

    /// Initializing

    initialize() {
        this.previousClassificationDo( () => {
            this.initialize()
        })

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

    subscribeToGUISignals() {
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

    getMainHandle() {
        return this.mainHandle
    }
}

module.exports = Classification.define(WindowView)
