const expect = require('chai').expect
const Sirens = require('../../../../../src/Sirens')

const namespace = Sirens.namespace()

describe('When reading a ClassDocumentation', () => {

    describe('to document a Class description', () => {

        it('builds a Class description from a template literal', () => {

            const classComment =
    `
    Class(\`
        A regular js class to use in the FileEditor example.
    \`)
    `

            const classDocumentation =
                namespace.DocumentationReader.new().readClassDocumentationFromString({ string: classComment })

            expect( classDocumentation.getDescription() ) .to .be .suchThat( (description) => {
                expect( description.getText() ) .to .equal(
                    'A regular js class to use in the FileEditor example.'
                )
            })
        })

        it('builds a Class description from a string literal', () => {

            const classComment =
    `Class(
        "A regular js class to use in the FileEditor example."
    )`

            const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: classComment })

            expect( classDocumentation.getDescription() ) .to .be .suchThat( (description) => {
                expect( description.getText() ) .to .equal(
                    'A regular js class to use in the FileEditor example.'
                )
            })
        })

    })

    describe('to document an implementation note', () => {

        it('builds a Method Implementation from a template literal', () => {

            const exampleComment =
    `
    Implementation(\`
        Assumes that the street is not empty.
    \`)
    `
            const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: exampleComment })

            const implementationNotes = classDocumentation.getImplementationNotes()

            expect( implementationNotes ) .eachSuchThat( (implementationNote) => {
                expect( implementationNote.getText() ) .to
                    .eql( 'Assumes that the street is not empty.' )
            })
        })

    })


    describe('to document an example', () => {

        it('builds a Class example from a template literal', () => {

            const exampleComment =
    `
    Example({
        Description: \`An example\`,
        Code: \`
            const o = 'abc'

            o.toUpperCase()
        \`,
    })
    `

            const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: exampleComment })

            const examples = classDocumentation.getExamples()

            expect( examples[0] ) .to .be .suchThat( (example) => {
                expect( example.getDescription() ) .to .equal( 'An example' )
                expect( example.getCode() ) .to .equal( "const o = 'abc'\n\no.toUpperCase()" )
            })
        })

        it('builds an example from a string literal', () => {

            const exampleComment =
    `Example({
        Description: "An example",
        Code: "const o = 'abc'",
    })`

            const classDocumentation =
                namespace.DocumentationReader.new().readClassDocumentationFromString({ string: exampleComment })

            const examples = classDocumentation.getExamples()

            expect( examples[0] ) .to .be .suchThat( (example) => {
                expect( example.getDescription() ) .to .equal( 'An example' )
                expect( example.getCode() ) .to .equal( "const o = 'abc'" )
            })

        })

    })

    describe('to document a tag', () => {

        it('builds a Method Tag from a template literal', () => {

            const exampleComment =
    `
    Tags([
        "getters", "accessors"
    ])
    `
            const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: exampleComment })

            const tags = classDocumentation.getTags()

            expect( tags[0] ) .suchThat( (tag) => {
                expect( tag.getLabel() ) .to .eql( 'getters' )
            })

            expect( tags[1] ) .suchThat( (tag) => {
                expect( tag.getLabel() ) .to .eql( 'accessors' )
            })
        })

    })

})

describe('When writing a ClassDocumentation', () => {

    it('generates a Class description', () => {

        const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: '' })

        classDocumentation.setDescriptionFrom({ text: 'A class description.' })

        const generatedClassComment = classDocumentation.generateCommentContents()

        const expectedClassComment =
`
Class(\`
   A class description.
\`)`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the implementation notes', () => {

        const classDocumentation = 
            namespace.DocumentationReader.new().readClassDocumentationFromString({ string: '' })

        classDocumentation.addImplementationNoteFrom({ text: 'Implementation note 1.' })
        classDocumentation.addImplementationNoteFrom({ text: 'Implementation note 2.' })

        const generatedClassComment = classDocumentation.generateCommentContents()

        const expectedClassComment =
`
Implementation(\`
   Implementation note 1.
\`)

Implementation(\`
   Implementation note 2.
\`)`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the implementation notes', () => {

        const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: '' })

        classDocumentation.addExampleFrom({
            description: 'Example 1.',
            code: 
`const o = 'abc'

o.toUpperCase()`,
        })

        classDocumentation.addExampleFrom({
            description: 'Example 2.',
            code: 
`const o = 'cba'

o.toUpperCase()`,
        })

        const generatedClassComment = classDocumentation.generateCommentContents()

        const expectedClassComment =
`
Example({
   Description: \`
      Example 1.
   \`,
   Code: \`
      const o = 'abc'

      o.toUpperCase()
   \`,
})

Example({
   Description: \`
      Example 2.
   \`,
   Code: \`
      const o = 'cba'

      o.toUpperCase()
   \`,
})`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the tags', () => {

        const classDocumentation = namespace.DocumentationReader.new().readClassDocumentationFromString({ string: '' })

        classDocumentation.setTagsFrom({ tagsStrings: [ 'tag1', 'tag2' ] })

        const generatedClassComment = classDocumentation.generateCommentContents()

        const expectedClassComment =
`
Tags([
   'tag1', 'tag2'
])`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

})