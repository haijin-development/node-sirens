const Sirens = require('../../src/index')
const Component = require('../../src/components/Component')

class CustomComponent extends Component{
    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( () => {
                this.styles({
                    width: 100,
                    height: 100,
                })

                this.horizontalSplitter( () => {

                    this.label({
                        splitProportion: 3.0/6,
                        text: 'Label 1'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 2'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 3'
                    })

                    this.label({
                        splitProportion: 1.0/6,
                        text: 'Label 4'
                    })

                })
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})
