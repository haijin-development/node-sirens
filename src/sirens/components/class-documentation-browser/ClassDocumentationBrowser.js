const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator

const ClassDocumentationBrowserFlow = require('../../flows/class-documentation-browser/ClassDocumentationBrowserFlow')
const ClassDocumentationMenuBar = require('./ClassDocumentationMenuBar')
const ClassDocumentationToolBar = require('./ClassDocumentationToolBar')
const DocumentationBrowserBody = require('./DocumentationBrowserBody')
const Sirens = require('../../../Sirens')

class ClassDocumentationBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ClassDocumentationBrowserFlow.
     */
    defaultModel() {
        const classDefinition = this.getProps().classDefinition

        const methodName = this.getProps().methodName

        const flow = ClassDocumentationBrowserFlow.new().asFlowPoint()

        flow.setBrowsedClass({ classDefinition: classDefinition })

        flow.setBrowsedMethod({ methodName: methodName })

        return flow
    }

    /// Querying

    getWindowTitle() {
        const className = this.getModel().getBrowsedClass().getClassName()

        return `Class ${className} documentation`
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.window( function() {

                this.styles({
                    title: component.getWindowTitle(),
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function () {

                    this.component(
                        ClassDocumentationMenuBar.new({
                            model: flow,
                            reloadClassDefinition: () => { flow.reloadClassDefinition() },
                            openClassDocumentation: () => { flow.openClassDocumentation() },
                            openClassEditor: () => { flow.openClassEditor() },
                            openPlayground: () => { flow.openPlayground() },
                        })
                    )

                    this.component(
                        ClassDocumentationToolBar.new({
                            model: flow,
                            reloadClassDefinition: () => { flow.reloadClassDefinition() },
                            openClassDocumentation: () => { flow.openClassDocumentation() },
                            openClassEditor: () => { flow.openClassEditor() },
                            openPlayground: () => { flow.openPlayground() },
                        })
                    )

                    this.component(
                        DocumentationBrowserBody.new({
                            model: flow,
                            window: this,
                        })
                    )

                })

            })
        })

        this.showClassTabPageIfNoMethodIsSelected()
    }

    /// Actions

    showClassTabPageIfNoMethodIsSelected() {
        const methodName = this.getProps().methodName

        if( methodName === undefined || methodName === null ) {
            const tabsComponent = this.getChildComponent({ id: 'tabs' })

            tabsComponent.showTabPageAt({ index: 1 })
        }        
    }
}

module.exports = Classification.define(ClassDocumentationBrowser)