const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const Resource = require('../../objects/Resource')
const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

class ClassCommentHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        const editionClosure = this.getProps().editionClosure

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginBottom: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.class,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    text: className,
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

                if( editionClosure !== undefined ) {
                    this.textButton({
                        text: ' Edit...',
                        image: {
                            iconName: GtkIcons.edit,
                            size: GtkIcons.size._16x16,
                        },
                        onClicked: editionClosure,
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })
                }

            })

            this.verticalSeparator()

        })
    }
}

module.exports = Classification.define(ClassCommentHeader)
