const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const SkinsGtk = require('./SkinsGtk')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class WindowView {
    /// Definition

    static definition() {
        this.instanceVariables = ['window', 'onClosed']
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

    initialize({ onClosed: onClosed }) {
        this.onClosed = onClosed

        this.previousClassificationDo( () => {
            this.initialize()
        })

        SkinsGtk.registerWindow()
    }

    initializeHandles() {
        this.window = new Gtk.Window()
    }

    subscribeToGUISignals() {
        const eventsSubscriptor = this.getEventsSubscriptor()

        eventsSubscriptor.on({
            event: 'delete-event',
            from: this.window,
            do: this.handleDeleteEvent,
            with: this,
        })

        eventsSubscriptor.on({
            event: 'destroy',
            from: this.window,
            do: this.handleDestroy,
            with: this,
        })
    }

    open() {
        this.window.showAll()
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
        this.onClosed()

        SkinsGtk.unregisterWindow()
    }

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(WindowView)
