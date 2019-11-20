const expect = require('chai').expect
const IndentedStringStream = require('../../../../src/O').IndentedStringStream

describe('An IndentedStringStream', () => {
    let stream

    beforeEach( () => {
        stream = IndentedStringStream.new({ string: '1' })
    })

    describe('when instantiated', () => {
        it('has an indentation count of 0', () => {
            const newStream = IndentedStringStream.new()

            expect( newStream.getIndentationCount() ) .to .equal( 0 )
        })

        it('has a default indentation char', () => {
            const newStream = IndentedStringStream.new()

            expect( newStream.getIndentationChar() ) .to .equal( '   ' )
        })
    })

    describe('when appending a new line', () => {
        it('adds the proper indentation at the beginning of the line', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.appendLine({ string: '2' })

            expect( stream.getString() ) .to .equal( "1\n&nbsp;&nbsp;&nbsp;2" )
        })
    })

    describe('when prepending a new line', () => {
        it('adds the proper indentation at the beginning of the line', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.prependLine({ string: '2' })

            expect( stream.getString() ) .to .equal( "&nbsp;&nbsp;&nbsp;2\n1" )
        })
    })

    describe('when adding a carraige return', () => {
        it('does not add the indentation at the beginning of the line by default', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.cr()

            expect( stream.getString() ) .to .equal( "1\n" )
        })

        it('adds the indentation at the beginning of the line if specified', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.cr({ indent: true })

            expect( stream.getString() ) .to .equal( "1\n&nbsp;&nbsp;&nbsp;" )
        })

        it('does not add the indentation at the beginning of the line is specified', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.cr({ indent: false })

            expect( stream.getString() ) .to .equal( "1\n" )
        })
    })

    describe('when adding indentation explicitly', () => {
        it('adds the indentation at the current position', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.appendIndentation()

            expect( stream.getString() ) .to .equal( "1&nbsp;&nbsp;&nbsp;" )
        })
    })

    describe('when changing the indentation count', () => {
        it('increments the indentation by 1 by default', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(1)

            stream.incrementIndentation()

            stream.appendIndentation()

            expect( stream.getString() ) .to .equal( "1&nbsp;&nbsp;" )
        })

        it('increments the indentation by a given number', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(1)

            stream.incrementIndentation({ by: 2 })

            stream.appendIndentation()

            expect( stream.getString() ) .to .equal( "1&nbsp;&nbsp;&nbsp;" )
        })

        it('decrements the indentation by 1 by default', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(2)

            stream.decrementIndentation()

            stream.appendIndentation()

            expect( stream.getString() ) .to .equal( "1&nbsp;" )
        })

        it('decrements the indentation by a given number', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(3)

            stream.decrementIndentation({ by: 2 })

            stream.appendIndentation()

            expect( stream.getString() ) .to .equal( "1&nbsp;" )
        })

        it('increments the indentation by a given number during the evaluation of a closure', () => {
            stream.setIndentationChar('&nbsp;')
            stream.setIndentationCount(1)

            stream.whileIncrementingIndentationDo({ by: 2 }, () => {
                stream.appendIndentation()
            })

            expect( stream.getString() ) .to .equal( "1&nbsp;&nbsp;&nbsp;" )
            expect( stream.getIndentationCount() ) .to .equal( 1 )
        })
    })
})