const GObject = require('node-gtk').require('GObject')
const Gtk = require('node-gtk').require('Gtk')

const GtkTypes = {
    string: GObject.typeFromName('gchararray'),
    image: GObject.typeFromName('GdkPixbuf'),
}

module.exports = GtkTypes