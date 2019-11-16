const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const ClassMethodsDocumentation = require('./ClassMethodsDocumentation')
const ClassUnformattedComment = require('./unformatted-documentation/ClassUnformattedComment')
const ClassFormattedComment = require('./formatted-documentation/ClassFormattedComment')

class DocumentationBrowserBody {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectedTabPageIndex', 'isRendering']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const model = this.getModel()

        this.reRenderOnValueChangeOf( model.getChild({ id: 'classDefinition' }) )
    }

    reRender() {
        try {
            this.isRendering = true

            this.previousClassificationDo( () => {
                this.reRender()
            })
        } finally {
            this.isRendering = false
        }
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const showsUnformattedComments = model.showsUnformattedComments()

        componentsRenderer.render( function(component) {

            this.tabs({ aligment: 'top', id: 'tabs' }, function() {

                this.handlers({
                    onTabPageChanged: component.onTabPageChanged.bind(component),
                })

                this.tabPage({ label: 'Class methods' }, function() {

                    this.component(
                        ClassMethodsDocumentation.new({
                            model: model
                        })
                    )

                })

                this.tabPage({ label: 'Class comment' }, function() {

                    if( showsUnformattedComments ) {

                        this.component(
                            ClassUnformattedComment.new({
                                model: model,
                                window: this.getProps().window,
                            })
                        )

                    } else {

                        this.component(
                            ClassFormattedComment.new({
                                model: model,
                                window: this.getProps().window,
                            })
                        )

                    }

                })

            })

        })

        this.selectPreviousSelectedTabPage()
    }

    selectPreviousSelectedTabPage() {
        if( this.selectedTabPageIndex < 0 ) { return }

        const tabsComponent = this.getChildComponent({ id: 'tabs' })

        tabsComponent.showTabPageAt({ index: this.selectedTabPageIndex })
    }

    onTabPageChanged({ tabPageIndex: tabPageIndex }) {
        if( this.isRendering === true ) { return }

        this.selectedTabPageIndex = tabPageIndex
    }
}


module.exports = Classification.define(DocumentationBrowserBody)
