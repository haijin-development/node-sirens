const expect = require('chai').expect
const O = require('../../../../src/o-language/O')
const OInstance = require('../../../../src/o-language/classifications/OInstance')

describe('When creating a new O instance', () => {
    it('it behaves as an OInstance', () => {
        const object = O.new()

        expect(object.isBehavingAs(OInstance)) .to .be .true
    })

    it('it has only one classification', () => {
        const object = O.new()

        expect(object.classifications().length) .to .equal(1)
    })
})