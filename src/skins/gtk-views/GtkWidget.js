const Classification = require('../../O').Classification
const GtkView = require('./GtkView')
const GtkWidgetWithContextMenu = require('./GtkWidgetWithContextMenu')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class GtkWidget {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [GtkView, GtkWidgetWithContextMenu]
        this.expects = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    assemble() {
        this.previousClassificationDo( () => {
            this.assemble()
        })

        this.initializeHandles()

        this.subscribeToGUISignals()
    }

    initializeHandles() {
    }

    connectToParentHandleOwnerView() {
        const parentView = this.getParentHandleOwnerView()

        if( parentView !== undefined ) {
            parentView.directChildViewAdd(this)
        }
    }

    disconnectFromParentHandleOwnerView() {
        const parentView = this.getParentHandleOwnerView()

        if( parentView !== undefined ) {
            parentView.directChildViewRemove(this)
        }
    }
    
    directChildViewAdd(childView) {
        const childHandle = childView.getMainHandle()

        this.getMainHandle().add( childHandle )

        this.getMainHandle().showAll()
    }

    directChildViewRemove(childView) {
        const childHandle = childView.getMainHandle()

        this.getMainHandle().remove( childHandle )
    }

    concreteViewsDo(closure) {
        closure(this)
    }

    releaseHandles() {
        this.getMainHandle().destroy()

        this.previousClassificationDo( () => {
            this.releaseHandles()
        })

        this.thisClassification().getDefinedInstanceVariables().forEach( (instVar) => {
            this[instVar] = null
        })
    }
}

module.exports = Classification.define(GtkWidget)