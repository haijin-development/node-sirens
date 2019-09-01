const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const Gtk = require('node-gtk').require('Gtk', '3.0')

const modes = {
    openFile: Gtk.FILE_CHOOSER_ACTION_OPEN,
}

class FileChooserView {
    /// Definition

    static definition() {
        this.instanceVariables = ['dialog']
        this.assumptions = [GtkWidget]
    }

    /// Initializing

    initialize({ title: title, mode: mode, parent: parent }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.dialog = new Gtk.FileChooserDialog(title, parent, modes[mode])

        this.dialog.addButton('Cancel', Gtk.ResponseType.CANCEL)
        this.dialog.addButton('Open', Gtk.ResponseType.ACCEPT)
    }

    getMainHandle() {
        return this.dialog
    }

    /// Opening

    open() {
        const result = this.dialog.run()

        if( result !== Gtk.ResponseType.ACCEPT ) { return null }

        return this.dialog.getFilename()
    }

    /// Events

    subscribeToGUISignals() {
    }
}

module.exports = Classification.define(FileChooserView)
