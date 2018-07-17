const service = require('feathers-nedb')
const db = require('../dbs')
const userHooks = require('./users.hooks')

module.exports = function() {
    const app = this;
    const serv = service({
        Model: db('users'),
        paginate: {
            default: 2,
            max: 4
        }
    })
    app.use('/users', serv)
    const usersService = app.service('/users')
    usersService.hooks(userHooks)
}