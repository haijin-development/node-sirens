const expect = require('chai').expect
const ParamsCheckerCreator = require('../../src/o-language/classifications/ParamsCheckerCreator')
const StringStream = require('../../src/o-language/classifications/StringStream')

// Enable strict parameters checking during tests
before( () => {
    StringStream.behaveAs( ParamsCheckerCreator )
})
