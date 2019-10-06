const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

class ImplementationNoteDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const index = this.getProps().index + 1
        const implementationNote = this.getProps().implementationNote

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.stockIcon({
                    name: GtkIcons.dialogWarning,
                    size: GtkIcons.size._32x32,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.verticalStack( function() {
                    this.label({
                        text: `Implementation note # ${index}`,
                    })

                    this.label({
                        text: implementationNote,
                    })
                })

            })

            this.verticalSeparator()

        })
    }
}

module.exports = Classification.define(ImplementationNoteDocumentation)
