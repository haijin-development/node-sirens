const Classification = require('../../src/o-language/classifications/Classification')
const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentProtocol_Implementation = require('../../src/gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../src/gui/protocols/ComponentProtocol')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')
const GtkIcons = require('../../src/gui/gtk-views/constants/GtkIcons')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Actions

    openFile() {
        console.info('openFile')
    }

    createFile() {
        console.info('createFile')
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

                    this.toolBar( function() {

                        this.styles({
                            viewAttributes: {
                                stackSize: 'fixed',
                            }
                        })

                        this.button({
                            label: 'Open file...',
                            icon: GtkIcons.open,
                            tooltip: 'Opens a file',
                            enabled: true,
                            action: component.openFile.bind(component),
                        })

                        this.separator()

                        this.button({
                            label: 'Save file',
                            icon: GtkIcons.save,
                            tooltip: 'Saves the file',
                            enabled: true,
                            action: component.createFile.bind(component),
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