const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Sirens = require('../../Sirens')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class WindowView {
    /// Definition

    static definition() {
        this.instanceVariables = ['window']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
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

        this.window = new Gtk.Window()

        Sirens.registerWindow()

        this.window.on( 'delete-event', this.handleDeleteEvent.bind(this) )

        this.window.on( 'destroy', this.handleDestroy.bind(this) )
    }

    open() {
        this.window.showAll()
    }

    subscribeToGUISignals() {
    }

    /// Styles

    setTitle(value) {
        this.window.setTitle(value)
    }

    getTitle(value) {
        return this.window.getTitle()
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

    /// Accessing

    getMainHandle() {
        return this.window
    }

    /// Events

    handleDeleteEvent() {
        return false
    }

    handleDestroy() {
        Sirens.unregisterWindow()
    }
}

module.exports = Classification.define(WindowView)
