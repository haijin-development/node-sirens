const expect = require('chai').expect
const Component = require('../../../../../src/skins/components/Component')
const LabelView = require('../../../../../src/skins/gtk-views/LabelView')

describe('When using a Splitter', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const splitter = Component.render( function(renderer) {
                this.horizontalSplitter()
            })

            expect( splitter.getChildComponents() ) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length) .to .eql(1)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 2 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length ) .to .eql(2)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 3 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length) .to .eql(3)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[2].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 4 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length) .to .eql(4)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[2].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[3].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const splitter = Component.render( function(renderer) {
                this.verticalSplitter()
            })

            expect( splitter.getChildComponents() ) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length ) .to .eql(1)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 2 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length ) .to .eql(2)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 3 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length) .to .eql(3)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[2].getView().isBehavingAs(LabelView) ) .to .be .true
        })

        it('adds 4 sub-components', () => {
            const splitter = Component.render( function(renderer) {
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

            expect( splitter.getChildComponents().length ) .to .eql(4)
            expect( splitter.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[1].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[2].getView().isBehavingAs(LabelView) ) .to .be .true
            expect( splitter.getChildComponents()[3].getView().isBehavingAs(LabelView) ) .to .be .true
        })
    })
})
