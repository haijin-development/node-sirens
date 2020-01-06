const Classification = require('../O').Classification
const FilePath = require('../O').FilePath
const Flow = require('../finger-tips/flows/Flow')

const SirensNamespace = require('./SirensNamespace')
const SkinsGtk = require('../skins/gtk-views/SkinsGtk')

/*
    Class(`
        The main flow of every Component, Namespace, Command and nested Flow in the
        Sirens application.

        This Flow has all the definitions and implementations ( although sometimes
        it wraps the implementation to another library) related with the application.
    `)
*/
class SirensFlow {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Flow]
    }

    /// Building

    buildWith(flow) {
        const sirensNamespace = SirensNamespace.new()

        const commandsController = sirensNamespace.ApplicationCommandsController.new({
            mainFlow: this,
            mainNamespace: sirensNamespace,
        })

        this.setCommandsController( commandsController )

        flow.main({ id: 'main' }, function(thisFlow) {

            this.namespace({ id: 'SirensNamespace', from: sirensNamespace })

            this.defineMethodsAsCommands({
                methods: [
                    'mainNamespace',
                    'guiNamespace',
                    'skinsNamespace',
                    'browseObject',
                    'browsePrototypes',
                    'openAppBrowser',
                    'openPlayground',
                    'getPreferences',
                ],
            })

            this.value( {id: 'preferences' }, function(){

                this.whenValueChanges( function({ newValue: preferences }) {
                    preferences.freeze

                    let cssFilePath = FilePath.new({ path: preferences.cssFile })

                    if( cssFilePath.isRelative() ) {
                        cssFilePath = FilePath.new({ path: __dirname })
                            .append({ path: '../..' })
                            .append({ path: cssFilePath })
                    }

                    SkinsGtk.setGlobalStyles({ cssFilePath: cssFilePath })
                })

            })

        })

        this.loadDefaultPreferences()
    }

    /// Exported commands

    /*
        Method(`
            This method is called when a FlowPoint is created.

            It picks and attachs the commands that the given flowPoint will
            have access to.
        `)
    */
    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'mainNamespace',
            'guiNamespace',
            'skinsNamespace',
            'browseObject',
            'browsePrototypes',
            'openAppBrowser',
            'openPlayground',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Accessing namespaces

    mainNamespace() {
        return this.getChildFlow({ id: 'SirensNamespace' })
    }

    skinsNamespace() {
        return this.getChildFlow({ id: 'SirensNamespace.Skins' })
    }

    guiNamespace() {
        return this.getChildFlow({ id: 'SirensNamespace.GUI' })        
    }

    /// Browsers

    browseObject(object) {
        SkinsGtk.do( () => {
            const namespace = this.mainNamespace()

            const objectBrowserFlow = namespace.ObjectBrowserFlow.new({
                mainFlow: this,
            })

            const commandsController =
                this.newApplicationCommandsControllerFor({ mainFlow: objectBrowserFlow })

            objectBrowserFlow.setCommandsController( commandsController )

            objectBrowserFlow.setBrowsedObject( object )

            const browser = namespace.ObjectBrowser.new({
                model: objectBrowserFlow.asFlowPoint(),
            })

            browser.open()
        })
    }

    browsePrototypes(object) {
        SkinsGtk.do( () => {
            const namespace = this.mainNamespace()

            const prototypesBrowserFlow = namespace.PrototypesBrowserFlow.new({
                mainFlow: this,
            })

            const commandsController =
                this.newApplicationCommandsControllerFor({ mainFlow: prototypesBrowserFlow })

            prototypesBrowserFlow.setCommandsController( commandsController )

            prototypesBrowserFlow.setBrowsedObject( object )

            const browser = namespace.PrototypeBrowser.new({
                model: prototypesBrowserFlow.asFlowPoint(),
            })

            browser.open()
        })
    }

    openAppBrowser({ appFolder: appFolderPath } = { appFolder: undefined }) {
        SkinsGtk.do( () => {
            const namespace = this.mainNamespace()

            const appBrowserFlow = namespace.AppBrowserFlow.new({
                mainFlow: this,
            })

            const commandsController =
                this.newApplicationCommandsControllerFor({ mainFlow: appBrowserFlow })

            appBrowserFlow.setCommandsController( commandsController )

            if( appFolderPath ) {
                appBrowserFlow.openFolder({ folderPath: appFolderPath })
            }

            const appBrowser = namespace.AppBrowser.new({
                model: appBrowserFlow.asFlowPoint(),
            })

            appBrowser.open()
        })
    }

    openPlayground({ filename: filename } = { filename: undefined }) {
        SkinsGtk.do( () => {
            const namespace = this.mainNamespace()

            const playgroundBrowserFlow = namespace.PlaygroundBrowserFlow.new({
                mainFlow: this,
            })

            const commandsController =
                this.newApplicationCommandsControllerFor({ mainFlow: playgroundBrowserFlow })

            playgroundBrowserFlow.setCommandsController( commandsController )

            if( filename !== undefined ) {
                playgroundBrowserFlow.openFile({ filename: filename })
            }

            const playground = namespace.PlaygroundBrowser.new({
                model: playgroundBrowserFlow.asFlowPoint(),
            })

            playground.open()
        })
    }

    loadDefaultPreferences() {
        this.loadPreferencesFromFile({
            filename: __dirname + '/../../resources/Preferences.json',
        })
    }

    loadPreferencesFromFile({ filename: jsonFilename }) {
        const filePath = FilePath.new({ path: jsonFilename })

        const jsonContents = filePath.readFileContents()

        const preferences = JSON.parse( jsonContents )

        this.setPreferences({ preferences: preferences })
    }

    setPreferences({ preferences: preferences }) {
        this.getChildFlow({ id: 'preferences' })
            .setValue( preferences )
    }

    getPreferences() {
        return this.getChildFlow({ id: 'preferences' })
            .getValue()
    }

    newApplicationCommandsControllerFor({ mainFlow: flow }) {
        const namespace = this.mainNamespace()

        return namespace.ApplicationCommandsController.new({
            mainFlow: flow,
            mainNamespace: namespace,
        })
    }
}

module.exports = Classification.define(SirensFlow)