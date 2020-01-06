const Classification = require('../../src/O').Classification
const Component = require('../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../src/skins/protocols/ComponentProtocol_Implementation')
const SkinsGtk = require('../../src/skins/gtk-views/SkinsGtk')
const GtkIcons = require('../../src/skins/gtk-views/constants/GtkIcons')
const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    afterInstantiation() {
        this.setNamespace( namespace )
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
                            image: {
                                iconName: GtkIcons.open,
                                size: GtkIcons.size._24x24,
                            },
                            tooltip: 'Opens a file',
                            enabled: true,
                            action: component.openFile.bind(component),
                        })

                        this.separator()

                        this.button({
                            label: 'Save file',
                            image: {
                                iconName: GtkIcons.save,
                                size: GtkIcons.size._24x24,
                            },
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

SkinsGtk.do( () => {
    CustomComponent.new().open()
})