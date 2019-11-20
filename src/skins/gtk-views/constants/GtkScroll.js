const Gtk = require('node-gtk').require('Gtk')

const GtkScroll = {
    always: Gtk.PolicyType.ALWAYS,
    auto: Gtk.PolicyType.AUTOMATIC,
    never: Gtk.PolicyType.NEVER,
    external: Gtk.PolicyType.EXTERNAL,
}

module.exports = GtkScroll