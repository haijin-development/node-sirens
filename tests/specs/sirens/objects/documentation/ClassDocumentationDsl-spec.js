const expect = require('chai').expect
const ClassDocumentation = require('../../../../../src/sirens/objects/documentation/ClassDocumentation')

describe('When using a ClassDocumentation', () => {
    describe('to document a Class description', () => {

        it('builds a Class description from a template literal', () => {

            const classComment =
    `
    Class(\`
        A regular js class to use in the classEditor example.
    \`)
    `

            const classDocumentation = ClassDocumentation.fromString( classComment )

            expect( classDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
            )
        })

        it('builds a Class description from a string literal', () => {

            const classComment =
    `Class(
        "A regular js class to use in the classEditor example."
    )`

            const classDocumentation = ClassDocumentation.fromString( classComment )

            expect( classDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
            )
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

            const classDocumentation = ClassDocumentation.fromString( exampleComment )

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

            const classDocumentation = ClassDocumentation.fromString( exampleComment )

            const examples = classDocumentation.getExamples()

            expect( examples[0] ) .to .eql({
                index: 0,
                Description: 'An example',
                Code: "const o = 'abc'",
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
            const classDocumentation = ClassDocumentation.fromString( exampleComment )

            const implementationNotes = classDocumentation.getImplementationNotes()

            expect( implementationNotes ) .to .eql([
                'Assumes that the street is not empty.',
            ])
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
            const classDocumentation = ClassDocumentation.fromString( exampleComment )

            const tags = classDocumentation.getTags()

            expect( tags ) .to .eql([
                'getters', 'accessors'
            ])
        })

    })

})