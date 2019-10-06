const GdkPixbuf = require('node-gtk').require('GdkPixbuf')

class GtkImagesCache {

    constructor() {
        this.pixbufs = {}
    }

    pixbufAt({ filename: filename, width: width, height: height }) {
        const key = filename + '|' + width.toString() + '|' + height.toString()

        if( this.pixbufs[key] === undefined ) {
            this.pixbufs[key] = this.createPixbuf({ filename: filename, width: width, height: height })
        }

        return this.pixbufs[key]
    }

    createPixbuf({ filename: filename, width: width, height: height }) {
        return GdkPixbuf.Pixbuf.newFromFileAtSize( filename, width, height )
    }
}

const GtkImage = new GtkImagesCache()

module.exports = GtkImage