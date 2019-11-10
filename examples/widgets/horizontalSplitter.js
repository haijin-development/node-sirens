const Classification = require('../../src/o-language/classifications/Classification')
const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentProtocol_Implementation = require('../../src/gui/protocols/ComponentProtocol_Implementation')

const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
        this.classificationBehaviours = [ComponentInstantiator]
    }

    /// Building

    renderWith(componentsRenderer) {
        componentsRenderer.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 600,
                    height: 100,
                })

                this.horizontalSplitter( function() {

                    this.label({
                        viewAttributes: { splitProportion: 3.0/6 },
                        text: 'Label 1'
                    })

                    this.label({
                        viewAttributes: { splitProportion: 1.0/6 },
                        text: 'Label 2'
                    })

                    this.label({
                        viewAttributes: { splitProportion: 1.0/6 },
                        text: 'Label 3'
                    })

                    this.label({
                        viewAttributes: { splitProportion: 1.0/6 },
                        text: 'Label 4'
                    })

                })
            })
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})