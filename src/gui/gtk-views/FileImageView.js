const path = require('path')
const fs = require('fs')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Classification = require('../../o-language/classifications/Classification')
const GtkWidget = require('./GtkWidget')
const GtkWidgetProtocol_Implementation = require('../protocols/GtkWidgetProtocol_Implementation')
const GtkImage = require ('./GtkImage')

class FileImageView {
    /// Definition

    static definition() {
        this.instanceVariables = ['image', 'filename', 'width', 'height']
        this.assumes = [GtkWidget]
        this.implements = [GtkWidgetProtocol_Implementation]
    }

    /// Initializing

    initialize({ filename: filename, width: width, height: height }) {
        const resolvedPath = path.resolve( filename )

        this.validateFilename({ filename: filename, resolvedPath: resolvedPath })

        this.filename = resolvedPath
        this.width = width
        this.height = height

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    initializeHandles() {
        const pixbuf = GtkImage.pixbufAt({
                filename: this.filename,
                width: this.width,
                height: this.height,
            })

        this.image = Gtk.Image.newFromPixbuf( pixbuf )
    }

    /// Accessing

    getMainHandle() {
        return this.image
    }

    /// Events

    subscribeToGUISignals() {
    }

    /// Validating

    validateFilename({ filename: filename, resolvedPath: resolvedPath }) {
        const exists = fs.existsSync( resolvedPath )

        if( exists === false ) {
            throw new Error(`The image file '${filename}', resolved to '${resolvedPath}', does not exist.`)
        }
    }
}

module.exports = Classification.define(FileImageView)