const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const SkinsNamespace = require('../skins/SkinsNamespace')
const GuiNamespace = require('./GuiNamespace')

const ObjectBrowserFlow = require('./flows/object-browser/ObjectBrowserFlow')
const PrototypesBrowserFlow = require('./flows/prototypes/PrototypesBrowserFlow')
const AppBrowserFlow = require('./flows/app-browser/AppBrowserFlow')
const PlaygroundBrowserFlow = require('./flows/playground/PlaygroundBrowserFlow')

const ApplicationCommandsController = require('./flows/ApplicationCommandsController')


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

            this.namespace({ id: 'Skins', from: skinsNamespace })
            this.namespace({ id: 'GUI', from: guiNamespace })

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/objects',
                    __dirname + '/flows',
                ],
            })

            this.createObjectCommandsFromFilesIn({
                folders: [
                    __dirname + '/components',
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
}

module.exports = Classification.define(SirensNamespace)
