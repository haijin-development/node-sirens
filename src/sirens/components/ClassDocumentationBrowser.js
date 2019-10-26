const Classification = require('../../o-language/classifications/Classification')
const ComponentInstantiator = require('../../gui/components/ComponentInstantiator')
const Component = require('../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../gui/protocols/ComponentProtocol')
const ClassDocumentationBrowserModel = require('../models/ClassDocumentationBrowserModel')
const ClassDocumentationMenuBar = require('./class-documentation-browser/ClassDocumentationMenuBar')
const ClassDocumentationToolBar = require('./class-documentation-browser/ClassDocumentationToolBar')
const DocumentationBrowserBody = require('./class-documentation-browser/DocumentationBrowserBody')
const Sirens = require('../../Sirens')

class ClassDocumentationBrowser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Initializing

    /**
     * Returns a new ClassDocumentationBrowserModel.
     */
    defaultModel() {
        const classDefinition = this.getProps().classDefinition

        const selectedMethodName = this.getProps().methodName

        return ClassDocumentationBrowserModel.new({
            classDefinition: classDefinition,
            selectedMethodName: selectedMethodName,
        })
    }

    /// Actions

    openClassEditor() {
        Sirens.openClassEditor()
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

    /// Querying

    getWindowTitle() {
        const className = this.getModel().getClassName()

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

        const methodName = this.getProps().methodName

        if( methodName === undefined || methodName === null ) {
            const tabsComponent = this.getChildComponent({ id: 'tabs' })

            tabsComponent.showTabPageAt({ index: 1 })
        }
    }
}

module.exports = Classification.define(ClassDocumentationBrowser)