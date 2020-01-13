const expect = require('chai').expect
const Sirens = require('../../../../src/Sirens')

const namespace = Sirens.namespace()

const samplesFolder = 'tests/samples/specs/'

describe('When parsing a spec file', () => {
    describe('with .it() expressions', () => {
        it('converts the expressions to JsSpecTests', () => {
            const filename = samplesFolder + 'spec-with-its.js'

            const sourceFile = namespace.SourceFile.new({ path: filename })

            const sourceFileParser = namespace.SourceFileStructureParser.new()

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            expect( fileObjects ) .count .to .equal( 4 )

            expect( fileObjects ) .atIndex(1) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecTest' )
                expect( specObject.getTestDescription() ) .to .equal( 'first test' )
            })

            expect( fileObjects ) .atIndex(2) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecTest' )
                expect( specObject.getTestDescription() ) .to .equal( 'second test' )
            })

            expect( fileObjects ) .atIndex(3) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecTest' )
                expect( specObject.getTestDescription() ) .to .equal( 'third test' )
            })
        })        
    })

    describe('with .describe() expressions', () => {
        it('converts the expressions to JsDescribeSpec', () => {
            const filename = samplesFolder + 'spec-with-describes.js'

            const sourceFile = namespace.SourceFile.new({ path: filename })

            const sourceFileParser = namespace.SourceFileStructureParser.new()

            const fileObjects = sourceFileParser
                .parseSourceFile({ sourceFile: sourceFile })
                .getChildObjects()

            expect( fileObjects ) .count .to .equal( 4 )

            expect( fileObjects ) .atIndex(1) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecDescribe' )
                expect( specObject.getDescribeText() ) .to .equal( 'first describe' )
            })

            expect( fileObjects ) .atIndex(2) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecDescribe' )
                expect( specObject.getDescribeText() ) .to .equal( 'second describe' )
            })

            expect( fileObjects ) .atIndex(3) .to .be .suchThat( (specObject) => {
                expect(specObject) .to .behaveAs( 'JsSpecDescribe' )
                expect( specObject.getDescribeText() ) .to .equal( 'third describe' )
            })
        })        
    })

})