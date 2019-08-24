const expect = require('chai').expect
const Splitter = require('../../../../../src/gui/components/containers/Splitter')
const Label = require('../../../../../src/gui/components/widgets/Label')

describe('When using a Splitter', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const splitter = Splitter.new({ orientation: 'horizontal' })

            expect( splitter.getComponents() ) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = Splitter.new({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label = Label.new({
                splitProportion: 0.5,
            })

            splitter.addComponent(label)

            expect( splitter.getComponents().length) .to .eql(1)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 2 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.5,
            })

            const label2 = Label.new({
                splitProportion: 0.5,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)

            expect( splitter.getComponents().length ) .to .eql(2)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 3 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.3,
            })

            const label2 = Label.new({
                splitProportion: 0.3,
            })

            const label3 = Label.new({
                splitProportion: 0.3,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)

            expect( splitter.getComponents().length) .to .eql(3)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[2].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 4 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.25,
            })

            const label2 = Label.new({
                splitProportion: 0.25,
            })

            const label3 = Label.new({
                splitProportion: 0.25,
            })

            const label4 = Label.new({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)
            splitter.addComponent(label4)

            expect( splitter.getComponents().length) .to .eql(4)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[2].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[3].getView().constructor.name ) .to .eql('LabelView')
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const splitter = Splitter.new({orientation: 'vertical'})

            expect( splitter.getComponents() ) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = Splitter.new({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)

            expect( splitter.getComponents().length ) .to .eql(1)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 2 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.25,
            })

            const label2 = Label.new({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)

            expect( splitter.getComponents().length ) .to .eql(2)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 3 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.25,
            })

            const label2 = Label.new({
                splitProportion: 0.25,
            })

            const label3 = Label.new({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)

            expect( splitter.getComponents().length) .to .eql(3)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[2].getView().constructor.name ) .to .eql('LabelView')
        })

        it('adds 4 sub-components', () => {
            const splitter = Splitter.new({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = Label.new({
                splitProportion: 0.25,
            })

            const label2 = Label.new({
                splitProportion: 0.25,
            })

            const label3 = Label.new({
                splitProportion: 0.25,
            })

            const label4 = Label.new({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)
            splitter.addComponent(label4)

            expect( splitter.getComponents().length ) .to .eql(4)
            expect( splitter.getComponents()[0].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[1].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[2].getView().constructor.name ) .to .eql('LabelView')
            expect( splitter.getComponents()[3].getView().constructor.name ) .to .eql('LabelView')
        })
    })
})
