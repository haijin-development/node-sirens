const GObject = require('node-gtk').require('GObject')
const Gtk = require('node-gtk').require('Gtk')

const GtkTypes = {
    number: GObject.typeFromName('gfloat'),
    string: GObject.typeFromName('gchararray'),
    image: Gtk.ImageType.PIXBUF,
}

module.exports = GtkTypes