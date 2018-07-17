const hooks = require('feathers-authentication-hooks')
const usersSchema = require('./users.schema')
const confirm = require('../verify/confirm')

const usersHooks = [
    usersSchema.hooks.populate,
    usersSchema.hooks.sanitize,
    usersSchema.hooks.validate
]

module.exports = {
    before: {
        find: [
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
            }),
            //hooks.restrictToOwner({ idField: '_id', ownerField: '_id' })
        ],
        get: [
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: true,
                ownerField: '_id'
            }),
        ],
        create: [
            ...usersHooks,
            (context) =>{
                const check1 = context.data.email === 'homchevp@yahoo.com'
                const check2 = context.data.email === 'dimkk@outlook.com'
                context.data.roles = []
                if ( check1 || check2) {
                    //console.log({check1, check2});
                    context.data.roles.push('superAdmin')
                } else {
                    context.data.roles.push('user')
                }
                //console.log(context.data.roles)
                return context
                //if (confirm(context.data.l2rPid) !== 'true') context.result = false
            },
            
            //     validateSchema.form(schemas.signup, schemas.options), // schema validation
            //     hooks.validateSync(client.signup),  // redo redux-form client validation
            //     hooks.validateUsingPromise(values => verifyReset.create( // redo redux-form async
            //         { action: 'unique', value: { username: values.username, email: values.email } }
            //     )),
            //     hooks.validateUsingCallback(server.signup, { app }), // server validation
            //     hooks.remove('confirmPassword'),
            //     verifyHooks.addVerification(), // set email addr verification info
            //     hooks.hashPassword(),
        ],
        update: [
            ...usersSchema.hooks,
            // Only the owner (user) or admin can update a user
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: true,
                ownerField: '_id'
            }),
        ],
        patch: [ // client route /user/rolechange patches roles. todo might check its an admin acct
            ...usersSchema.hooks,
            // Only the owner (user) or admin can get a user
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: true,
                ownerField: '_id'
            }),
        ],
        remove: [
            // Only the owner (user) or admin can remove a user
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: true,
                ownerField: '_id'
            }),
        ],
    }
}
