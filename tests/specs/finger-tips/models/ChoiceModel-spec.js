const expect = require('chai').expect
const FingerTipsNamespace = require('../../../../src/finger-tips/FingerTipsNamespace')

const namespace = FingerTipsNamespace.new()

describe('When using a ChoiceModel', () => {
    beforeEach( () => {
        this.triggeredEvent = false
    })

    describe('when creating one', () => {
        it('has a default ListModel choices and a default ValueModel selection', () => {
            const choice_model = namespace.ChoiceModel.new()

            expect( choice_model.getListModel() ) .to .behaveAs( 'ListModel' )
            expect( choice_model.getSelectionModel() ) .to .behaveAs( 'ValueModel' )

            expect(choice_model.getChoices()) .to .eql([])
            expect(choice_model.getSelectionValue()) .to .be .null
        })

        it('its has the given choices and selection', () => {
            const choice_model = namespace.ChoiceModel.new({ choices: ['a', 'b', 'c'], selection: 'c' })

            expect( choice_model.getListModel() ) .to .behaveAs( 'ListModel' )
            expect( choice_model.getSelectionModel() ) .to .behaveAs( 'ValueModel' )

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
            expect(choice_model.getSelectionValue()) .to .eql('c')
        })
    })

    describe('when setting its choices', () => {
        it('sets the given choices', () => {
            const choice_model = namespace.ChoiceModel.new()

            expect(choice_model.setChoices(['a', 'b', 'c']))

            expect(choice_model.getChoices()) .to .eql(['a', 'b', 'c'])
        })
    })

    describe('when setting its selection', () => {
        it('sets the given selection', () => {
            const choice_model = namespace.ChoiceModel.new()

            choice_model.setChoices(['a', 'b', 'c'])

            choice_model.setSelectionValue('c')

            expect(choice_model.getSelectionValue()) .to .eql('c')
        })
    })
})
