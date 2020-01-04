const Classification = require('../../O').Classification
const NamespaceFlow = require('../../finger-tips/flows/NamespaceFlow')

const SkinsNamespace = require('../../skins/SkinsNamespace')
const GuiNamespace = require('./GuiNamespace')

const ObjectBrowserFlow = require('./object-browser/ObjectBrowserFlow')
const PrototypesBrowserFlow = require('./prototypes/PrototypesBrowserFlow')
const AppBrowserFlow = require('./app-browser/AppBrowserFlow')
const PlaygroundBrowserFlow = require('./playground/PlaygroundBrowserFlow')

const ObjectBrowser = require('../components/object-browser/ObjectBrowser')
const PrototypeBrowser = require('../components/prototype-browser/PrototypeBrowser')
const PlaygroundBrowser = require('../components/playground-browser/PlaygroundBrowser')
const AppBrowser = require('../components/app-browser/AppBrowser')

const ApplicationCommandsController = require('./ApplicationCommandsController')


class SirensNamespace {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [NamespaceFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'SirensNamespace' }, function(thisFlow) {
            const skinsNamespace = SkinsNamespace.new()
            const guiNamespace = GuiNamespace.new({ skinsNamespace: skinsNamespace })

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/../objects'
                ]
            })

            this.namespace({ id: 'Skins', from: skinsNamespace })
            this.namespace({ id: 'GUI', from: guiNamespace })

            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'ObjectBrowserFlow',
                    'PrototypesBrowserFlow',
                    'AppBrowserFlow',
                    'PlaygroundBrowserFlow',
                    'FileInspectorFlow',
                    'ApplicationCommandsController',
                ],
            })

            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'ObjectBrowser',
                    'PrototypeBrowser',
                    'AppBrowser',
                    'PlaygroundBrowser',
                ],
                inNamespace: skinsNamespace,
            })
        })
    }

    // Accessing namespaces

    skinsNamespace() {
        return this.getChildFlow({ id: 'Skins' })
    }

    guiNamespace() {
        return this.getChildFlow({ id: 'GUI' })
    }

    // Flow objects

    ObjectBrowserFlow({ mainFlow: mainFlow } = {}) {
        const objectBrowserFlow = ObjectBrowserFlow.new()

        const appCommandsController = this.ApplicationCommandsController.new({
            mainFlow: objectBrowserFlow,
        })

        objectBrowserFlow.setMainFlow( mainFlow )
        objectBrowserFlow.setCommandsController( appCommandsController )

        return objectBrowserFlow
    }

    PrototypesBrowserFlow({ mainFlow: mainFlow } = {}) {
        const prototypesFlow = PrototypesBrowserFlow.new()

        const appCommandsController = this.ApplicationCommandsController.new({
            mainFlow: prototypesFlow,
        })

        prototypesFlow.setMainFlow( mainFlow )
        prototypesFlow.setCommandsController( appCommandsController )

        return prototypesFlow
    }

    AppBrowserFlow({ mainFlow: mainFlow } = {}) {
        const appBrowserFlow = AppBrowserFlow.new()

        const appCommandsController = this.ApplicationCommandsController.new({
            mainFlow: appBrowserFlow,
        })

        appBrowserFlow.setMainFlow( mainFlow )
        appBrowserFlow.setCommandsController( appCommandsController )

        return appBrowserFlow
    }

    PlaygroundBrowserFlow({ mainFlow: mainFlow } = {}) {
        const playgroundBrowserFlow = PlaygroundBrowserFlow.new()

        const appCommandsController = this.ApplicationCommandsController.new({
            mainFlow: playgroundBrowserFlow,
        })

        playgroundBrowserFlow.setMainFlow( mainFlow )
        playgroundBrowserFlow.setCommandsController( appCommandsController )

        return playgroundBrowserFlow

    }

    /// Browser objects

    ObjectBrowser(...params) {
        return ObjectBrowser.new(...params)
    }

    PrototypeBrowser(...params) {
        return PrototypeBrowser.new(...params)
    }

    PlaygroundBrowser(...params) {
        return PlaygroundBrowser.new(...params)
    }

    AppBrowser(...params) {
        return AppBrowser.new(...params)
    }

    /// ApplicationCommandsController

    ApplicationCommandsController(...params) {
        return ApplicationCommandsController.new(...params)
    }
}

module.exports = Classification.define(SirensNamespace)
