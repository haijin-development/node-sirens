const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation

const GtkIcons = require('../../../GUI').GtkIcons
const Resource = require('../../objects/Resource')

class AppBrowserToolBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render(function (component) {

            this.toolBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.button({
                    label: 'Open folder...',
                    image: {
                        iconName: GtkIcons.open,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens an app folder.',
                    action: component.getProps().openFolder,
                })

                this.separator()

                this.button({
                    label: 'Open class editor',
                    image: {
                        filename: Resource.image.class,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a class editor.',
                    action: component.getProps().openClassEditor,
                })

                this.button({
                    label: 'Open class documenation browser',
                    image: {
                        iconName: GtkIcons.info,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a class documenation browser.',
                    action: component.getProps().openClassDocumentation,
                })

                this.separator()

                this.button({
                    label: 'Open playground',
                    image: {
                        filename: Resource.image.haiku,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a playground.',
                    action: component.getProps().openPlayground,
                })

            })

        })
    }
}

module.exports = Classification.define(AppBrowserToolBar)
