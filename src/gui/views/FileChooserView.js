const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

const modes = {
    chooseFile: Gtk.FileChooserAction.OPEN,
    saveFile: Gtk.FileChooserAction.SAVE,
    chooseFolder: Gtk.FileChooserAction.SELECT_FOLDER,
    createFolder: Gtk.FileChooserAction.CREATE_FOLDER,
}

const defaultLabels = {
    chooseFile: 'Open file',
    saveFile: 'Save file',
    chooseFolder: 'Choose folder',
    createFolder: 'Create folder',
}

class FileChooserView {
    /// Definition

    static definition() {
        this.instanceVariables = ['dialog']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ title: title, mode: mode, parentView: parentView, openButtonLabel: openButtonLabel }) {
        const parent = parentView !== undefined ? parentView.getMainHandle() : undefined
        const label = openButtonLabel !== undefined ? openButtonLabel : this.defaultLabelFor(mode)

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.dialog = new Gtk.FileChooserDialog()

        this.dialog.setAction( modes[mode] )
        this.dialog.setTitle(title)
        this.dialog.setTransientFor(parent)
        this.dialog.setModal(true)
        this.dialog.addButton('Cancel', Gtk.ResponseType.CANCEL)
        this.dialog.addButton(label, Gtk.ResponseType.ACCEPT)
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
}


module.exports = Classification.define(FileChooserView)
