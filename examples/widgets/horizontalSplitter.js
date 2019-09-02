const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.horizontalSplitter( function() {

                    this.label({
                        splitProportion: 3.0/6,
                        text: 'Label 1'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 2'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 3'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 4'
                    })

                })
            })
        })
    }
}

CustomComponent = ComponentInstantiator.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})