const expect = require('chai').expect
const SourceFile = require('../../../../src/sirens/objects/SourceFile')
const SourceFileStructureParser = require('../../../../src/sirens/objects/SourceFileStructureParser')

const samplesFolder = 'tests/samples/js-objects/'

describe('When parsing a Js file', () => {
    it('with no functions or classes gets the text', () => {
        const filename = samplesFolder + 'text-only.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        const expectedContents =
`const path = require('path')

let n = 1


n += 1`

        expect( fileObjects.length ) .to .equal( 1 )
        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'plain text' )
        expect( fileObjects[0].getContents() ) .to .equal( expectedContents )
    })

    it('with only functions gets the functions', () => {
        const filename = samplesFolder + 'functions-only.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        const expectedContents1 =
`function f1() {

}`

        const expectedContents2 =
`function f2() {

}`

        expect( fileObjects.length ) .to .equal( 2 )

        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'f1(...)' )
        expect( fileObjects[0].getContents() ) .to .equal( expectedContents1 )

        expect( fileObjects[1].getFileObjectDescription() ) .to .equal( 'f2(...)' )
        expect( fileObjects[1].getContents() ) .to .equal( expectedContents2 )
    })

    it('with only classes gets the classes', () => {
        const filename = samplesFolder + 'classes-only.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        const expectedContents1 =
`class C1 {

}`

        const expectedContents2 =
`class C2 {

}`

        expect( fileObjects.length ) .to .equal( 2 )

        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'C1 class' )
        expect( fileObjects[0].getContents() ) .to .equal( expectedContents1 )

        expect( fileObjects[1].getFileObjectDescription() ) .to .equal( 'C2 class' )
        expect( fileObjects[1].getContents() ) .to .equal( expectedContents2 )
    })

    it('with classes, functions and initial text', () => {
        const filename = samplesFolder + 'text-function-class.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        expect( fileObjects.length ) .to .equal( 3 )

        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'plain text' )
        expect( fileObjects[1].getFileObjectDescription() ) .to .equal( 'f1(...)' )
        expect( fileObjects[2].getFileObjectDescription() ) .to .equal( 'C1 class' )
    })

    it('with classes, functions and ending text', () => {
        const filename = samplesFolder + 'function-class-text.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        expect( fileObjects.length ) .to .equal( 3 )

        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'f1(...)' )
        expect( fileObjects[1].getFileObjectDescription() ) .to .equal( 'C1 class' )
        expect( fileObjects[2].getFileObjectDescription() ) .to .equal( 'plain text' )
    })

    it('with classes, functions and text in the middle', () => {
        const filename = samplesFolder + 'function-text-class.js'

        const sourceFile = SourceFile.new({ filepath: filename })

        const sourceFileParser = SourceFileStructureParser.new()

        const fileObjects = sourceFileParser
            .parseSourceFile({ sourceFile: sourceFile })
            .getChildObjects()

        expect( fileObjects.length ) .to .equal( 3 )

        expect( fileObjects[0].getFileObjectDescription() ) .to .equal( 'f1(...)' )
        expect( fileObjects[1].getFileObjectDescription() ) .to .equal( 'plain text' )
        expect( fileObjects[2].getFileObjectDescription() ) .to .equal( 'C1 class' )
    })
})