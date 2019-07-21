const expect = require('chai').expect
const ChoiceModel = require('../../../src/models/ChoiceModel')

describe('When using a ChoiceModel', () => {
    beforeEach( () => {
        this.triggeredEvent = false
    })

    describe('when creating one', () => {
        it('has a default ListModel choices and a default ValueModel selection', () => {
            const choice_model = new ChoiceModel()

            expect(choice_model.getList().constructor.name) .to .eql('ListModel')
            expect(choice_model.getValue().constructor.name) .to .eql('ValueModel')

            expect(choice_model.getChoices()) .to .eql([])
            expect(choice_model.getSelection()) .to .be .null
        })

        it('its has the given choices and selection', () => {
            const choice_model = new ChoiceModel({choices: ['a', 'b', 'c'], selection: 'c'})

            expect(choice_model.getList().constructor.name) .to .eql('ListModel')
            expect(choice_model.getValue().constructor.name) .to .eql('ValueModel')

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
            expect(choice_model.getSelection()) .to .eql('c')
        })
    })

    describe('when setting its choices', () => {
        it('sets the given choices', () => {
            const choice_model = new ChoiceModel()

            expect(choice_model.setChoices(['a', 'b', 'c']))

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
        })
    })

    describe('when setting its selection', () => {
        it('sets the given selection', () => {
            const choice_model = new ChoiceModel()

            choice_model.setChoices(['a', 'b', 'c'])

            choice_model.setSelection('c')

            expect(choice_model.getSelection()) .to .eql('c')
        })
    })
})
