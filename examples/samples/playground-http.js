



            const superagent = require('superagent')


            superagent
                .get('https://www.google.com/')
                .then(res => {
                    console.info(res)
                })
                .catch(err => {
                    console.info(err)
                })
