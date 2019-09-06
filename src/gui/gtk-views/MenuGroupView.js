const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')

class MenuGroupView {
    /// Definition

    static definition() {
        this.instanceVariables = [ 'menu', 'label']
        this.assumptions = [GtkWidget]
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

    onViewAdded(childView) {
        const childHandle = childView.getMainHandle()

        this.menu.submenu.add( childHandle )
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