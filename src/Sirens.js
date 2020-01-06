const SirensFlow = require('./sirens/SirensFlow')
const O = require('./O')

const sirensFlowSingleton = SirensFlow.new()
const sirensNamespace = sirensFlowSingleton.getChildFlow({ id: 'SirensNamespace' })


// Create the MainFlow. All the application is built from this main object.
// See the Sirens class implementation note for more details.
const mainFlow = sirensFlowSingleton.asFlowPoint()


/*
    Class(`
       Sirens is a set of interactive browsers to ease learning, debugging and developing applications with Node.js.

       It allows to inspect an object during the execution of an application, to browse its prototypes chain and,
       if the object is an instace of a class, to browse the documentation of the class.

       The browsers can evaluate code on the fly allowing developers not only to read static documentation
       but also to experiment with different uses of a given object, sending messages to it and inspecting the results.

       Try it: with the mouse select the text below, open a context menu and choose 'Inspect selected code':

           [ 1, 2, 3 ].map( function(i) { return i * 10 })

       This Sirens object  has the public methods of the library API.

       To use the Sirens library in your application first require it with

           const Sirens = require('sirens')

       and then call any of the methods in its API:

           const Sirens = require('sirens')

           const anyObject = [ 1, 2, 3 ]

           Sirens.browseObject( anyObject )

       Please see the examples below for more details about the different browsers available.
    `)

    Implementation(`
       This class is a thin wrapper on a SirensFlow singleton.

       Would you like to tweak the current Sirens applications (to, for example, use a
       different implementation of the Skins bindings or a different object browser) create
       another file like this one customize the mainFlow

           const SirensFlow = require('./sirens/SirensFlow')

           const mainFlow = SirensFlow.new().asFlowPoint()
           // configure and customize the mainFlow instance

       and then define a covenient thin wrapper like the one in this file.

       SirensFlow internally does not reference this class but access the main flow
       and will correctly use the customizations and configurations.
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
          Opens an application browser.

          A application browser allows to browse the files in a folder and for a selected file it shows
          its source code and for some specific types of files it uses a custom visualization component.
       `,
       Code: `
          const Sirens = require('sirens')

          Sirens.openAppBrowser()
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
        'public', 'browsers'
     ])
    */
    static browseObject(object) {
        mainFlow.browseObject(object)
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
        mainFlow.browsePrototypes(object)
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
        mainFlow.openAppBrowser({ appFolder: appFolder })
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
        mainFlow.openPlayground({ filename: filename })
    }

    /*
        Method(`
            Load all the expected plugins.
        `)
    */
    static loadPlugins() {
        this.loadObjectBrowserPlugins()
        this.loadDocumentationFormatPlugins()
        this.loadFileInspectorPlugins()
    }

    /*
        Method(`
            Load the ObjectBrowser plugins.

            An ObjectBrowser plugin adds or modifies the way an object is displayed
            and browsed by an ObjectBrowser.
        `)
    */
    static loadObjectBrowserPlugins() {
        // get the ObjectPropertyPlugins singleton
        const objectPropertyPlugins =
            sirensNamespace.getChildFlow({ id: 'ObjectPropertyPlugins' }).new()

        const folder = O.FolderPath.new({
            path: __dirname + '/../bin/plugins/object-browser'
        })

        folder.filesDo( (pluginFile) => {
            const pluginClassification = require( pluginFile.getPath() )

            objectPropertyPlugins.addPlugin( pluginClassification )
        })
    }

    /*
        Method(`
            Load the Documentation format reader and writer plugins.

            An Documentation format plugin converts class and methods
            documentation strings into ClassDocumentation and MethodDocumentation
            objects, making the documentation available for the DocumentationBrowser.
        `)
    */
    static loadDocumentationFormatPlugins() {
        // get the DocumentationFormatPlugins singleton
        const objectPropertyPlugins =
            sirensNamespace.getChildFlow({ id: 'DocumentationFormatPlugins' }).new()

        const folder = O.FolderPath.new({
            path: __dirname + '/../bin/plugins/documentation-format'
        })

        folder.filesDo( (pluginFile) => {
            const pluginClassification = require( pluginFile.getPath() )

            objectPropertyPlugins.addDocumentationReader( pluginClassification )
        })
    }

    /*
        Method(`
            Load the FileInspector plugins.

            A FileInspector plugin displays and browses a type of file, such as a
            .js file, a js class file, a .json file, or a spec file with a browser
            that the plugin defines.
        `)
    */
    static loadFileInspectorPlugins() {
        // get the FileInspectorPlugins singleton
        const objectPropertyPlugins =
            sirensNamespace.getChildFlow({ id: 'FileInspectorPlugins' }).new()

        const folder = O.FolderPath.new({
            path: __dirname + '/../bin/plugins/file-inspector'
        })

        folder.filesDo( (pluginFile) => {
            const pluginObject = require( pluginFile.getPath() )

            objectPropertyPlugins.addFileInspectorPlugin( pluginObject )
        })
    }

    static namespace() {
        return sirensNamespace
    }
}

Sirens.loadPlugins()

module.exports = Sirens