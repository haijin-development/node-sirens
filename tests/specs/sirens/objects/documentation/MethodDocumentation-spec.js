const expect = require('chai').expect
const Sirens = require('../../../../../src/Sirens')

const namespace = Sirens.namespace()

describe('When using a MethodDocumentation', () => {
    describe('to document a Method description', () => {

        it('builds a Method description from a template literal', () => {

            const methodComment =
    `
    Method(\`
        A regular js class to use in the FileEditor example.
    \`)
    `

            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: methodComment })

            expect( methodDocumentation.getDescription() ) .to .be .suchThat( (description) =>
                expect( description.getText() ) .to .equal(
                    'A regular js class to use in the FileEditor example.'
                )
            )
        })

        it('builds a Method description from a string literal', () => {

            const methodComment =
    `Method(
        "A regular js class to use in the FileEditor example."
    )`

            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: methodComment })

            expect( methodDocumentation.getDescription() ) .to .be .suchThat( (description) =>
                expect( description.getText() ) .to .equal(
                    'A regular js class to use in the FileEditor example.'
                )
            )
        })

    })

    describe('to document an example', () => {

        it('builds a Method example from a template literal', () => {

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

            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const examples = methodDocumentation.getExamples()

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

            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const examples = methodDocumentation.getExamples()

            expect( examples[0] ) .to .be .suchThat( (example) => {
                expect( example.getDescription() ) .to .equal( 'An example' )
                expect( example.getCode() ) .to .equal( "const o = 'abc'" )
            })
        })

    })

    describe('to document a Parameter', () => {

        it('builds a Method Param from a template literal', () => {

            const exampleComment =
    `
    Param({
        Name: "streetName",
        Description: "The name of the street. Does not include the street number.",
    })
    `
            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const params = methodDocumentation.getParams()

            expect( params[0] ) .to .be .suchThat( (param) => {
                expect( param.getName() ) .to .eql( 'streetName' )
                expect( param.getDescription() ) .to .eql( 'The name of the street. Does not include the street number.' )
            })
        })

    })

    describe('to document a Returns', () => {

        it('builds a Method Returns from a template literal', () => {

            const exampleComment =
    `
    Returns({
        Protocols: [ String ],
        Description: "The name of the street. Does not include the street number.",
    })
    `
            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const returns = methodDocumentation.getReturnValue()

            expect( returns.getDescription() ) .to .eql(
                'The name of the street. Does not include the street number.',
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
            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const implementationNotes = methodDocumentation.getImplementationNotes()

            expect( implementationNotes ) .eachSuchThat( (implementationNote) => {
                expect( implementationNote.getText() ) .to
                    .eql( 'Assumes that the street is not empty.' )
            })
        })

    })

    describe('to document a tag', () => {

            const exampleComment =
                `
                Tags([
                    "getters", "accessors"
                ])
                `


        it('builds a Method Tag from a template literal', () => {

            const methodDocumentation = namespace.DocumentationReader.new().readMethodDocumentationFromString({ string: exampleComment })

            const tags = methodDocumentation.getTags()

            expect( tags[0] ) .suchThat( (tag) => {
                expect( tag.getLabel() ) .to .eql( 'getters' )
            })

            expect( tags[1] ) .suchThat( (tag) => {
                expect( tag.getLabel() ) .to .eql( 'accessors' )
            })
        })

    })

})