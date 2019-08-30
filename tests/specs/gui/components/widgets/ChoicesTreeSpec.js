const expect = require('chai').expect
const ChoicesTree = require('../../../../../src/gui/components/widgets/ChoicesTree')
const Column = require('../../../../../src/gui/componentBuilder/Column')
const TreeChoiceModel = require('../../../../../src/gui/models/TreeChoiceModel')

describe('When using a ChoicesTree', () => {
    beforeEach( () => {
        const treeModel = TreeChoiceModel.new({
            roots: [],
            getChildrenBlock: () => { return ['1', '2', '3'] }
        })

        this.tree = ChoicesTree.new({
            model: treeModel,
            columns: [ Column.new({ label: 'col 1' }) ],
        })
    })

    describe('model', () => {
        it('has a ChoiceModel', () => {
            expect(this.tree.getModel().getSelectionPath()) .to .eql(null)
            expect(this.tree.getModel().getRoots()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            this.tree.getModel().setRoots(['a', 'b', 'c'])
            this.tree.getModel().setSelectionPath(['c'])

            expect(this.tree.getView().getSelectionIndices()) .to .eql([ [2] ])
        })

        it('updates the items when the model roots changes', () => {
            this.tree.getModel().setRoots(['a', 'b', 'c'])

            expect(this.tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe( 'constructor', () =>{
        it('has a empty choices', () => {
            expect(this.tree.getView().getRows()) .to .eql([])
            expect(this.tree.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the choices on its constructor', () => {
            this.tree = ChoicesTree.new({
                columns: [ Column.new({ label: 'col 1' }) ],
                roots: ['a','b','c'],
                setSelectionPath: ['c']
            })

            expect(this.tree.getModel().getSelectionPath()) .to .eql(['c'])
            expect(this.tree.getModel().getRoots()) .to .eql(['a','b','c'])

            expect(this.tree.getView().getSelectionIndices()) .to .eql([[2]])
            expect(this.tree.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            this.tree.setProps({
                width: 10
            })

            expect(this.tree.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            this.tree.setProps({
                height: 10
            })

            expect(this.tree.getView().getHeight()) .to .eql(10)
        })
    })
})
