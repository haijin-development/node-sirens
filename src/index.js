const Gtk = require('node-gtk').require('Gtk', '3.0')

class Sirens {
    static browse({object: object, prototypes: prototype}) {
        if (prototype !== undefined) {
            this.browsePrototypes(prototype)
        } else {
            this.browseObject(object)
        }
    }

    static browseObject(object) {
        const ObjectBrowser = require('./sirens/ObjectBrowser')

        ObjectBrowser.openOn({object: object})
    }

    static browsePrototypes(object) {
        const PrototypeBrowser = require('./sirens/PrototypeBrowser')

        PrototypeBrowser.openOn({prototype: prototype})
    }

    static do(closure) {
        this.initialize()

        closure.call(this)

        Gtk.main()
    }

    static initialize() {
        if(this.gtkWasInitialize === undefined) {
            this.gtkWasInitialize = true

            Gtk.init()
        }
    }

    static registerWindow() {
        if(this.registeredWindows === undefined) {
            this.registeredWindows = 0
        }

        this.registeredWindows += 1
    }

    static unregisterWindow() {
        this.registeredWindows -= 1

        if(this.registeredWindows === 0) {
            Gtk.mainQuit()
        }
    }
}

module.exports = Sirens