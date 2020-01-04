const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../../skins/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')

class DocumentationImplementationNoteComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const implementationNote = flow.getValue()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({
                    text: `Implementation note`,
                    css: [ 'title-2', ],
                    wrapMode: 'wordChar',
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.text({
                    text: implementationNote.getText(),
                    wrapMode: 'wordChar',
                    hasScrollBars: false,
                    editable: false,
                    viewAttributes: { stackSize: 'fixed' },
                })

            })
        })
    }
}

module.exports = Classification.define(DocumentationImplementationNoteComponent)
