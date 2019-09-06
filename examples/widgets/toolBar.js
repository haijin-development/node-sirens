const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')
const GtkIcons = require('../../src/gui/gtk-views/GtkIcons')

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

    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.verticalStack( function() {

                    this.toolBar( function() {

                        this.styles({
                            viewCustomAttributes: {
                                packExpand: false,
                            }
                        })

                        this.item({
                            label: 'Open file...',
                            icon: GtkIcons.openFile,
                            tooltip: 'Opens a file',
                            enabled: true,
                            action: component.openFile.bind(component),
                        })

                        this.separator()

                        this.item({
                            label: 'Save file',
                            icon: GtkIcons.saveFile,
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

CustomComponent = ComponentInstantiator.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})