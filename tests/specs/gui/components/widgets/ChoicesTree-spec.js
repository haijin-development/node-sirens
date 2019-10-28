const expect = require('chai').expect
const Component = require('../../../../../src/gui/components/Component')
const TreeChoiceModel = require('../../../../../src/gui/models/TreeChoiceModel')

describe('When using a ChoicesTree', () => {
    beforeEach( () => {
        const treeModel = TreeChoiceModel.new({
            roots: [],
            getChildrenBlock: () => { return ['1', '2', '3'] }
        })

        this.tree = Component.render( function(renderer) {
            this.treeChoice( function() {
                this.model( treeModel )

                this.column({
                    label: 'col 1'
                })
            })
        })
    })

    describe('model', () => {
        it('has a ChoiceModel', () => {
            expect(this.tree.getModel().getSelectionValue()) .to .eql(null)
            expect(this.tree.getModel().getRoots()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            this.tree.getModel().setRoots({ items: ['a', 'b', 'c'] })
            this.tree.getModel().setSelectionPath({ objectsHierarchy: ['c'] })

            expect(this.tree.getView().getSelectionIndices()) .to .eql([ [2] ])
        })

        it('updates the items when the model roots changes', () => {
            this.tree.getModel().setRoots({ items: ['a', 'b', 'c'] })

            expect(this.tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe( 'constructor', () =>{
        it('has a empty choices', () => {
            expect(this.tree.getView().getRows()) .to .eql([])
            expect(this.tree.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the choices on its constructor', () => {
            this.tree = Component.render( function(renderer) {
                this.treeChoice( function() {
                    this.styles({
                        roots: ['a','b','c'],
                        selectionPath: ['c']
                    })

                    this.column({
                        label: 'col 1'
                    })
                })
            })

            expect(this.tree.getModel().getSelectionValue()) .to .eql('c')
            expect(this.tree.getModel().getRoots()) .to .eql(['a','b','c'])

            expect(this.tree.getView().getSelectionIndices()) .to .eql([[2]])
            expect(this.tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            this.tree.mergeProps({
                width: 10
            })

            expect(this.tree.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            this.tree.mergeProps({
                height: 10
            })

            expect(this.tree.getView().getHeight()) .to .eql(10)
        })
    })
})
