const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkScroll = require('./constants/GtkScroll')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ContainerView {
    /// Definition

    static definition() {
        this.instanceVariables = ['container']
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

    initialize({ hasScrollBars: hasScrollBars }) {
        if( hasScrollBars === false ) {
            this.container = new Gtk.Frame()
        } else {
            this.container = new Gtk.ScrolledWindow()

            this.container.setPolicy(
                GtkScroll.auto,
                GtkScroll.auto
            )
        }

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    getMainHandle() {
        return this.container
    }

    /// Styles

    setHScroll(value) {
        const [hScroll, vScroll] = this.container.getPolicy()

        this.container.setPolicy(
            GtkScroll[ value ],
            vScroll
        )
    }

    setVScroll(value) {
        const [hScroll, vScroll] = this.container.getPolicy()

        this.container.setPolicy(
            hScroll,
            GtkScroll[ value ]
        )        
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(ContainerView)
