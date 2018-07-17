const service = require('feathers-nedb')
const db = require('../dbs')
const ucodexHooks = require('./ucodex.hooks')
const cpStone = require('../codex/cpStone')
const _ = require('lodash')

module.exports = function() {
    const app = this;
    const serv = service({
        Model: db('ucodex'),
        paginate: {
            default: 200,
            max: 200
        }
    })
    app.use('/ucodex', serv)
    const ucodexService = app.service('/ucodex')
    ucodexService.hooks(ucodexHooks)

    const getResult = {
        get(q, params) {
            return new Promise((resolve, reject) => {
                let dataPrep = []
                dataPrep.push(app.service('/codex').find())
                //console.log(params.query)
                //dataPrep.push(app.service('/ucodex').find({query:{userId:q}}))
                Promise.all(dataPrep).then(data => {
                    cpStone(data[0].data, params.query.ucodex.data || [])
                        .then(result => resolve(_.orderBy(result, ['sort'])))
                        .catch(err => reject(err))
                })
            })
        }
    }
    app.use('/ucodex/result', getResult)
    const ucodexResult = app.service('/ucodex/result')
    //ucodexResult.hooks(ucodexHooks)
}

/*  userCores: ''
    userLvl:
    userId: ''
    codexId: ''
*/