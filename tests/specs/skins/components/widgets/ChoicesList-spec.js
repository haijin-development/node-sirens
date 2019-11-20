const expect = require('chai').expect
const Component = require('../../../../../src/skins/components/Component')

describe('When using a ChoicesList', () => {
    beforeEach( () => {
        this.list = Component.render( function(renderer) {
            this.listChoice( function() {
                this.column({
                    label: 'col 1'
                })
            })
        })
    })

    describe('model', () => {
        it('has a ChoiceModel', () => {
            expect(this.list.getModel().getSelectionValue()) .to .eql(null)
            expect(this.list.getModel().getChoices()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])
            this.list.getModel().setSelectionValue('c')

            expect(this.list.getView().getSelectionIndices()) .to .eql([2])
        })

        it('updates the items when the model choices changes', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            expect(this.list.getView().getRows()) .to .eql(['a','b','c'])
        })

        it('updates the items when the model adds a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getListModel().insertAll({ index: 1, items: ['d', 'e'] })

            expect(this.list.getView().getRows()) .to .eql(['a','d', 'e','b','c'])
        })

        it('updates the items when the model updates a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getListModel().updateAll({indices: [0, 2], items: ['d', 'e']})

            expect(this.list.getView().getRows()) .to .eql(['d', 'b', 'e'])
        })

        it('updates the items when the model deletes a choice', () => {
            this.list.getModel().setChoices(['a', 'b', 'c'])

            this.list.getModel().getListModel().removeAll({ items: ['a', 'b'] })

            expect(this.list.getView().getRows()) .to .eql(['c'])
        })
    })


    describe( 'constructor', () =>{
        it('has a empty choices', () => {
            expect(this.list.getView().getRows()) .to .eql([])
            expect(this.list.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the choices on its constructor', () => {
            this.list = Component.render( function(renderer) {
                this.listChoice( function() {
                    this.styles({
                        choices: ['a','b','c'],
                        selection: 'c'
                    })

                    this.column({
                        label: 'col 1'
                    })
                })
            })

            expect(this.list.getModel().getSelectionValue()) .to .eql('c')
            expect(this.list.getModel().getChoices()) .to .eql(['a','b','c'])

            expect(this.list.getView().getSelectionIndices()) .to .eql([2])
            expect(this.list.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            this.list.mergeProps({
                width: 10
            })

            expect(this.list.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            this.list.mergeProps({
                height: 10
            })

            expect(this.list.getView().getHeight()) .to .eql(10)
        })

        it('sets and gets the showHeaders', () => {
            this.list.mergeProps({
                showHeaders: false
            })

            expect(this.list.getView().getShowHeaders()) .to .eql(false)
        })

        it('sets and gets the clickableHeaders', () => {
            this.list.mergeProps({
                clickableHeaders: false
            })

            expect(this.list.getView().getClickableHeaders()) .to .eql(false)
        })
    })
})
