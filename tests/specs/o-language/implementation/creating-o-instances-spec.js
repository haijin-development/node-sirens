/*
 * In the O language an (yet unclassified) instance is created with the expression:
 *
 *      const object = OInstance.new()
 *
 * The O language does not have the concept of a special constructor function different from any other method.
 * Nevertheless classifications may define they own static methods to create and initialize instances:
 *
 *     class Point {
 *          static definition() {
 *              this.instanceVariables = ['x', 'y']
 *          }
 *
 *          // Instances creation
 *
 *          static new() {
 *              return OInstance.new().behaveAs(this)
 *          }
 *
 *          static with({x: x, y: y}) {
 *              return OInstance.new()
 *                  .behaveAs(this)
 *                  .setX(x)
 *                  .setY(y)
 *          }
 *      }
 *
 *      const point_1 = Point.new()
 *      const point_2 = Point.with({ x: 0, y: 0 })
 *
 * This way constructor methods are not limited to a unique 'OInstance.new()' operation but can have more expressive names 
 * and complex initialization of its intances.
 */

const expect = require('chai').expect
const OInstance = require('../../../../src/o-language/classifications/OInstance')

describe('When creating a new O instance', () => {
    it('it behaves as an OInstance', () => {
        const object = OInstance.new()

        expect(object.isBehavingAs(OInstance)) .to .be .true
    })

    it('it has only one classification', () => {
        const object = OInstance.new()

        expect(object.classifications().length) .to .equal(1)
    })
})