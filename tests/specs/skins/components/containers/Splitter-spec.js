const expect = require('chai').expect
const SkinsNamespace = require('../../../../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

describe('When using a Splitter', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalSplitter()
            })

            expect( splitter.getChildComponents() ) .count .to .eql( 0 )
        })

        it('adds 1 sub-component', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.5 },
                    })
                })
            })

            expect( splitter.getChildComponents()) .count .to .eql(1)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 2 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.5 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.5 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(2)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 3 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.3 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.3 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.3 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(3)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(2) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 4 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(4)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(2) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(3) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalSplitter()
            })

            expect( splitter.getChildComponents() ) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(1)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 2 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(2)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 3 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })
                })
            })

            expect( splitter.getChildComponents()) .count .to .eql(3)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(2) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })

        it('adds 4 sub-components', () => {
            const splitter = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalSplitter( function() {
                    this.styles({
                        width: 300,
                        height: 100
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })

                    this.label({
                        viewAttributes: { splitProportion: 0.25 },
                    })
                })
            })

            expect( splitter.getChildComponents() ) .count .to .eql(4)

            expect( splitter.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(2) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( splitter.getChildComponents() ) .atIndex(3) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })
    })
})
