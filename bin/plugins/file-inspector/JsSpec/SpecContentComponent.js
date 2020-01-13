const Classification = require('../../../../src/O').Classification
const Component = require('../../../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../src/skins/protocols/ComponentProtocol_Implementation')

/*
    Class(`
        This Component shows a SpecFileContentsInspectorFlow in a browsable user
        interface.
    `)
*/
class SpecContentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /*
        Method(`
            Create the child components to browse the SpecFileContentsInspectorFlow
            model and connect them to the flow.
        `)

        Tags([
            `rendering`
        ])
    */
    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const fileObject = flow.getValue()

        componentsRenderer.render( function(component) {

            this.verticalSplitter( function() {

                this.verticalStack( function() {

                    this.styles({
                        viewAttributes: { splitProportion: 1.0 / 2 },
                    })

                    this.text( function() {
                        this.model(
                            flow.getFlowPoint({ id: 'selectedSpecFullDescription' })
                        )

                        this.styles({
                            editable: false,
                        })
                    })                

                    this.spaceFiller( function() {

                        this.treeChoice( function(tree) {
                            const treeModel = flow.getFlowPoint({ id: 'specObjects' })

                            this.model( treeModel )

                            this.styles({
                                showHeaders: false,
                                clickableHeaders: false,
                                viewAttributes: { splitProportion: 1.0 / 2 },
                            })

                            this.column({
                                label: '',
                                getImageClosure: function(specObject) { return specObject.getIcon() },
                                imageWidth: 24,
                                imageHeight: 24,
                            })

                            this.column({
                                label: '',
                                getTextClosure: function(specObject) { return specObject.getDisplayString() },
                            })

                        })

                    })

                })

                this.text( function() {
                    this.model(
                        flow.getFlowPoint({ id: 'selectedSpecContents' })
                    )

                    this.styles({
                        viewAttributes: { splitProportion: 1.0 / 2 },
                    })

                    this.popupMenu( function() {
                        this.separator()

                        this.item({
                            label: 'Save spec',
                            action: function() { flow.saveSelectedSpec() },
                        })
                    })
                })
            })
        })
    }
}

module.exports = Classification.define(SpecContentComponent)
