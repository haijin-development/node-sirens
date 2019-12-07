const expect = require('chai').expect
const SourceCodeText = require('../../../../src/sirens/objects/SourceCodeText')

describe('When using a SourceCodeText', () => {

    describe('has the default option', () => {

        const sourceCodeText = `const n = 0`

        it('removeIndentation === true', () => {
            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getRemoveIndentation() ) .to .be .true
        })

    })

    describe('creates an instance with the given option', () => {

        const sourceCodeText = `const n = 0`

        it('removeIndentation === false', () => {
            const sourceCode = SourceCodeText.new({
                text: sourceCodeText,
                removeIdentation: false,
            })

            expect( sourceCode.getRemoveIndentation() ) .to .be .false
        })

    })

    describe('changes its default option to', () => {

        const sourceCodeText = `const n = 0`

        it('removeIndentation === false', () => {
            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            sourceCode.setRemoveIndentation(false)

            expect( sourceCode.getRemoveIndentation() ) .to .be .false
        })

    })

    describe('with a single line source code text', () => {

        const sourceCodeText = `const n = 0`
        const formattedText = `const n = 0`

        it('gets the source code text', () => {
            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getOriginalText() ) .to .equal( sourceCodeText )
        })

        it('gets the formatted source code text', () => {
            const sourceCode = SourceCodeText.new({
                text: sourceCodeText,
            })

            expect( sourceCode.getFormattedText() ) .to .equal( formattedText )
        })

        it('converts a given formatted text to its original form', () => {
            const sourceCode = SourceCodeText.new({
                text: sourceCodeText,
            })

            expect( sourceCode.unformatBackText(formattedText) ) .to .equal( sourceCodeText )
        })

    })

    describe('with a multiple lines source code text', () => {

            const sourceCodeText =
`const n = 1
const m = 2

return n + m`

            const formattedText =
`const n = 1
const m = 2

return n + m`

        it('gets the source code text', () => {

            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getOriginalText() ) .to .equal( sourceCodeText )
        })

        it('gets the formatted source code text', () => {

            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getFormattedText() ) .to .equal( formattedText )
        })

        it('converts a given formatted text to its original form', () => {
            const sourceCode = SourceCodeText.new({
                text: sourceCodeText,
            })

            expect( sourceCode.unformatBackText(formattedText) ) .to .equal( sourceCodeText )
        })
    })

    describe('with a multiple lines source code with indentation text', () => {

            const sourceCodeText =
`const n = 1
    const m = 2

    if( true ) {
        return n + m
    }`

            const formattedText =
`const n = 1
const m = 2

if( true ) {
    return n + m
}`

        it('gets the source code text', () => {

            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getOriginalText() ) .to .equal( sourceCodeText )
        })

        it('gets the formatted source code text', () => {

            const sourceCode = SourceCodeText.new({ text: sourceCodeText })

            expect( sourceCode.getFormattedText() ) .to .equal( formattedText )
        })

        it('converts a given formatted text to its original form', () => {
            const sourceCode = SourceCodeText.new({
                text: sourceCodeText,
            })

            expect( sourceCode.unformatBackText(formattedText) ) .to .equal( sourceCodeText )
        })
    })
})