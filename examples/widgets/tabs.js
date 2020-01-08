const Classification = require('../../src/O').Classification
const Component = require('../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../src/skins/protocols/ComponentProtocol_Implementation')
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
                    width: 100,
                    height: 100,
                })

                this.horizontalStack( function() {

                    this.tabs( function() {
                        this.tabPage({ label: 'Left 1' }, function() {
                            this.label({
                                text: 'Page 1'
                            })
                        })

                        this.tabPage({ label: 'Left 2' }, function() {
                            this.label({
                                text: 'Page 2'
                            })
                        })

                        this.tabPage({ label: 'Left 3' }, function() {
                            this.label({
                                text: 'Page 3'
                            })
                        })
                    })

                    this.tabs({ aligment: 'right' }, function() {
                        this.tabPage({ label: 'Right 1' }, function() {
                            this.label({
                                text: 'Page 1'
                            })
                        })

                        this.tabPage({ label: 'Right 2' }, function() {
                            this.label({
                                text: 'Page 2'
                            })
                        })

                        this.tabPage({ label: 'Right 3' }, function() {
                            this.label({
                                text: 'Page 3'
                            })
                        })
                    })

                    this.tabs({ aligment: 'top' }, function() {
                        this.tabPage({ label: 'Top 1' }, function() {
                            this.label({
                                text: 'Page 1'
                            })
                        })

                        this.tabPage({ label: 'Top 2' }, function() {
                            this.label({
                                text: 'Page 2'
                            })
                        })

                        this.tabPage({ label: 'Top 3' }, function() {
                            this.label({
                                text: 'Page 3'
                            })
                        })
                    })

                    this.tabs({ aligment: 'bottom' }, function() {
                        this.tabPage({ label: 'Bottom 1' }, function() {
                            this.label({
                                text: 'Page 1'
                            })
                        })

                        this.tabPage({ label: 'Bottom 2' }, function() {
                            this.label({
                                text: 'Page 2'
                            })
                        })

                        this.tabPage({ label: 'Bottom 3' }, function() {
                            this.label({
                                text: 'Page 3'
                            })
                        })
                    })
                })
            })
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

namespace.useGtkViews()
namespace.withGUIDo( () => {
    CustomComponent.new().open()
})