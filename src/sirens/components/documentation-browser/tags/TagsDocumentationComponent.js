const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {
                this.image({
                    filename: Resource.image.tag,
                    width: 24,
                    height: 24,
                    viewAttributes: {
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
                                stackPadding: 6,
                            },
                        })
                    })
                })

                if( isInEditionMode ) {
                    this.spaceFiller()

                    this.textButton({
                        image: {
                            iconName: icon.edit,
                            size: icon.size._16x16,
                        },
                        onClicked: () => {
                            flow.editMethodTags({
                                parentWindow: component.getProps().window
                            })
                        },
                    })
                }

            })
        })
    }
}

module.exports = Classification.define(TagsDocumentationComponent)
