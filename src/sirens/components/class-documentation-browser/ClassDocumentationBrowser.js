const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../../Skins').ComponentInstantiator

const ClassDocumentationBrowserModel = require('../../models/class-documentation-browser/ClassDocumentationBrowserModel')
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
     * Returns a new ClassDocumentationBrowserModel.
     */
    defaultModel() {
        const classDefinition = this.getProps().classDefinition

        const methodName = this.getProps().methodName

        const model = ClassDocumentationBrowserModel.new()

        model.setBrowsedClass({ classDefinition: classDefinition })

        model.setBrowsedMethod({ methodName: methodName })

        return model
    }

    /// Querying

    getWindowTitle() {
        const className = this.getModel().getBrowsedClass().getClassName()

        return `Class ${className} documentation`
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

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
                            model: model,
                            openClassEditor: component.openClassEditor.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                        })
                    )

                    this.component(
                        ClassDocumentationToolBar.new({
                            model: model,
                            openClassEditor: component.openClassEditor.bind(component),
                            openPlayground: component.openPlayground.bind(component),
                            openClassDocumentation: component.openClassDocumentation.bind(component),
                        })
                    )

                    this.component(
                        DocumentationBrowserBody.new({
                            model: model,
                            window: this,
                        })
                    )

                })

            })
        })

        this.showClassTabPageIfNoMethodIsSelected()
    }

    /// Actions

    openClassEditor() {
        const filename = this.getModel().getBrowsedClass().getSourceFile().getFilePath()

        Sirens.openClassEditor({ filename: filename })
    }

    openClassDocumentation() {
        const classDefinition = this.getProps().classDefinition

        Sirens.browseClassDocumentation({
            classDefinition: classDefinition
        })
    }

    openPlayground() {
        Sirens.openPlayground()
    }

    showClassTabPageIfNoMethodIsSelected() {
        const methodName = this.getProps().methodName

        if( methodName === undefined || methodName === null ) {
            const tabsComponent = this.getChildComponent({ id: 'tabs' })

            tabsComponent.showTabPageAt({ index: 1 })
        }        
    }
}

module.exports = Classification.define(ClassDocumentationBrowser)