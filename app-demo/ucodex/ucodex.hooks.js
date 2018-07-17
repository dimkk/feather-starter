const hooks = require('feathers-authentication-hooks')
const errors = require('@feathersjs/errors');

module.exports = {
    before: {
        find: [
            hooks.associateCurrentUser({ idField: '_id', as: 'userId' }),
            hooks.restrictToOwner({ idField: '_id', as: 'userId' }),
            // hooks.restrictToRoles({
            //     roles: ['superAdmin', 'admin'],
            // }),
        ],
        get: [
            hooks.restrictToOwner({ idField: '_id', as: 'userId' }),
        ],
        create: [
            hooks.associateCurrentUser({ idField: '_id', as: 'userId' }),
            async context => {
                // return new Promise((resolve, reject) => {
                    
                // })
                const newCodexId = context.data.codexId
                const newUserId = context.data.userId
                const result = await context.service.find({
                    query: {
                    userId: newUserId,
                    codexId: newCodexId
                    }
                })
                if (result.total !== 0){
                    throw new Error('You cannot add more same codexes for this user')
                }  else {
                    return context
                }
            }
        ],
        update: [
            hooks.associateCurrentUser({ idField: '_id', as: 'userId' }),
            hooks.restrictToOwner({ idField: '_id', as: 'userId' }),
        ],
        patch: [
            hooks.associateCurrentUser({ idField: '_id', as: 'userId' }),
            hooks.restrictToOwner({ idField: '_id', as: 'userId' }),
        ],
        remove: [
            hooks.restrictToOwner({ idField: '_id', as: 'userId' }),
        ]
    }
}
