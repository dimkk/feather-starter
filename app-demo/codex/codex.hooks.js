const hooks = require('feathers-authentication-hooks')
const _ = require('lodash')

module.exports = {
    before: {
        create: [
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: false,
            })
        ],
        update: [
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: false,
            }),
        ],
        patch: [ // client route /user/rolechange patches roles. todo might check its an admin acct
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: false,
            }),
        ],
        remove: [
            hooks.restrictToRoles({
                roles: ['superAdmin', 'admin'],
                owner: false,
            }),
        ],
    },
    after: {
        find: [
            async context => {
                context.data = _.orderBy(context.data, ['sort'])
            }
        ]
    }
}
