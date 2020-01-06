const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../../skins/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')

class TagsDocumentationComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const tags = this.getProps().tags

        const isInEditionMode = flow.isInEditionMode()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.horizontalStack( function() {

                    this.image({
                        filename: Resource.image.tag,
                        width: 24,
                        height: 24,
                        viewAttributes: {
                            stackSize: 'fixed',
                            stackPadding: 10,
                        },
                    })

                    this.horizontalStack( function() {
                        tags.forEach( (tag) => {
                            const tagLabel = tag.getLabel()

                            this.label({
                                text: tagLabel,
                                css: [ 'tag-label', tagLabel ],
                                viewAttributes: {
                                    stackSize: 'fixed',
                                    stackPadding: 6,
                                },
                            })
                        })
                    })

                    this.label({ viewAttributes: { stackSize: 'filled' } })

                    if( isInEditionMode ) {
                        this.textButton({
                            image: {
                                iconName: GtkIcons.edit,
                                size: GtkIcons.size._16x16,
                            },
                            viewAttributes: { stackSize: 'fixed' },
                            onClicked: () => {
                                flow.editMethodTags({ parentWindow: this.getProps().window })
                            },
                        })
                    }

                })
            })

        })
    }
}

module.exports = Classification.define(TagsDocumentationComponent)
