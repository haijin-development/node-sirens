const Gtk = require('node-gtk').require('Gtk', '3.0')

const WrapModes = {
    none: Gtk.WrapMode.NONE,
    char: Gtk.WrapMode.CHAR,
    word: Gtk.WrapMode.WORD,
    wordChar: Gtk.WrapMode.WORD_CHAR,
}

module.exports = WrapModes