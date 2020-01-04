const nodeGtk = require('node-gtk')
const Gtk = nodeGtk.require('Gtk', '3.0')
const Gdk = nodeGtk.require('Gdk')

class SkinsGtk {
    /*
     Method(`
        Initializes GTK, or the GUI framework, and starts its main event loop.

        Then it evaluates the given closure.

        When all the windows are closed the event loop is released and the main program continues with its execution flow as usual.
     `)

     Param({
        Name: `
           closure
        `,
        Description: `
           A closure to evaluate after GTK is initialized and its main event loop is running.

           The closure has no parameters:

                 () => {
                       ...
                 }
        `,
     })

     Example({
        Description: `
           Creates a custom GUI Component and opens it in a window within a

                 SkinsGtk.do( () => {
                       // ...
                 })

           call.
        `,
        Code: `
           const Sirens = require('sirens')
           const Classification = require('sirens/src/O').Classification
           const Component = require('sirens/src/skins/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/skins/protocols/ComponentProtocol_Implementation')

           class CustomComponent {
               /// Definition

               static definition() {
                   this.instanceVariables = []
                   this.assumes = [Component]
                   this.implements = [ComponentProtocol_Implementation]
               }

               /// Building

               renderWith(componentsRenderer) {
                   componentsRenderer.render(function (component) {
                       this.window( function() {
                           this.styles({
                               width: 100,
                               height: 100,
                           })

                           this.label({text: 'A text label'})
                       })
                   })
               }
           }

           CustomComponent = Classification.define(CustomComponent)

           SkinsGtk.do( () => {
               CustomComponent.new().open()
           })
        `,
     })

     Tags([
        'evaluating', 'public'
     ])
    */
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

    /*
     Method(`
        Initializes the GTK library.

        Usually this method is not called by the main program since the method

              SkinsGtk.do

        calls it.

        This mehtod can be safely called many times that the initialization will be evaluated only on the first call.

               SkinsGtk.initialize()
     `)

     Example({
        Description: `
           Initializes the SkinsGtk library.
        `,
        Code: `
           const SkinsGtk = require('sirens')

           SkinsGtk.initialize()
        `,
     })

     Tags([
        'initializing', 'implementation'
     ])
    */
    static initialize() {
        if(this.gtkWasInitialize === true) {
            return
        }

        this.gtkWasInitialize = true

        nodeGtk.startLoop()
        Gtk.init()
    }

    static setGlobalStyles({ cssFilePath: cssFilePath }) {
      this.initialize()

      const screen = Gdk.Screen.getDefault()

      const cssProvider = new Gtk.CssProvider()

      cssProvider.loadFromPath( cssFilePath.getPath() )

      Gtk.StyleContext.addProviderForScreen(
        screen,
        cssProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
      )
    }

    /*
     Method(`
        This method is private and must not be called by the main program.

        Every time a new Window or Dialog is opened this method is called to keep track of all of
        the GTK windows opened.

        The tracking of the opened windows is used to release the GTK main event loop once the last
        opened window is closed by the user.
     `)

     Implementation(`
        See also WindowView.initialize() method.
     `)

     Tags([
        'implementation'
     ])
    */
    static registerWindow() {
        if(this.registeredWindows === undefined) {
            this.registeredWindows = 0
        }

        this.registeredWindows += 1
    }

    /*
     Method(`
        This method is private and must not be called by the main program.

        Every time a Window or Dialog is closed this method is called to keep track of all of
        the GTK windows that remain opened.

        The tracking of the opened windows is used to release the GTK main event loop once the last
        opened window is closed by the user.
     `)

     Implementation(`
        See also WindowView.handleDestroy() method.
     `)

     Tags([
        'implementation'
     ])
    */
    static unregisterWindow() {
        this.registeredWindows -= 1

        if(this.registeredWindows === 0) {
            Gtk.mainQuit()
        }
    }
}

module.exports = SkinsGtk