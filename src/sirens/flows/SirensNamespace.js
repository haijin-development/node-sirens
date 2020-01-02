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

            this.defineMethodsAsCreateObjectCommands({
                methods: [
                    'ObjectBrowserFlow',
                    'PrototypesBrowserFlow',
                    'AppBrowserFlow',
                    'PlaygroundBrowserFlow',
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

    // 

    ObjectBrowserFlow() {
        return ObjectBrowserFlow.new()
    }

    PrototypesBrowserFlow() {
        return PrototypesBrowserFlow.new()
    }

    AppBrowserFlow() {
        return AppBrowserFlow.new()
    }

    PlaygroundBrowserFlow() {
        return PlaygroundBrowserFlow.new()
    }

    ObjectBrowser(props) {
        return ObjectBrowser.new(props)
    }

    PrototypeBrowser(props) {
        return PrototypeBrowser.new(props)
    }

    PlaygroundBrowser(props) {
        return PlaygroundBrowser.new(props)
    }

    AppBrowser(props) {
        return AppBrowser.new(props)
    }
}

module.exports = Classification.define(SirensNamespace)
