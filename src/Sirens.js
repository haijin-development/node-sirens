const path = require('path')
const Gtk = require('node-gtk').require('Gtk', '3.0')
const Gdk = require('node-gtk').require('Gdk')

/*
 Class(`
    Sirens is a set of interactive browsers to ease learning, debugging and developing applications with Node.js.

    It allows to inspect an object during the execution of an application, to browse its prototypes chain and,
    if the object is an instace of a class, to browse the documentation of the class.

    The browsers can evaluate code on the fly allowing developers not only to read static documentation
    but also to experiment with different uses of a given object, sending messages to it and inspecting the results.

    This Sirens object  has the public methods of the library API.

    To use the Sirens library in your application first require it with

          const Sirens = require('sirens')

    and then call any of the methods in its API:

          const Sirens = require('sirens')

          const anyObject = [ 1, 2, 3 ]

          Sirens.browseObject( anyObject )

    Please see the examples below for more details on how to open the different browsers.

    By the way, if you are reading this documentation from within the Sirens documentation browser 
    then you can actually evaluate any code in the documentation and examples to see it running,
    and also to modify it and experiment with it while you are doing it.
 `)

 Example({
    Description: `
       Opens an interactive browser on an given object.
    `,
    Code: `
       const Sirens = require('sirens')

       const anyObject = [ 1, 2, 3 ]

       Sirens.browseObject( anyObject )
    `,
 })

 Example({
    Description: `
       Browses the functions defined on each prototype of an object of a given object.

       The browser includes the function source code if available.
    `,
    Code: `
       const Sirens = require('sirens')

       const anyObject = [ 1, 2, 3 ]

       Sirens.browsePrototypes( anyObject )
    `,
 })

 Example({
    Description: `
       Opens a class browser.

       A class browser allows to browse all the classes defined in a file.

       The difference with the PrototypesBrowser is that the ClassBrowser parses the javascript source code
       while the PrototypeBrowser uses the Javascript API to dynamically get an object properties, functions and source code.

       Because the ClassBrowsers has access to the full source code it can, and does, parse and read the documentation
       of classes and method writen in its comments, and in the future it will also be able to cross references between classes
       in the same project as long as they are documented.

       Note that if a nmp package makes use of classes then with the ClassBrowser you can browse all of its source code and documentation
       offline and while you are developing your application or experimenting with that package just by dowloading the package with

             nmp install

       and opening its files with the ClassEditor.
    `,
    Code: `

       const Sirens = require('sirens')

       Sirens.openClassEditor()

    `,
 })
*/
class Sirens {
    /*
     Method(`
        Opens an ObjectBrowser on the given object.

        The given object can be any object, including undefined, null, literals and arrays.
     `)

     Param({
        Name: `
           object
        `,
        Description: `
           The object to inspect with an ObjectBrowser.
        `,
     })

     Example({
        Description: `
           Opens an ObjectBrowser on the array [ 1, 2, 3 ].
        `,
        Code: `
           const Sirens = require('sirens')

           const anyObject = [ 1, 2, 3 ]

           Sirens.browseObject( anyObject )
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static browseObject(object) {
        this.do( () => {
            const ObjectBrowser = require('../src/sirens/components/ObjectBrowser')

            ObjectBrowser.openOn({object: object})
        })
    }

    /*
     Method(`
        Opens a PrototypesBrowser on the given object.

        The given object can be any object, including undefined, null, literals and arrays.
     `)

     Param({
        Name: `
           object
        `,
        Description: `
           The object to inspect its prototypes chain.

           It can be any object, including undefined, null, literals and arrays.
        `,
     })

     Example({
        Description: `
           Opens a browser on the prototypes of the array [ 1, 2, 3 ].
        `,
        Code: `
           const Sirens = require('sirens')

           const anyObject = [ 1, 2, 3 ]

           Sirens.browsePrototypes( anyObject )
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static browsePrototypes(object) {
        this.do( () => {
            const PrototypeBrowser = require('../src/sirens/components/PrototypeBrowser')

            PrototypeBrowser.openOn({prototype: object})
        })
    }

    /*
     Method(`
        Opens a class browser.

        It can receive an optional parameter with a filename to open on.

           const Sirens = require('sirens')

           const aFilename = './somefile.js'

           Sirens.openClassEditor({ filename: aFilename })
     `)

     Param({
        Name: `
           filename
        `,
        Description: `
           Optional string.

           The path to a file.

           The class browser will open on given filename.
        `,
     })

     Example({
        Description: `
           Opens a class browser with no file selected.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.openClassEditor()
        `,
     })

     Example({
        Description: `
           Opens a class browser on the given filename.
        `,
        Code: `
           const Sirens = require('sirens')

           const aFilename = './somefile.js'

           Sirens.openClassEditor({ filename: aFilename })
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static openClassEditor({ filename: filename } = { filename: undefined }) {
        this.do( () => {
            const ClassEditor = require('../src/sirens/components/ClassEditor')

            ClassEditor.openOn({ filename: filename })
        })
    }


    /*
     Method(`
        Opens an application (or a project) browser.
     `)

     Param({
        Name: `
           appFolder
        `,
        Description: `
           String.
           A path string to set as the initial folder in the browser.
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static openAppBrowser({ appFolder: appFolder } = { appFolder: undefined }) {
        this.do( () => {
            const AppBrowser = require('../src/sirens/components/AppBrowser')

            AppBrowser.openOn({ appFolder: appFolder })
        })
    }

    /*
     Method(`
        Opens a class documentation browser on the given classDefinition.
     `)

     Param({
        Name: `
           classDefinition
        `,
        Description: `
           ClassDefinition.
           The ClassDefinition object to browse its documentation.
        `,
     })

     Param({
        Name: `
           methodName
        `,
        Description: `
           Optional.
           String, null or undefined.
           A method name to open the browser on.
           It is expected to be the name of a method defined in the given classDefinition.
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static browseClassDocumentation({ classDefinition: classDefinition, methodName: methodName }) {
        this.do( () => {
            const ClassDocumentationBrowser = require('../src/sirens/components/ClassDocumentationBrowser')

            ClassDocumentationBrowser.openOn({
              classDefinition: classDefinition,
              methodName: methodName
            })
        })
    }

    /*
     Method(`
        Opens a playground browser.

        It can receive an optional parameter with a filename to open on.

           const Sirens = require('sirens')

           const aFilename = './somefile.js'

           Sirens.openPlayground({ filename: aFilename })
     `)

     Param({
        Name: `
           filename
        `,
        Description: `
           Optional string.

           The path to a file.

           The playground browser will open on given filename.
        `,
     })

     Example({
        Description: `
           Opens a playground browser with no file selected.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.openPlayground()
        `,
     })

     Example({
        Description: `
           Opens a playground browser on the given filename.
        `,
        Code: `
           const Sirens = require('sirens')

           const aFilename = './somefile.js'

           Sirens.openPlayground({ filename: aFilename })
        `,
     })

     Tags([
        'browsers', 'public'
     ])
    */
    static openPlayground({ filename: filename } = { filename: undefined }) {
        this.do( () => {
            const PlaygroundBrowser = require('../src/sirens/components/PlaygroundBrowser')

            PlaygroundBrowser.openOn({ filename: filename })
        })      
    }

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

                 Sirens.do( () => {
                       // ...
                 })

           call.
        `,
        Code: `
           const Sirens = require('sirens')
           const Classification = require('sirens/src/o-language/classifications/Classification')
           const Component = require('sirens/src/gui/components/Component')
           const ComponentProtocol_Implementation = require('sirens/src/gui/protocols/ComponentProtocol_Implementation')

           const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

           class CustomComponent {
               /// Definition

               static definition() {
                   this.instanceVariables = []
                   this.assumes = [Component]
                   this.implements = [ComponentProtocol_Implementation]
                   this.classificationBehaviours = [ComponentInstantiator]
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

           Sirens.do( () => {
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

              Sirens.do

        calls it.

        This mehtod can be safely called many times that the initialization will be evaluated only on the first call.

               Sirens.initialize()
     `)

     Example({
        Description: `
           Initializes the Sirens library.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.initialize()
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

        Gtk.init()

        this.setGlobalStyles()
    }

    static setGlobalStyles() {
      const screen = Gdk.Screen.getDefault()

      const cssProvider = new Gtk.CssProvider()

      const cssFilePath = path.resolve( __dirname + '/../resources/css/sirens.css' )

      cssProvider.loadFromPath( cssFilePath )

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

module.exports = Sirens