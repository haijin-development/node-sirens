const expect = require('chai').expect
const ChoicesList = require('../../../../src/components/widgets/ChoicesList')
const Column = require('../../../../src/componentBuilder/Column')

describe('When using a ChoicesList', () => {
    beforeEach( () => {
        this.list = new ChoicesList({
            columns: [new Column({label: 'col 1'})],
        })
    })

    describe('model', () => {
        it('has a ChoiceModel', () => {
            expect(this.list.getModel().getSelection()) .to .eql(null)
            expect(this.list.getModel().getChoices()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])
            this.list.getModel().setSelection('c')

            expect(this.list.getView().getSelectionIndices()) .to .eql([2])
        })

        it('updates the items when the model choices changes', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            expect(this.list.getView().getRows()) .to .eql(['a','b','c'])
        })

        it('updates the items when the model adds a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getList().insert(1, 'd', 'e')

            expect(this.list.getView().getRows()) .to .eql(['a','d', 'e','b','c'])
        })

        it('updates the items when the model updates a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getList().update({indices: [0, 2], items: ['d', 'e']})

            expect(this.list.getView().getRows()) .to .eql(['d', 'b', 'e'])
        })

        it('updates the items when the model deletes a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getList().removeAll(['a', 'b'])

            expect(this.list.getView().getRows()) .to .eql(['c'])
        })
    })


    describe( 'constructor', () =>{
        it('has a empty choices', () => {
            expect(this.list.getView().getRows()) .to .eql([])
            expect(this.list.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the choices on its constructor', () => {
            this.list = new ChoicesList({
                columns: [ new Column({label: 'col 1'}) ],
                choices: ['a','b','c'],
                selection: 'c'
            })

            expect(this.list.getModel().getSelection()) .to .eql('c')
            expect(this.list.getModel().getChoices()) .to .eql(['a','b','c'])

            expect(this.list.getView().getSelectionIndices()) .to .eql([2])
            expect(this.list.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            this.list.setProps({
                width: 10
            })

            expect(this.list.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            this.list.setProps({
                height: 10
            })

            expect(this.list.getView().getHeight()) .to .eql(10)
        })

        it('sets and gets the showHeaders', () => {
            this.list.setProps({
                showHeaders: false
            })

            expect(this.list.getView().getShowHeaders()) .to .eql(true)
        })

        it('sets and gets the clickableHeaders', () => {
            this.list.setProps({
                clickableHeaders: false
            })

            expect(this.list.getView().getClickableHeaders()) .to .eql(false)
        })
    })
})
