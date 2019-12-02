const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../O').Classification
const ToolButtonView = require('./ToolButtonView')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

class ToggleToolButtonView {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ToolButtonView]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initializeHandles() {
        this.setToolButtonHandle( new Gtk.ToggleToolButton() )

        this.initializeMainHandle()
    }

    /// Asking

    getValue() {
        return this.getMainHandle().getActive()
    }

    /// Actions

    setValue(boolean) {
        this.getMainHandle().setActive( boolean )
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


module.exports = Classification.define(ToggleToolButtonView)