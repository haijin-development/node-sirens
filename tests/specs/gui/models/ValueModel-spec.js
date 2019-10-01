const expect = require('chai').expect
const ValueModel = require('../../../../src/gui/models/ValueModel')

describe('When using a ValueModel', () => {
    describe('when setting and getting its value', () => {

        it('sets its value in its constructor', () => {
            const model = ValueModel.new({
                    value: 2
                })

            expect(model.getValue()) .to .equal(2)
        })

        it('sets and gets its value', () => {
            const model = ValueModel.new()

            model.setValue(1)

            expect(model.getValue()) .to .equal(1)
        })

        it('sets and gets an existent value', () => {
            const model = ValueModel.new()

            model.setValue(1)

            model.setValue(2)

            expect(model.getValue()) .to .equal(2)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            const model = ValueModel.new()

            model.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .be .null
                expect(event.newValue) .to .equal(1)
            })

            model.setValue(1)

            expect(this.triggeredEvent) .to .be .true
        })
    })

})
