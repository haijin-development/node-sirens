const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImageBuilder = require('./constants/GtkImageBuilder')

class DialogView {
    /// Definition

    static definition() {
        this.instanceVariables = ['dialog', 'buttonProps']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({
        title: title,
        buttons: buttons,
        windowView: windowView,
    })
    {
        const windowHandle = windowView !== undefined ?
            windowView.getOnlyChildViewMainHandle() : undefined

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.dialog = new Gtk.Dialog()

        this.dialog.setTitle( title )
        this.dialog.setTransientFor(windowHandle)
        this.dialog.setModal(true)

        if( buttons !== undefined ) {
            this.setButtons( buttons )
        }
    }

    setButtons(buttonProps) {
        this.buttonProps = buttonProps

        this.buttonProps.forEach( (buttonProps, index) => {
            buttonProps.id = index

            this.addButton( buttonProps )
        })
    }

    addButton(buttonProps) {
        const button = this.dialog.addButton(
            buttonProps.label,
            buttonProps.id
        )

        if( buttonProps.image !== undefined ) {
            // Downcast the abstract GtkWidget to a concrete GtkButton
            Object.setPrototypeOf(button, Gtk.Button.prototype)

            const imageHandle = GtkImageBuilder.build( buttonProps.image )

            button.setImage( imageHandle )
            button.setAlwaysShowImage( true )
        }
    }

    /// Styles

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
        return this.dialog
    }

    /// Opening

    open() {
        const clickedButtonId = this.dialog.run()

        this.dialog.destroy()

        const dialogAction = this.findDialogActionForButtonId({ clickedButtonId: clickedButtonId })

        if( dialogAction !== null ) {
            dialogAction()
        }
    }

    findDialogActionForButtonId({ clickedButtonId: clickedButtonId }) {
        const clickedButtonProps = this.buttonProps.find( (buttonProps) => {
            return buttonProps.id === clickedButtonId
        })

        if( clickedButtonProps === undefined ) { return null }

        return clickedButtonProps.action
    }

    /// Events

    subscribeToGUISignals() {
    }

    /// Children

    directChildViewAdd(childView) {
        const childHandle = childView.getMainHandle()

        const dialogContent = this.dialog.getContentArea()

        dialogContent.packStart(
            childHandle,
            true,
            true,
            0
        )

        this.getMainHandle().showAll()
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


module.exports = Classification.define(DialogView)
