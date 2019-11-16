const path = require('path')
const fs = require('fs')
const Gtk = require('node-gtk').require('Gtk')
const GtkImage = require ('../GtkImage')

class GtkImageBuilder {

    static build(imageProps) {
        if( imageProps.iconName !== undefined ) {
            return Gtk.Image.newFromIconName( imageProps.iconName, imageProps.size )
        }

        if( imageProps.filename !== undefined ) {
            const resolvedPath = path.resolve( imageProps.filename )

            this.validateFilename({ filename: imageProps.filename, resolvedPath: resolvedPath })

            const pixbuf = GtkImage.pixbufAt({
                    filename: resolvedPath,
                    width: imageProps.width,
                    height: imageProps.height,
                })

            return Gtk.Image.newFromPixbuf( pixbuf )
        }

        throw new Error(`Uknown image format. Should either image.iconName of image.fileName`)
    }

    /// Validating

    static validateFilename({ filename: filename, resolvedPath: resolvedPath }) {
        const exists = fs.existsSync( resolvedPath )

        if( exists === false ) {
            throw new Error(`The image file '${filename}', resolved to '${resolvedPath}', does not exist.`)
        }
    }
}

module.exports = GtkImageBuilder