const expect = require('chai').expect
const ChoiceModel = require('../../../../src/finger-tips/models/ChoiceModel')
const ListModel = require('../../../../src/finger-tips/models/ListModel')
const ValueModel = require('../../../../src/finger-tips/models/ValueModel')

describe('When using a ChoiceModel', () => {
    beforeEach( () => {
        this.triggeredEvent = false
    })

    describe('when creating one', () => {
        it('has a default ListModel choices and a default ValueModel selection', () => {
            const choice_model = ChoiceModel.new()

            expect( choice_model.getListModel().isBehavingAs(ListModel) ) .to .be .true
            expect( choice_model.getSelectionModel().isBehavingAs(ValueModel) ) .to .be .true

            expect(choice_model.getChoices()) .to .eql([])
            expect(choice_model.getSelectionValue()) .to .be .null
        })

        it('its has the given choices and selection', () => {
            const choice_model = ChoiceModel.new({ choices: ['a', 'b', 'c'], selection: 'c' })

            expect( choice_model.getListModel().isBehavingAs(ListModel) ) .to .be .true
            expect( choice_model.getSelectionModel().isBehavingAs(ValueModel) ) .to .be .true

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
            expect(choice_model.getSelectionValue()) .to .eql('c')
        })
    })

    describe('when setting its choices', () => {
        it('sets the given choices', () => {
            const choice_model = ChoiceModel.new()

            expect(choice_model.setChoices(['a', 'b', 'c']))

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
        })
    })

    describe('when setting its selection', () => {
        it('sets the given selection', () => {
            const choice_model = ChoiceModel.new()

            choice_model.setChoices(['a', 'b', 'c'])

            choice_model.setSelectionValue('c')

            expect(choice_model.getSelectionValue()) .to .eql('c')
        })
    })
})
