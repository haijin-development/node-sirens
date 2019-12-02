const Classification = require('../../src/O').Classification
const Component = require('../../src/Skins').Component
const ComponentProtocol_Implementation = require('../../src/Skins').ComponentProtocol_Implementation
const ComponentInstantiator = require('../../src/Skins').ComponentInstantiator
const Sirens = require('../../src/Sirens')

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
                    width: 100,
                    height: 100,
                })

                this.textButton({
                    text: 'A text button',
                    onClicked: () => {
                        console.info('Clicked. You should see a log in 1 second.')
                        setTimeout( () => { console.info('node event loop is working ...') }, 1000)
                    },
                })
            })
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})