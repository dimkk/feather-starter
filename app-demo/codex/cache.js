const cache = require('persistent-cache')({
    base: './cache',
    name: 'codex',
    duration: process.env.CODEX_LIFETIME || 1000
})

module.exports = cache