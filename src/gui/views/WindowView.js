const OInstance = require('../../o-language/classifications/OInstance')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Sirens = require('../../Sirens')

class WindowView {
    /// Instantiating

    static new(orientation) {
        return OInstance.new().yourself( (checkbox) => {
            checkbox
                .behaveAs(this)
                .initializeHandles(orientation)
        })
    }

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

module.exports = WindowView