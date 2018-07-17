const service = require('feathers-nedb')
const db = require('../dbs')
const csvjson = require('csvjson')
const fs = require('fs')
const path = require('path')
const cache = require('./cache')
const codexHooks = require('./codex.hooks')

function getJson(){
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'cores.json'), { encoding : 'utf8'}))
    return data
}

module.exports = function() {
    const app = this;
    const serv = service({
        Model: db('codex'),
        paginate: {
            default: 200,
            max: 200
        }
    })
    app.use('/codex', serv)
    const codexService = app.service('/codex')
    codexService.hooks(codexHooks)
    app.service('/codex').find()
        .then((data) => {
            if (data.total === 0) {
                const data = getJson()
                let promises = []
                data.forEach(c => {
                    promises.push(app.service('/codex').create(c))
                })
                Promise.all(promises).then(() => {
                    console.log('codex data import done')
                })
            }
        })
}

/* http://www.csvjson.com/csv2json
"zone":"TI",
      "id":29,
      "core": "Black Fang (C)",
      "location": "East Talking Island",
      "monster": "Swift Black Wolf",
      "level": 7,
      "stat": "P. Atk / M. Atk",
      "maxstat": "50/50",
      "cp": 250,
      "grade": "С",
      "dropamount": 42,
      "farmtime": 5,
      "close10lvltime": 10,
      "close7lvltime": 4,
      "close4lvl": 1.4,
      "cplvl1": 12.5,
      "cplvl2": 12.5,
      "cplvl3": 6.25,
      "cplvl4": 6.25,
      "cplvl5": 4.17,
      "cplvl6": 4.17,
      "cplvl7": 2.5,
      "cplvl8": 2.5,
      "cplvl9": 1.25,
      "cplvl10": 1.25,
      "amountlvl1": 2,
      "amountlvl2": 2,
      "amountlvl3": 4,
      "amountlvl4": 4,
      "amountlvl5": 6,
      "amountlvl6": 6,
      "amountlvl7": 10,
      "amountlvl8": 10,
      "amountlvl9": 20,
      "amountlvl10": 20,
      "total": 84

*/