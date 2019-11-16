const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const ClassEditorMenuBar = require('./ClassEditorMenuBar')
const ClassEditorToolBar = require('./ClassEditorToolBar')

class ClassEditorMenu {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const props = this.getProps()

        componentsRenderer.render(function (component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.component(
                    ClassEditorMenuBar.new( props )
                )

                this.component(
                    ClassEditorToolBar.new( props )
                )

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenu)
