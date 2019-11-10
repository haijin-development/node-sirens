const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ClassesComponent = require('../class-editor/ClassesComponent')
const DocumentationBrowserBody = require('../class-documentation-browser/DocumentationBrowserBody')

class SelectedFileComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const renderSelectedFileModel = this.getModel().getRenderSelectedFileModel()

        this.reRenderOnValueChangeOf( renderSelectedFileModel )
    }

    showFirstTabPage() {
        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        const hasNoClassDefinition = this.getModel().hasNoClassDefinition()

        if( hasNoClassDefinition === true ) {
            tabsComponent.showTabPageAt({ index: 0 })
        } else {
            tabsComponent.showTabPageAt({ index: 1 })
        }
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                const classEditorModel = model.getClassEditorModel()

                this.component(
                    ClassesComponent.new({
                        model: classEditorModel.getClassesDefinitionsModel(),
                        footerModel: classEditorModel.getFooterSourceCodeModel(),
                    })
                )

            })
        })

        this.showFirstTabPage()
    }
}

module.exports = Classification.define(SelectedFileComponent)
