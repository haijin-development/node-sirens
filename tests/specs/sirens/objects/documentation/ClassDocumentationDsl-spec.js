const expect = require('chai').expect
const ClassDocumentation = require('../../../../../src/sirens/objects/documentation/ClassDocumentation')
const DocumentationReader = require('../../../../../src/sirens/objects/documentation/DocumentationReader')

describe('When reading a ClassDocumentation', () => {
    describe('to document a Class description', () => {

        it('builds a Class description from a template literal', () => {

            const classComment =
    `
    Class(\`
        A regular js class to use in the classEditor example.
    \`)
    `

            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: classComment })

            expect( classDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
            )
        })

        it('builds a Class description from a string literal', () => {

            const classComment =
    `Class(
        "A regular js class to use in the classEditor example."
    )`

            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: classComment })

            expect( classDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
            )
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
            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: exampleComment })

            const implementationNotes = classDocumentation.getImplementationNotes()

            expect( implementationNotes ) .to .eql([
                'Assumes that the street is not empty.',
            ])
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

            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: exampleComment })

            const examples = classDocumentation.getExamples()

            expect( examples[0] ) .to .eql({
                index: 0,
                Description: 'An example',
                Code: "const o = 'abc'\n\no.toUpperCase()",
            })
        })

        it('builds an example from a string literal', () => {

            const exampleComment =
    `Example({
        Description: "An example",
        Code: "const o = 'abc'",
    })`

            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: exampleComment })

            const examples = classDocumentation.getExamples()

            expect( examples[0] ) .to .eql({
                index: 0,
                Description: 'An example',
                Code: "const o = 'abc'",
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
            const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: exampleComment })

            const tags = classDocumentation.getTags()

            expect( tags ) .to .eql([
                'getters', 'accessors'
            ])
        })

    })

})

describe('When writing a ClassDocumentation', () => {

    it('generates a Class description', () => {

        const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: '' })

        classDocumentation.setDescription( 'A class description.' )

        const generatedClassComment = classDocumentation.generateComment()

        const expectedClassComment =
`/*
   Class(\`
      A class description.
   \`)
*/`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the implementation notes', () => {

        const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: '' })

        classDocumentation.addImplementationNote( 'Implementation note 1.' )
        classDocumentation.addImplementationNote( 'Implementation note 2.' )

        const generatedClassComment = classDocumentation.generateComment()

        const expectedClassComment =
`/*
   Implementation(\`
      Implementation note 1.
   \`)

   Implementation(\`
      Implementation note 2.
   \`)
*/`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the implementation notes', () => {

        const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: '' })

        classDocumentation.addExample({
            Description: 'Example 1.',
            Code: 
`const o = 'abc'

o.toUpperCase()`,
        })

        classDocumentation.addExample({
            Description: 'Example 2.',
            Code: 
`const o = 'cba'

o.toUpperCase()`,
        })

        const generatedClassComment = classDocumentation.generateComment()

        const expectedClassComment =
`/*
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
   })
*/`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

    it('generates the tags', () => {

        const classDocumentation = DocumentationReader.readClassDocumentationFromString({ string: '' })

        classDocumentation.setTags([ 'tag1', 'tag2' ])

        const generatedClassComment = classDocumentation.generateComment()

        const expectedClassComment =
`/*
   Tags([
      'tag1', 'tag2'
   ])
*/`

        expect( generatedClassComment ) .to .equal( expectedClassComment )

    })

})