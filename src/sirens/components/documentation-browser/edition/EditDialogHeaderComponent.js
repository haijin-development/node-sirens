const Classification = require('../../../../O').Classification
const FilePath = require('../../../../O').FilePath
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

class EditDialogHeaderComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const mainIcon = this.getProps().mainIcon
        const title = this.getProps().title
        const subtitle = this.getProps().subtitle

        const imageIsFile = FilePath.new({ path: mainIcon }).exists()

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                if( imageIsFile ) {

                    this.image({
                        filename: mainIcon,
                        width: 32,
                        height: 32,
                    })

                } else {

                    this.image({
                        iconName: mainIcon,
                        size: icon.size._32x32,
                    })

                }

                this.spaceFiller()

                this.image({
                    iconName: icon.edit,
                    size: icon.size._24x24,
                    marginRight: 10,
                })

                this.verticalStack( function() {

                    this.label({
                        text: title,
                        css: [ 'title-1', ],
                    })

                    this.label({
                        text: subtitle,
                    })

                })

                this.spaceFiller()

            })

        })

    }

}

module.exports = Classification.define(EditDialogHeaderComponent)
