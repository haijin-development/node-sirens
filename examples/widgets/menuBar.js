const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
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

    renderWith(builder) {
        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.verticalStack( function() {

                    this.menuBar( function() {

                        this.styles({
                            viewCustomAttributes: {
                                packExpand: false,
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

CustomComponent = ComponentInstantiator.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})