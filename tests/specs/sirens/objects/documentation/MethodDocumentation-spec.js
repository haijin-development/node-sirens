const expect = require('chai').expect
const MethodDocumentation = require('../../../../../src/sirens/objects/documentation/MethodDocumentation')

describe('When using a MethodDocumentation', () => {
    describe('to document a Method description', () => {

        it('builds a Method description from a template literal', () => {

            const methodComment =
    `
    Method(\`
        A regular js class to use in the classEditor example.
    \`)
    `

            const methodDocumentation = MethodDocumentation.fromString( methodComment )

            expect( methodDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
            )
        })

        it('builds a Method description from a string literal', () => {

            const methodComment =
    `Method(
        "A regular js class to use in the classEditor example."
    )`

            const methodDocumentation = MethodDocumentation.fromString( methodComment )

            expect( methodDocumentation.getDescription() ) .to .equal(
                'A regular js class to use in the classEditor example.'
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

            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const examples = methodDocumentation.getExamples()

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

            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const examples = methodDocumentation.getExamples()

            expect( examples[0] ) .to .eql({
                index: 0,
                Description: 'An example',
                Code: "const o = 'abc'",
            })
        })

    })

    describe('to document a Parameter', () => {

        it('builds a Method Param from a template literal', () => {

            const exampleComment =
    `
    Param({
        Name: "streetName",
        Protocols: [ String ],
        Description: "The name of the street. Does not include the street number.",
    })
    `
            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const params = methodDocumentation.getParams()

            expect( params[0] ) .to .eql({
                Name: 'streetName',
                Protocols: [ 'String' ],
                Description: 'The name of the street. Does not include the street number.',
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
            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const returns = methodDocumentation.getReturns()

            expect( returns ) .to .eql({
                Protocols: [ 'String' ],
                Description: 'The name of the street. Does not include the street number.',
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
            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const implementationNotes = methodDocumentation.getImplementationNotes()

            expect( implementationNotes ) .to .eql([
                'Assumes that the street is not empty.',
            ])
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

            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const tags = methodDocumentation.getTags()

            expect( tags ) .to .eql([
                'getters', 'accessors'
            ])
        })

        it('gets the method tags sorted alphabetically in reversed order', () => {

            const methodDocumentation = MethodDocumentation.fromString( exampleComment )

            const tags = methodDocumentation.getTagsSortedAlphabetically({ reversed: true })

            expect( tags ) .to .eql([
                'getters', 'accessors'
            ])
        })

    })

})