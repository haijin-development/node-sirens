const FilePath = require('./../../../o-language/classifications/paths/FilePath')
const Gtk = require('node-gtk').require('Gtk')
const GtkImage = require('../GtkImage')

class GtkImageBuilder {

    static build(imageProps) {
        if( imageProps.iconName !== undefined ) {
            return Gtk.Image.newFromIconName( imageProps.iconName, imageProps.size )
        }

        if( imageProps.filename !== undefined ) {
            const imageFilePath = FilePath.new({ path: imageProps.filename})

            this.validateFilename({ filename: imageProps.filename, imageFilePath: imageFilePath })

            const pixbuf = GtkImage.pixbufAt({
                    filename: imageFilePath.getPath(),
                    width: imageProps.width,
                    height: imageProps.height,
                })

            return Gtk.Image.newFromPixbuf( pixbuf )
        }

        throw new Error(`Uknown image format. Should either image.iconName of image.fileName`)
    }

    /// Validating

    static validateFilename({ imageFilePath: imageFilePath }) {
        if( imageFilePath.exists() === false ) {
            const path = imageFilePath.getPath()
            const filename = imageFilePath.getFileName({ withExtension: false })

            throw new Error(`The image file '${filename}', resolved to '${path}', does not exist.`)
        }
    }
}

module.exports = GtkImageBuilder