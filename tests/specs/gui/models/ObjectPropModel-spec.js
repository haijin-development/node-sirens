const expect = require('chai').expect
const ObjectPropModel = require('../../../../src/gui/models/ObjectPropModel')

describe('When using an ObjectPropModel', () => {
    beforeEach( () => {
        this.object = {
            a: 1,
            b: 2,
            c: 3,
        }
    })

    describe('when setting and getting its value', () => {

        it('sets its object and prop in its constructor', () => {
            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            expect(model.getValue()) .to .equal(1)
        })

        it('sets and gets its value', () => {
            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.setValue('a')

            expect(model.getValue()) .to .equal('a')
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(10)
            })

            model.setValue(10)

            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when setting and getting its object', () => {
        it('sets and gets its object', () => {
            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.setObject({
                a: 10
            })

            expect(model.getValue()) .to .equal(10)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(10)
            })

            model.setObject({
                a: 10
            })

            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when setting and getting its prop', () => {
        it('sets and gets its prop', () => {
            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.setProp('b')

            expect(model.getValue()) .to .equal(2)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            const model = ObjectPropModel.new({
                    object: this.object,
                    prop: 'a'
                })

            model.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(2)
            })

            model.setProp('b')

            expect(this.triggeredEvent) .to .be .true
        })
    })
})
