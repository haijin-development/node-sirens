const expect = require('chai').expect
const Splitter = require('../../../../../src/gui/components/containers/Splitter')
const Label = require('../../../../../src/gui/components/widgets/Label')

describe('When using a Splitter', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const splitter = new Splitter({orientation: 'horizontal'})

            expect(splitter.components) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = new Splitter({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label = new Label({
                splitProportion: 0.5,
            })

            splitter.addComponent(label)

            expect(splitter.components.length) .to .eql(1)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 2 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.5,
            })

            const label2 = new Label({
                splitProportion: 0.5,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)

            expect(splitter.components.length) .to .eql(2)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 3 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.3,
            })

            const label2 = new Label({
                splitProportion: 0.3,
            })

            const label3 = new Label({
                splitProportion: 0.3,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)

            expect(splitter.components.length) .to .eql(3)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[2].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 4 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'horizontal',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.25,
            })

            const label2 = new Label({
                splitProportion: 0.25,
            })

            const label3 = new Label({
                splitProportion: 0.25,
            })

            const label4 = new Label({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)
            splitter.addComponent(label4)

            expect(splitter.components.length) .to .eql(4)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[2].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[3].getView().constructor.name) .to .eql('LabelView')
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const splitter = new Splitter({orientation: 'vertical'})

            expect(splitter.components) .to .eql([])
        })

        it('adds 1 sub-component', () => {
            const splitter = new Splitter({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)

            expect(splitter.components.length) .to .eql(1)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 2 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.25,
            })

            const label2 = new Label({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)

            expect(splitter.components.length) .to .eql(2)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 3 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.25,
            })

            const label2 = new Label({
                splitProportion: 0.25,
            })

            const label3 = new Label({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)

            expect(splitter.components.length) .to .eql(3)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[2].getView().constructor.name) .to .eql('LabelView')
        })

        it('adds 4 sub-components', () => {
            const splitter = new Splitter({
                orientation: 'vertical',
                width: 300,
                height: 100
            })

            const label1 = new Label({
                splitProportion: 0.25,
            })

            const label2 = new Label({
                splitProportion: 0.25,
            })

            const label3 = new Label({
                splitProportion: 0.25,
            })

            const label4 = new Label({
                splitProportion: 0.25,
            })

            splitter.addComponent(label1)
            splitter.addComponent(label2)
            splitter.addComponent(label3)
            splitter.addComponent(label4)

            expect(splitter.components.length) .to .eql(4)
            expect(splitter.components[0].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[1].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[2].getView().constructor.name) .to .eql('LabelView')
            expect(splitter.components[3].getView().constructor.name) .to .eql('LabelView')
        })
    })
})
