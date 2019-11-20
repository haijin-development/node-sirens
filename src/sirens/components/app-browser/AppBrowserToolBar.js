const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../Skins').GtkIcons
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
                    enabled: model.getChild({ id: 'openApplicationFolder' }),
                })

                this.separator()

                this.button({
                    label: 'Open class documentation browser',
                    image: {
                        iconName: GtkIcons.info,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a class documentation browser.',
                    action: component.getProps().openClassDocumentation,
                    enabled: model.getChild({ id: 'openClassDocumentation' }),
                })

                this.button({
                    label: 'Open class editor',
                    image: {
                        filename: Resource.image.class,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a class editor.',
                    action: component.getProps().openClassEditor,
                    enabled: model.getChild({ id: 'openClassEditor' }),
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
                    enabled: model.getChild({ id: 'openPlayground' }),
                })

            })

        })
    }
}

module.exports = Classification.define(AppBrowserToolBar)
