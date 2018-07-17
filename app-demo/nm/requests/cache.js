const cache = require('persistent-cache')({
    base: './cache',
    name: 'requests',
    duration: 1000 * 120 //two min 
})

module.exports = cache