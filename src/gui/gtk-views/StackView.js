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
        let expand = true
        let fill = true
        const padding = childView.getViewAttribute({ at: 'stackPadding', ifAbsent: 0 })

        const stackSize = childView.getViewAttribute({ at: 'stackSize', ifAbsent: 'filled' })

        switch( stackSize ) {
            case 'filled':
                expand = true
                fill = true
                break

            case 'fixed':
                expand = false
                fill = false
                break

            case 'spread':
                expand = false
                fill = true
                break

            default:
                throw new Error(`Uknown stack size: '${stackSize}'`)
                break
        }

        const packAlign = childView.getViewAttribute({ at: 'stackAlign', ifAbsent: 'begining' })

        const childHandle = childView.getMainHandle()

        switch( packAlign ) {
            case 'begining':
                this.box.packStart(
                    childHandle,
                    expand,
                    fill,
                    padding
                )
                break

            case 'end':
                this.box.packEnd(
                    childHandle,
                    expand,
                    fill,
                    padding
                )
                break

            default:
                throw new Error(`Uknown stack aligment: '${packAlign}'`)
                break
        }


        this.box.showAll()
    }
}

module.exports = Classification.define(StackView)
