const expect = require('chai').expect
const StringStream = require('../../../../src/O').StringStream

describe('A StringStream', () => {
    let stream

    beforeEach( () => {
        stream = StringStream.new({ string: '1' })
    })

    describe('when initialized', () => {
        it('returns an empty string', () => {
            const newStream = StringStream.new()

            expect( newStream.getString() ) .to .equal( '' )
        })

        it('has a default carriage return char', () => {
            const newStream = StringStream.new()

            expect( newStream.getCrChar() ) .to .equal( "\n" )
        })

        it('initializes itself on a given string', () => {
            const newStream = StringStream.new({ string: '1' })

            expect( newStream.getString() ) .to .equal( '1' )
        })


        it('initializes itself on a given carriage return char', () => {
            const newStream = StringStream.new({ cr: '<br>' })

            expect( newStream.getCrChar() ) .to .equal( '<br>' )
        })

        it('initializes itself on a given string and carriage return char', () => {
            const newStream = StringStream.new({ string: '1', cr: '<br>' })

            expect( newStream.getString() ) .to .equal( '1' )
            expect( newStream.getCrChar() ) .to .equal( '<br>' )
        })
    })

    describe('when concatenating strings', () => {
        it('appends a string', () => {
            stream.append({ string: '2' })

            expect( stream.getString() ) .to .equal( '12' )
        })

        it('prepends a string', () => {
            stream.prepend({ string: '2' })

            expect( stream.getString() ) .to .equal( '21' )
        })

        it('appends a carriage return', () => {
            stream.cr()

            expect( stream.getString() ) .to .equal( "1\n" )
        })

        it('appends a line', () => {
            stream.appendLine({ string: '2' })

            expect( stream.getString() ) .to .equal( "1\n2" )
        })

        it('prepends a line', () => {
            stream.prependLine({ string: '2' })

            expect( stream.getString() ) .to .equal( "2\n1" )
        })
    })

    describe('when concatenating strings with conditionals', () => {
        it('appends a string if the conditional is true', () => {
            stream.append({ string: '2', if: true })

            expect( stream.getString() ) .to .equal( '12' )
        })

        it('does not append a string if the conditional is false', () => {
            stream.append({ string: '2', if: false })

            expect( stream.getString() ) .to .equal( '1' )
        })

        it('prepends a string if the conditional is true', () => {
            stream.prepend({ string: '2', if: true })

            expect( stream.getString() ) .to .equal( '21' )
        })

        it('does not prepend a string if the conditional is false', () => {
            stream.prepend({ string: '2', if: false })

            expect( stream.getString() ) .to .equal( '1' )
        })

        it('appends a carriage return if the conditional is true', () => {
            stream.cr({ if: true })

            expect( stream.getString() ) .to .equal( "1\n" )
        })

        it('does not append a string if the conditional is false', () => {
            stream.cr({ if: false })

            expect( stream.getString() ) .to .equal( '1' )
        })

        it('appends a line if the conditional is true', () => {
            stream.appendLine({ string: '2', if: true })

            expect( stream.getString() ) .to .equal( "1\n2" )
        })

        it('does not append a line if the conditional is false', () => {
            stream.appendLine({ string: '2', if: false })

            expect( stream.getString() ) .to .equal( "1" )
        })

        it('prepends a line if the conditional is true', () => {
            stream.prependLine({ string: '2', if: true })

            expect( stream.getString() ) .to .equal( "2\n1" )
        })

        it('does not prepend a line if the conditional is false', () => {
            stream.prependLine({ string: '2', if: false })

            expect( stream.getString() ) .to .equal( "1" )
        })
    })

    describe('when setting the carriage return char', () => {
        it('uses the carriage return char set', () => {
            stream.setCrChar('<br>')

            stream.cr()

            expect( stream.getString() ) .to .equal( '1<br>' )
        })

        it('uses the carriage return char when appending lines', () => {
            stream.setCrChar('<br>')

            stream.appendLine({ string: '2' })

            expect( stream.getString() ) .to .equal( '1<br>2' )
        })

        it('uses the carriage return char when prepending lines', () => {
            stream.setCrChar('<br>')

            stream.prependLine({ string: '2' })

            expect( stream.getString() ) .to .equal( '2<br>1' )
        })
    })
})