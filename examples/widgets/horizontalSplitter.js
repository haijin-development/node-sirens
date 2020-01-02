const Classification = require('../../src/O').Classification
const Component = require('../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../src/skins/protocols/ComponentProtocol_Implementation')
const SkinsGtk = require('../../src/skins/gtk-views/SkinsGtk')
const SkinsNamespace = require('../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    afterInstantiation() {
        this.setNamespace( namespace )
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

SkinsGtk.do( () => {
    CustomComponent.new().open()
})