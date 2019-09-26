const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class MenuGroupView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menu', 'label']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ label: label })
    {
        this.label = label

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        this.menu = new Gtk.MenuItem({ label: this.label })
        this.menu.submenu = new Gtk.Menu()
    }

    /// Adding

    directChildViewAdd(childView) {
        const childHandle = childView.getMainHandle()

        this.menu.submenu.add( childHandle )

        this.menu.submenu.showAll()
    }

    /// Querying

    getMainHandle() {
        return this.menu
    }

    /// Events

    subscribeToGUISignals() {
    }
}


module.exports = Classification.define(MenuGroupView)