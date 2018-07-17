require('dotenv').config()
const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio')

const usersService = require('./app/users/users.service')

const auth = require('@feathersjs/authentication')
const local = require('@feathersjs/authentication-local')
const jwt = require('@feathersjs/authentication-jwt')
const express = require('@feathersjs/express')
const find = require('find')
require('./app-demo/utils').createDbFolder()

const app =
    express(feathers())
        .configure(express.rest())
        .configure(socketio(io => {
            io.on('connection', (client) => {
                //console.log(client)
            })
        }))
        .configure(auth({ secret: 'diemotherfuckerdiemotherfucker' }))
        .configure(local())
        .configure(jwt())
        .configure(usersService)
        // .configure(nmServices)
        // .configure(verifyServices)
        // .configure(codexServices)
        // .configure(ucodexService)

app.service('users').on('created', test => {
    //console.log(test)
})
app.service('users').hooks({
    // Make sure `password` never gets sent to the client
    after: local.hooks.protect('password'),
    before: {
        find: [
            auth.hooks.authenticate('jwt')
        ],
        create: [
            local.hooks.hashPassword({ passwordField: 'password' })
        ]
    }
})

// TODO dynamic service config
// find.file(/\.service.js/, './app', (f) => {
//     let promises = []
//     f.forEach(element => {
//         console.log('injecting ' + element)
//         app.configure(require(element))  
//     });
// })


app.service('authentication').hooks({
    before: {
        create: [
            // You can chain multiple strategies
            auth.hooks.authenticate(['jwt', 'local'])
        ],
        remove: [
            auth.hooks.authenticate('jwt')
        ]
    }
});

// glob.readdir('*.service.*', function(err, files) {
//     console.log(files);
//   });


//if (process.env.NODE_ENV !== 'test')
app.listen(3030)
app.on('listening', function () {
    console.log(`Feathers application started on localhost:${3030}`);
});
console.log('started')
module.exports = app