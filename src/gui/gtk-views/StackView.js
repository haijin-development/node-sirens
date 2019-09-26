const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class StackView {
    /// Definition

    static definition() {
        this.instanceVariables = ['box']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ orientation: orientation }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        if(orientation == 'horizontal') {
            this.box = new Gtk.HBox()
        } else {
            this.box = new Gtk.VBox()
        }
    }

    getMainHandle() {
        return this.box
    }

    /// Events

    subscribeToGUISignals() {
    }

    directChildViewAdd(childView) {
        const packExpand = childView.getViewCustomAttribute({ at: 'packExpand', ifAbsent: true })
        const packFill = childView.getViewCustomAttribute({ at: 'packFill', ifAbsent: true })
        const packPadding = childView.getViewCustomAttribute({ at: 'packPadding', ifAbsent: 0 })

        const childHandle = childView.getMainHandle()

        this.box.packStart(
            childHandle,
            packExpand,
            packFill,
            packPadding
        )

        this.box.showAll()
    }
}

module.exports = Classification.define(StackView)
