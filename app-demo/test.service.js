const service = require('feathers-nedb')
const db = require('../db')

module.exports = () => {
    return service({
        Model: db('test'),
        paginate: {
          default: 2,
          max: 4
        }
    })
}