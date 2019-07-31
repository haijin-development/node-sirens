const Gtk = require('node-gtk').require('Gtk', '3.0')

class MenuView {
    /// Initializing

    constructor(menuHandle) {
        if(menuHandle === undefined) {
            menuHandle = new Gtk.Menu()
        }

        this.menuHandle = menuHandle
    }

    /// Adding

    addItem({label: label, enabled: enabled, action: action}) {
        if(enabled === undefined) {
            enabled = true
        }

        const menuItemHandle = new Gtk.MenuItem({label: label})

        menuItemHandle.sensitive = enabled

        menuItemHandle.on('activate', (props) => {
            action()
        })

        this.menuHandle.add(menuItemHandle)
    }

    addSeparator() {
        this.menuHandle.add(new Gtk.SeparatorMenuItem())
    }

    open() {
        this.menuHandle.showAll()
        this.menuHandle.popupAtPointer()
    }
}

module.exports = MenuView