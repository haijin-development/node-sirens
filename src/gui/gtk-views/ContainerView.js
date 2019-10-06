const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkScroll = require('./constants/GtkScroll')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ContainerView {
    /// Definition

    static definition() {
        this.instanceVariables = ['scrolledWindow']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Styles

    acceptedStyles() {
        return this.previousClassificationDo( () => {
            return this.acceptedStyles().concat(
                [
                    'hScroll', 'vScroll',
                ]
            )
        })
    }

    /// Initializing

    initializeHandles() {
        this.scrolledWindow = new Gtk.ScrolledWindow()

        this.scrolledWindow.setPolicy(
            GtkScroll.auto,
            GtkScroll.auto
        )
    }

    getMainHandle() {
        return this.scrolledWindow
    }

    /// Styles

    setHScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            GtkScroll[ value ],
            vScroll
        )
    }

    setVScroll(value) {
        const [hScroll, vScroll] = this.scrolledWindow.getPolicy()

        this.scrolledWindow.setPolicy(
            hScroll,
            GtkScroll[ value ]
        )        
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(ContainerView)
