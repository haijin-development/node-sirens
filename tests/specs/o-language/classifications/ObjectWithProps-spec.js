const expect = require('chai').expect
const ObjectWithProps = require('../../../../src/o-language/classifications/ObjectWithProps')

describe('When using an ObjectWithProps', () => {
    it('creates an object with no props defined', () => {
        const object = ObjectWithProps.new()

        expect( object.getProps() ) .to .be .eql( {} )
    })

    it('sets a prop', () => {
        const object = ObjectWithProps.new()

        object.setProp({
            key: 'a',
            value: 1
        })

        expect( object.getProps() ) .to .be .eql({ a: 1 })
    })

    it('merges a prop', () => {
        const object = ObjectWithProps.new()

        object.mergeProps({
            a: 1
        })

        expect( object.getProps() ) .to .be .eql({ a: 1 })
    })

    it('removes a prop', () => {
        const object = ObjectWithProps.new()

        object.mergeProps({
            a: 1
        })

        object.removeProp({ key: 'a' })

        expect( object.getProps() ) .to .be .eql( {} )
    })

    it('clears all the props', () => {
        const object = ObjectWithProps.new()

        object.mergeProps({
            a: 1,
            b: 2,
        })

        object.clearAllProps()

        expect( object.getProps() ) .to .be .eql( {} )
    })

    it('sets all the props', () => {
        const object = ObjectWithProps.new()

        object.setProps({
            a: 1
        })

        object.setProps({
            b: 2
        })

        expect( object.getProps() ) .to .be .eql( { b: 2 } )
    })

    it('merges props', () => {
        const object = ObjectWithProps.new()

        object.setProps({
            a: 1
        })

        object.mergeProps({
            b: 2
        })

        expect( object.getProps() ) .to .be .eql( { a: 1, b: 2 } )
    })

    describe('when asking if has a prop defined', () => {
        it('answers true if it has the prop defined', () => {
            const object = ObjectWithProps.new()

            object.mergeProps({
                a: 1
            })

            expect( object.hasProp({ key: 'a' }) ) .to .be .true
        })        

        it('answers false if it does not have the prop defined', () => {
            const object = ObjectWithProps.new()

            object.mergeProps({
                a: 1
            })

            expect( object.hasProp({ key: 'b' }) ) .to .be .false
        })
    })

    describe('when reading a prop value', () => {
        it('returns the prop value if the prop is defined', () => {
            const object = ObjectWithProps.new()

            object.mergeProps({
                a: 1,
            })

            const result = object.getProp({
                key: 'a',
                ifUndefined: ({ key: key, owner: owner }) => { return `Prop ${key} is undefined.` }
            })

            expect( result ) .to .eql( 1 )
        })        

        it('returns undefined if the prop is undefined', () => {
            const object = ObjectWithProps.new()

            const result = object.getProp({ key: 'a' })

            expect( result ) .to .be .undefined
        })        

        it('evaluates an absent closure if it does not have the prop defined', () => {
            const object = ObjectWithProps.new()

            const result = object.getProp({
                key: 'a',
                ifUndefined: ({ key: key, owner: owner }) => { return `Prop ${key} is undefined.` }
            })

            expect( result ) .to .eql('Prop a is undefined.')
        })        

        it('returns a default value if given', () => {
            const object = ObjectWithProps.new()

            const result = object.getProp({
                key: 'a',
                defaultValue: `Prop a is undefined.`,
            })

            expect( result ) .to .eql('Prop a is undefined.')
        })        
    })

    describe('when iterating props', () => {
        it('iterates prop names and values', () => {
            const object = ObjectWithProps.new()

            object.mergeProps({
                a: 1,
                b: 2,
                c: 3
            })

            const iteratedProps = {}

            const result = object.propsAndValuesDo( (propName, value ) => {
                iteratedProps[propName] = value
            })

            expect( iteratedProps ) .to .eql({
                a: 1,
                b: 2,
                c: 3
            })
        })
    })
})