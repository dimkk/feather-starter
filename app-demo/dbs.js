const NeDB = require('nedb')

module.exports = (name) => new NeDB({ 
    filename: `./db/` + name, 
    autoload: true,
    timestampData: true
})