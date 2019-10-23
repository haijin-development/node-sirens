const Gtk = require('node-gtk').require('Gtk', '3.0')
const callsites = require('callsites')

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
    */
    static browsePrototypes(object) {
        this.do( () => {
            const PrototypeBrowser = require('../src/sirens/components/PrototypeBrowser')

            PrototypeBrowser.openOn({prototype: object})
        })
    }

    /*
     Method(`
        Opens a StackBrowser on the current stack frame.
     `)

     Param({
        Name: `
           object
        `,
        Description: `
           An optional object of the form

                 { ... }


           It usually will be the arguments of the current function and any other variable you would like to inspect.

           For instance

                 Sirens.browseStack({
                       arguments: arguments,
                       thisObject: this,
                       someOtherVariable: someOtherVariable,
                 })
        `,
     })

     Example({
        Description: `
           Opens a StackBrowser on the current stack frame.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.browseStack()
        `,
     })

     Example({
        Description: `
           Opens a browser on the current stack frame and also inspects the arguments of the current function.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.browseStack( arguments )
        `,
     })

     Example({
        Description: `
           Opens a browser on the current stack frame and also inspects the arguments of the current function,
           this object and another variable.
        `,
        Code: `
           const Sirens = require('sirens')

           Sirens.browseStack({
                 arguments: arguments,
                 thisObject: this,
                 someOtherVariable: someOtherVariable,
           })

        `,
     })
    */
    static browseStack(object) {
        const framesStack = callsites()

        const allStackedFramesButThisOne = framesStack.slice(1)

        this.do( () => {
            const StackTraceBrowser = require('../src/sirens/components/StackTraceBrowser')

            StackTraceBrowser.openOn({framesStack: allStackedFramesButThisOne, object: object})
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
    */
    static openClassEditor({ filename: filename } = { filename: undefined }) {
        this.do( () => {
            const ClassEditor = require('../src/sirens/components/ClassEditor')

            ClassEditor.openOn({ filename: filename })
        })
    }

    /*
     Method(`
        Private.

        Opens a class documentation browser on the given classDefinition.
     `)

     Param({
        Name: `
           classDefinition
        `,
        Description: `
           A ClassDefinition object.
        `,
     })
    */
    static browseClassDocumentation({ classDefinition: classDefinition }) {
        this.do( () => {
            const ClassDocumentationBrowser = require('../src/sirens/components/ClassDocumentationBrowser')

            ClassDocumentationBrowser.openOn({ classDefinition: classDefinition })
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
    */
    static openPlayground({ filename: filename } = { filename: undefined }) {
        this.do( () => {
            const PlaygroundBrowser = require('../src/sirens/components/PlaygroundBrowser')

            PlaygroundBrowser.openOn({ filename: filename })
        })      
    }

    /*
     Method(`
        Private.

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
           const ComponentProtocol = require('sirens/src/gui/protocols/ComponentProtocol')
           const ComponentInstantiator = require('sirens/src/gui/components/ComponentInstantiator')

           class CustomComponent {
               /// Definition

               static definition() {
                   this.instanceVariables = []
                   this.assumes = [Component]
                   this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
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
        Private.
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
    */
    static initialize() {
        if(this.gtkWasInitialize === true) {
            return
        }

        this.gtkWasInitialize = true

        Gtk.init()
    }

    /*
     Method(`
        Private.

        This method is private and must not be called by the main program.

        Every time a new Window or Dialog is opened this method is called to keep track of all of
        the GTK windows opened.

        The tracking of the opened windows is used to release the GTK main event loop once the last
        opened window is closed by the user.
     `)

     Implementation(`
        See also WindowView.initialize() method.
     `)
    */
    static registerWindow() {
        if(this.registeredWindows === undefined) {
            this.registeredWindows = 0
        }

        this.registeredWindows += 1
    }

    /*
     Method(`
        Private.

        This method is private and must not be called by the main program.

        Every time a Window or Dialog is closed this method is called to keep track of all of
        the GTK windows that remain opened.

        The tracking of the opened windows is used to release the GTK main event loop once the last
        opened window is closed by the user.
     `)

     Implementation(`
        See also WindowView.handleDestroy() method.
     `)
    */
    static unregisterWindow() {
        this.registeredWindows -= 1

        if(this.registeredWindows === 0) {
            Gtk.mainQuit()
        }
    }
}

module.exports = Sirens