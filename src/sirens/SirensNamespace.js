const Classification = require('../O').Classification
const NamespaceFlow = require('../finger-tips/flows/NamespaceFlow')

const SkinsNamespace = require('../skins/SkinsNamespace')
const GuiNamespace = require('./GuiNamespace')

const DocumentationReaderPicker = require('./objects/documentation/DocumentationReaderPicker')
const FileInspectorPicker = require('./objects/file-structure/FileInspectorPicker')

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

            // Override commands with singleton instances

            thisFlow.removeChildFlow({ id: 'DocumentationReaderPicker' })
            this.createSingletonObject({
                id: 'DocumentationReaderPicker',
                singletonCreator: function() {
                    return DocumentationReaderPicker.new()
                },
            })

            thisFlow.removeChildFlow({ id: 'FileInspectorPicker' })
            this.createSingletonObject({
                id: 'FileInspectorPicker',
                singletonCreator: function() {
                    return FileInspectorPicker.new()
                },
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
