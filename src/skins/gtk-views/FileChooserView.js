const Classification = require('../../O').Classification
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')

const modes = {
    chooseFile: Gtk.FileChooserAction.OPEN,
    saveFile: Gtk.FileChooserAction.SAVE,
}

const defaultLabels = {
    chooseFile: 'Open file',
    saveFile: 'Save file',
}

class FileChooserView {
    /// Definition

    static definition() {
        this.instanceVariables = ['dialog']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({
        title: title,
        mode: mode,
        initialFolder: initialFolder,
        windowView: windowView,
        openButtonLabel: openButtonLabel,
    })
    {
        const windowHandle = windowView !== undefined ? windowView.getOnlyChildViewMainHandle() : undefined
        const label = openButtonLabel !== undefined ? openButtonLabel : this.defaultLabelFor(mode)

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.dialog = new Gtk.FileChooserDialog()

        this.dialog.setAction( modes[mode] )
        this.dialog.setTitle(title)
        this.dialog.setTransientFor(windowHandle)
        this.dialog.setModal(true)

        this.dialog.addButton('Cancel', Gtk.ResponseType.CANCEL)
        this.dialog.addButton(label, Gtk.ResponseType.ACCEPT)

        if( initialFolder ) {
            this.dialog.setCurrentFolder( initialFolder )
        }
    }

    defaultLabelFor(mode) {
        return defaultLabels[mode]
    }

    getMainHandle() {
        return this.dialog
    }

    /// Opening

    open() {
        const result = this.dialog.run()

        const filename = this.dialog.getFilename()

        this.dialog.destroy()

        if( result !== Gtk.ResponseType.ACCEPT ) { return null }

        return filename
    }

    /// Events

    subscribeToGUISignals() {
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


module.exports = Classification.define(FileChooserView)
