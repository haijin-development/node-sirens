const expect = require('chai').expect
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../../src/gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../../src/gui/protocols/ComponentProtocol_Implementation')
const ComponentsList = require('../../../../../src/gui/components/ComponentsList')
const ListModelComponentProtocol_Implementation = require('../../../../../src/gui/protocols/ListModelComponentProtocol_Implementation')
const ListModel = require('../../../../../src/gui/models/ListModel')
const Label = require('../../../../../src/gui/components/widgets/Label')

class ParentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    renderWith(componentsRenderer) {
        const listModel = this.getModel()

        componentsRenderer.render( function(component) {
            this.horizontalStack( function() {
                this.component(
                    CustomComponentList.new({
                        model: listModel
                    })
                )
            })
        })
    }
}

ParentComponent = Classification.define(ParentComponent)

class CustomComponentList {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentsList]
        this.implements = [
            ComponentProtocol_Implementation,
            ListModelComponentProtocol_Implementation
        ]
    }

    renderItem({ item: item, index: index, renderer: renderer }) {
        renderer.label({ text: item })
    }
}

CustomComponentList = Classification.define(CustomComponentList)

describe('When using a ComponentsList', () => {
    describe('with an empty list', () => {
        it('the ParentComponent has only one child', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: [] })
            })

            expect( component.getChildComponents().length ) .to .eql(1)
        })

        it('the stack has one child', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: [] })
            })

            const stack = component.getChildComponentAt({ index: 0 })

            expect( stack.getChildComponents().length ) .to .eql(1)
        })

        it('the CustomComponentList has no children', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: [] })
            })

            const stack = component.getChildComponentAt({ index: 0 })

            const componentsList = stack.getChildComponentAt({ index: 0 })

            expect( componentsList.getChildComponents().length ) .to .eql(0)
        })
    })

    describe('with a non empty list', () => {
        it('the ParentComponent has only one child', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: ['Label 1', 'Label 2', 'Label 3'] })
            })

            expect( component.getChildComponents().length ) .to .eql(1)
        })

        it('the stack has one child', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: ['Label 1', 'Label 2', 'Label 3'] })
            })

            const stack = component.getChildComponentAt({ index: 0 })

            expect( stack.getChildComponents().length ) .to .eql(1)
        })

        it('the CustomComponentList has 3 children', () => {
            const component = ParentComponent.new({
                model: ListModel.new({ list: ['Label 1', 'Label 2', 'Label 3'] })
            })

            const stack = component.getChildComponentAt({ index: 0 })

            const componentsList = stack.getChildComponentAt({ index: 0 })

            expect( componentsList.getChildComponents().length ) .to .eql(3)

            const label1 = componentsList.getChildComponentAt({ index: 0 })
            expect( label1.getView().getText() ) .to .eql( 'Label 1' )

            const label2 = componentsList.getChildComponentAt({ index: 1 })
            expect( label2.getView().getText() ) .to .eql( 'Label 2' )

            const label3 = componentsList.getChildComponentAt({ index: 2 })
            expect( label3.getView().getText() ) .to .eql( 'Label 3' )
        })
    })

    describe('when changing its model list', () => {
        it('the ParentComponent has only one child', () => {
            const model = ListModel.new({ list: [ 'a' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.setList([ 'Label 1', 'Label 2', 'Label 3'] )

            expect( component.getChildComponents().length ) .to .eql(1)
        })

        it('the stack has one child', () => {
            const model = ListModel.new({ list: [ 'a' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.setList([ 'Label 1', 'Label 2', 'Label 3'] )

            const stack = component.getChildComponentAt({ index: 0 })

            expect( stack.getChildComponents().length ) .to .eql(1)
        })

        it('the CustomComponentList has 3 children', () => {
            const model = ListModel.new({ list: [ 'a' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.setList([ 'Label 1', 'Label 2', 'Label 3'] )

            const stack = component.getChildComponentAt({ index: 0 })

            const componentsList = stack.getChildComponentAt({ index: 0 })

            expect( componentsList.getChildComponents().length ) .to .eql(3)

            const label1 = componentsList.getChildComponentAt({ index: 0 })
            expect( label1.getView().getText() ) .to .eql( 'Label 1' )

            const label2 = componentsList.getChildComponentAt({ index: 1 })
            expect( label2.getView().getText() ) .to .eql( 'Label 2' )

            const label3 = componentsList.getChildComponentAt({ index: 2 })
            expect( label3.getView().getText() ) .to .eql( 'Label 3' )
        })

        it('the stack handles are handled correctly', () => {
            const model = ListModel.new({ list: [ 'a' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.setList([ 'Label 1', 'Label 2', 'Label 3'] )

            const stack = component.getChildComponentAt({ index: 0 })

            const stackHandleChildren = stack.getView().getMainHandle().getChildren()

            expect( stackHandleChildren.length ) .to .eql( 3 )
        })
    })

    describe('when adding items to its model list', () => {
        it('the ParentComponent has only one child', () => {
            const model = ListModel.new({ list: [ 'a', 'b', 'c' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.insertAll({ items: [ '1', '2', '3'], index: 1 })

            expect( component.getChildComponents().length ) .to .eql(1)
        })

        it('the stack has one child', () => {
            const model = ListModel.new({ list: [ 'a', 'b', 'c' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.insertAll({ items: [ '1', '2', '3'], index: 1 })

            const stack = component.getChildComponentAt({ index: 0 })

            expect( stack.getChildComponents().length ) .to .eql(1)
        })

        it('the CustomComponentList has 3 children', () => {
            const model = ListModel.new({ list: [ 'a', 'b', 'c' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.insertAll({ items: [ '1', '2', '3'], index: 1 })

            const stack = component.getChildComponentAt({ index: 0 })

            const componentsList = stack.getChildComponentAt({ index: 0 })

            expect( componentsList.getChildComponents().length ) .to .eql(6)

            const label1 = componentsList.getChildComponentAt({ index: 0 })
            expect( label1.getView().getText() ) .to .eql( 'a' )

            const label2 = componentsList.getChildComponentAt({ index: 1 })
            expect( label2.getView().getText() ) .to .eql( '1' )

            const label3 = componentsList.getChildComponentAt({ index: 2 })
            expect( label3.getView().getText() ) .to .eql( '2' )

            const label4 = componentsList.getChildComponentAt({ index: 3 })
            expect( label4.getView().getText() ) .to .eql( '3' )

            const label5 = componentsList.getChildComponentAt({ index: 4 })
            expect( label5.getView().getText() ) .to .eql( 'b' )

            const label6 = componentsList.getChildComponentAt({ index: 5 })
            expect( label6.getView().getText() ) .to .eql( 'c' )
        })

        it('the stack handles are handled correctly', () => {
            const model = ListModel.new({ list: [ 'a', 'b', 'c' ] })

            const component = ParentComponent.new({
                model: model
            })

            model.insertAll({ items: [ '1', '2', '3'], index: 1 })

            const stack = component.getChildComponentAt({ index: 0 })

            const stackHandleChildren = stack.getView().getMainHandle().getChildren()

            expect( stackHandleChildren.length ) .to .eql( 6 )
        })
    })
})
