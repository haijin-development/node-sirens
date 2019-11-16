const Classification = require('../../src/O').Classification
const Component = require('../../src/Skins').Component
const ComponentProtocol_Implementation = require('../../src/Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../src/Skins').ComponentInstantiator
const Sirens = require('../../src/Sirens')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Actions

    openFile() {
        console.info('openFile')
    }

    createFile() {
        console.info('createFile')
    }

    cut() {
        console.info('cut')        
    }

    copy() {
        console.info('copy')        
    }

    paste() {
        console.info('paste')        
    }

    /// Building

    renderWith(componentsRenderer) {
        componentsRenderer.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.verticalStack( function() {

                    this.menuBar( function() {

                        this.styles({
                            viewAttributes: {
                                stackSize: 'fixed',
                            }
                        })

                        this.menuGroup({ label: 'File' }, function() {
                            this.item({
                                label: 'Open file...',
                                enabled: true,
                                action: component.openFile.bind(component),
                            })

                            this.item({
                                label: 'New file',
                                enabled: true,
                                action: component.createFile.bind(component),
                            })
                        })

                        this.menuGroup({ label: 'Edit' }, function() {
                            this.item({
                                label: 'Cut',
                                action: component.cut.bind(component),
                            })

                            this.item({
                                label: 'Copy',
                                action: component.copy.bind(component),
                            })

                            this.item({
                                label: 'Paste',
                                action: component.paste.bind(component),
                            })
                        })
                    })

                })

            })
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})