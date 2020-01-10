const expect = require('chai').expect
const FilePath = require('../../../../../src/O').FilePath
const Sirens = require('../../../../../src/Sirens')

const namespace = Sirens.namespace()

const fileSamplesRepository = require('../../fileSamplesRepository')
const fileWithFunctions = __dirname + '/../../../../samples/js-objects/functions-only.js'
const fileWithFunctionsWithComments = __dirname + '/../../../../samples/js-objects/functions-with-comments-only.js'

let temporaryFilePath
let sourceFile

const sourceFileParser = namespace.SourceFileStructureParser.new()

describe('When writing a method comment', () => {
    beforeEach( () => {
        fileSamplesRepository.cleanUp()
    })

    after( () => {
        fileSamplesRepository.cleanUp()
    })

    describe('to a method that has no previous comment', () => {
        beforeEach( () => {
            fileSamplesRepository.cleanUp()
            fileSamplesRepository.manageFile({ file: fileWithFunctions })

            temporaryFilePath = FilePath.new({
                path: fileSamplesRepository.pathTo( fileWithFunctions )
            })

            sourceFile = namespace.SourceFile.new({ path: temporaryFilePath })
        })


        it('writes the plain comment in a function at the begining of the file', () => {

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            const firstFunction = fileObjects[0]

            const comment = firstFunction.getMethodComment()

            comment.writeContents({
                commentContents: 'A comment',
                outerIndentation: { char: '   ' }
            })

            const expectedFileContents =
`/*
A comment
*/
function f1() {

}

function f2() {

}`

            expect( temporaryFilePath.getPath() ) .withFileContents .suchThat( (fileContents) => {
                expect( fileContents ) .to .eql( expectedFileContents )
            })
        })

        it('writes the plain comment in a function at the middle of the file', () => {

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            const secondFunction = fileObjects[1]

            const comment = secondFunction.getMethodComment()

            comment.writeContents({
                commentContents: 'A comment',
                outerIndentation: { char: '   ' }
            })

            const expectedFileContents =
`function f1() {

}

/*
A comment
*/
function f2() {

}`

            expect( temporaryFilePath.getPath() ) .withFileContents .suchThat( (fileContents) => {
                expect( fileContents ) .to .eql( expectedFileContents )
            })
        })
    })

    describe('to a method that has a previous comment', () => {
        beforeEach( () => {
            fileSamplesRepository.cleanUp()
            fileSamplesRepository.manageFile({ file: fileWithFunctionsWithComments })

            temporaryFilePath = FilePath.new({
                path: fileSamplesRepository.pathTo( fileWithFunctionsWithComments )
            })

            sourceFile = namespace.SourceFile.new({ path: temporaryFilePath })
        })

        it('writes the plain comment in a function at the begining of the file', () => {

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            const firstFunction = fileObjects[0]

            const comment = firstFunction.getMethodComment()

            comment.writeContents({
                commentContents: 'A comment',
                outerIndentation: { char: '   ' }
            })

            const expectedFileContents =
`/*
A comment
*/
function f1() {

}

/*
    Another function comment.
*/
function f2() {

}`

            expect( temporaryFilePath.getPath() ) .withFileContents .suchThat( (fileContents) => {
                expect( fileContents ) .to .eql( expectedFileContents )
            })
        })

        it('writes the plain comment in a function at the middle of the file', () => {

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            const secondFunction = fileObjects[2]

            const comment = secondFunction.getMethodComment()

            comment.writeContents({
                commentContents: 'A comment',
                outerIndentation: { char: '   ' }
            })

            const expectedFileContents =
`/*
    A function comment.
*/
function f1() {

}

/*
A comment
*/
function f2() {

}`

            expect( temporaryFilePath.getPath() ) .withFileContents .suchThat( (fileContents) => {
                expect( fileContents ) .to .eql( expectedFileContents )
            })
        })
    })
})