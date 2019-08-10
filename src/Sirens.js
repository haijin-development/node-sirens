const Gtk = require('node-gtk').require('Gtk', '3.0')
const callsites = require('callsites')

class Sirens {
    static browseObject(object) {
        this.do( () => {
            const ObjectBrowser = require('./sirens/ObjectBrowser')

            ObjectBrowser.openOn({object: object})
        })
    }

    static browsePrototypes(object) {
        this.do( () => {
            const PrototypeBrowser = require('./sirens/PrototypeBrowser')

            PrototypeBrowser.openOn({prototype: object})
        })
    }

    static browseStack(object) {
        const framesStack = callsites()

        const allStackedFramesButThisOne = framesStack.slice(1)

        this.do( () => {
            const StackTraceBrowser = require('./sirens/StackTraceBrowser')

            StackTraceBrowser.openOn({framesStack: allStackedFramesButThisOne, object: object})
        })
    }

    static do(closure) {
        if(this.gtkIsRunningTheMainLoop === true) {
            closure.call(this)
            return
        }

        try {
            this.initialize()

            this.gtkIsRunningTheMainLoop = true

            closure.call(this)

            Gtk.main()
        } finally {
            this.gtkIsRunningTheMainLoop = false
        }
    }

    static initialize() {
        if(this.gtkWasInitialize === true) {
            return
        }

        this.gtkWasInitialize = true

        Gtk.init()
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