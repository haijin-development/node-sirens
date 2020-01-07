const Classification = require('../../O').Classification
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
        const padding = childView.getViewAttribute({ at: 'stackPadding', ifAbsent: 0 })
        const expandsToFit = childView.getViewAttribute({ at: 'expandsToFit', ifAbsent: false })

        let expand = true
        let fill = true

        if( expandsToFit === true ) {
            expand = true
            fill = true
        } else {
            expand = false
            fill = false
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

    releaseHandles() {
        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(StackView)
