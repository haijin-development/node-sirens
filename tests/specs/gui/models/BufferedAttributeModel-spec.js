const expect = require('chai').expect
const BufferedAttributeModel = require('../../../../src/gui/models/BufferedAttributeModel')

describe('When using an BufferedAttributeModel', () => {
    beforeEach( () => {
        this.object = {
            a: 1,
            b: 2,
            c: 3,
        }

        this.valueModel = BufferedAttributeModel.new({
                object: this.object,
                attributeReader: (object) => { return object.a },
                attributeWriter: (object, newValue) => { object.a = newValue },
            })
    })

    describe('when setting and getting its value', () => {

        it('sets its object and prop in its constructor', () => {
            expect(this.valueModel.getValue()) .to .equal(1)
        })

        it('sets and gets its value', () => {
            this.valueModel.setValue('a')

            expect(this.valueModel.getValue()) .to .equal('a')
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            this.valueModel.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(10)
            })

            this.valueModel.setValue(10)

            expect(this.triggeredEvent) .to .be .true
        })

        it('does not change the value of the model object', () => {
            this.valueModel.setValue('a')

            expect(this.valueModel.getObject().a) .to .equal( 1 )
        })
    })

    describe('when setting and getting its object', () => {
        it('sets and gets its object', () => {
            this.valueModel.setObject({
                a: 10
            })

            expect(this.valueModel.getValue()) .to .equal(10)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            this.valueModel.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(10)
            })

            this.valueModel.setObject({
                a: 10
            })

            expect(this.triggeredEvent) .to .be .true
        })
    })

    describe('when setting its attributeReader', () => {
        it('sets and gets its attributeReader', () => {
            this.valueModel.setAttributeReader( (object) => {
                return object.c
            })

            expect(this.valueModel.getValue()) .to .equal(3)
        })

        it('triggers a value-changed event', () => {
            this.triggeredEvent = false

            this.valueModel.onValueChanged( (event) => {
                this.triggeredEvent = true

                expect(event.oldValue) .to .equal(1)
                expect(event.newValue) .to .equal(3)
            })

            this.valueModel.setAttributeReader( (object) => {
                return object.c
            })

            expect(this.triggeredEvent) .to .be .true
        })
    })
})
