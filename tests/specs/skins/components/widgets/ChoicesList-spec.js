const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a ChoicesList', () => {
    let componentRenderer
    let list

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        beforeEach( () => {
            list = componentRenderer.render( function() {
                this.listChoice( function() {
                    this.column({
                        label: 'col 1'
                    })
                })
            })
        })

        it('has a ChoiceModel', () => {
            expect(list.getModel().getSelectionValue()) .to .eql(null)
            expect(list.getModel().getChoices()) .to .eql([])
        })

        it('updates the selection when the model selection changes', () => {
            list.getModel().setChoices(['a', 'b', 'c'])
            list.getModel().setSelectionValue('c')

            expect(list.getView().getSelectionIndices()) .to .eql([2])
        })

        it('updates the items when the model choices changes', () => {
            list.getModel().setChoices(['a', 'b', 'c'])

            expect(list.getView().getRows()) .to .eql(['a','b','c'])
        })

        it('updates the items when the model adds a choice', () => {
            list.getModel().setChoices(['a', 'b', 'c'])

            list.getModel().getListModel().insertAll({ index: 1, items: ['d', 'e'] })

            expect(list.getView().getRows()) .to .eql(['a','d', 'e','b','c'])
        })

        it('updates the items when the model updates a choice', () => {
            list.getModel().setChoices(['a', 'b', 'c'])

            list.getModel().getListModel().updateAll({indices: [0, 2], items: ['d', 'e']})

            expect(list.getView().getRows()) .to .eql(['d', 'b', 'e'])
        })

        it('updates the items when the model deletes a choice', () => {
            list.getModel().setChoices(['a', 'b', 'c'])

            list.getModel().getListModel().removeAll({ items: ['a', 'b'] })

            expect(list.getView().getRows()) .to .eql(['c'])
        })
    })


    describe( 'constructor', () =>{
        it('has a empty choices', () => {
            list = componentRenderer.render( function() {
                this.listChoice( function() {
                    this.column({
                        label: 'col 1'
                    })
                })
            })

            expect(list.getView().getRows()) .to .eql([])
            expect(list.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the choices on its constructor', () => {
            list = componentRenderer.render( function() {
                this.listChoice( function() {
                    this.styles({
                        choices: ['a','b','c'],
                    })

                    this.column({
                        label: 'col 1'
                    })
                })
            })

            expect(list.getModel().getChoices()) .to .eql(['a','b','c'])
            expect(list.getModel().getSelectionValue()) .to .be .null

            expect(list.getView().getRows()) .to .eql(['a','b','c'])
            expect(list.getView().getSelectionIndices()) .to .eql([])
        })

        it('sets the selection on its constructor', () => {
            list = componentRenderer.render( function() {
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

            expect(list.getModel().getSelectionValue()) .to .eql('c')
            expect(list.getModel().getChoices()) .to .eql(['a','b','c'])

            expect(list.getView().getSelectionIndices()) .to .eql([2])
            expect(list.getView().getRows()) .to .eql(['a','b','c'])
        })
    })

    describe('styles', () => {
        beforeEach( () => {
            list = componentRenderer.render( function() {
                this.listChoice( function() {
                    this.column({
                        label: 'col 1'
                    })
                })
            })
        })

        it('sets and gets the width', () => {
            list.mergeProps({
                width: 10
            })

            expect(list.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            list.mergeProps({
                height: 10
            })

            expect(list.getView().getHeight()) .to .eql(10)
        })

        it('sets and gets the showHeaders', () => {
            list.mergeProps({
                showHeaders: false
            })

            expect(list.getView().getShowHeaders()) .to .eql(false)
        })

        it('sets and gets the clickableHeaders', () => {
            list.mergeProps({
                clickableHeaders: false
            })

            expect(list.getView().getClickableHeaders()) .to .eql(false)
        })
    })
})
