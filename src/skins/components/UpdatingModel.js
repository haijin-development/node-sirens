const Classification = require('../../O').Classification

/*
 * This Classification can be added to a Component object while it is synchronizing the model value
 * from the widget value.
 *
 * When the widget changes it triggers a model update which in turn triggers a widget update.
 * One way to avoid an infinite loop of updates would be to ask the widget for the current
 * value and compare it againts the value from the model. If they are the same do not update it.
 * That has the disavantage of making a seconds call to the widget to get its value which can be expensive,
 * and that is some scenarios a programmer would like to set the widget value anyways (like is some tests).
 *
 * A different approach is to use this classification which simply does not update the widget any more.
 *
 * Although it may not be evident at a first glance this usage of classifications is an extremely simple,
 * clean and easy to use implementation of the FiniteStateMachine pattern.
 *
 *  Example:
 *
 *      onTextChanged(text) {
 *          this.duringClassificationDo( UpdatingModel, () => {
 *              this.getModel().setValue(text)
 *          })
 *      }
 *
 *      synchronizeViewFromModel() {
 *          const text = this.getModel().getValue()
 *
 *          this.getView().setText(text)
 *      }
 *
 */
class UpdatingModel {

    /*
     * The model has been syncronized with the value from the widget.
     * If it triggers a widget update just ignore it as it would create an infinite recursion.
     */
    synchronizeViewFromModel() {
    }

}

module.exports = Classification.define(UpdatingModel)