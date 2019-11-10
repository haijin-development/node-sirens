const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

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
