const expect = require('chai').expect
const Model = require('../../../src/models/ValueModel')

describe('When using a Model', () => {
    describe('when setting and getting its value', () => {

        it('sets its value in its constructor', () => {
            const model = new Model({
                    value: 2
                })

            expect(model.value) .to .equal(2)
        })

        it('sets and gets its value', () => {
            const model = new Model()

            model.setValue(1)

            expect(model.getValue()) .to .equal(1)
        })

        it('sets and gets an existent value', () => {
            const model = new Model()

            model.setValue(1)

            model.setValue(2)

            expect(model.getValue()) .to .equal(2)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            const model = new Model()

            model.on('value-changed', (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .be .undefined
                expect(event.newValue) .to .equal(1)
            })

            model.setValue(1)

            expect(this.triggeredEvent) .to .be .true
        })
    })

})
