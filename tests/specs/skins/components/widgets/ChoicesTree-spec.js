const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a ChoicesTree', () => {
    let componentRenderer
    let tree

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
        tree = null
    })

    describe('model', () => {
        beforeEach( () => {
            const treeModel = namespace.Models.TreeChoiceModel.new({
                roots: [],
                getChildrenClosure: () => { return ['1', '2', '3'] }
            })

            tree = componentRenderer.render( function() {
                this.treeChoice( function() {
                    this.model( treeModel )

                    this.column({
                        label: 'col 1'
                    })
                })
            })
        })

        it('has a VirtualTreeModel', () => {
            expect(tree.getModel().getSelectionValue()) .to .eql(null)
            expect(tree.getModel().getRoots()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            tree.getModel().setRoots({ items: ['a', 'b', 'c'] })
            tree.getModel().setSelectionPath({ objectsHierarchy: ['c'] })

            expect(tree.getView().getSelectionIndices()) .to .eql([ [2] ])
        })

        it('updates the items when the model roots changes', () => {
            tree.getModel().setRoots({ items: ['a', 'b', 'c'] })

            expect(tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe( 'constructor', () =>{
        it('has a empty roots', () => {
            tree = componentRenderer.render( function() {
                this.treeChoice( function() {
                    this.column({
                        label: 'col 1'
                    })
                })
            })

            expect(tree.getView().getRows()) .to .eql([])
            expect(tree.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the roots on its constructor', () => {
            tree = componentRenderer.render( function() {
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

            expect(tree.getModel().getSelectionValue()) .to .eql('c')
            expect(tree.getModel().getRoots()) .to .eql(['a','b','c'])

            expect(tree.getView().getSelectionIndices()) .to .eql([[2]])
            expect(tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        beforeEach( () => {
            tree = componentRenderer.render( function() {
                this.treeChoice( function() {
                    this.column({
                        label: 'col 1'
                    })
                })
            })
        })

        it('sets and gets the width', () => {
            tree.mergeProps({
                width: 10
            })

            expect(tree.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            tree.mergeProps({
                height: 10
            })

            expect(tree.getView().getHeight()) .to .eql(10)
        })
    })
})
