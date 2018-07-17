const cache = require('persistent-cache')({
    base: './cache',
    name: 'verify',
    duration: process.env.VERIFICATION_PHRASE_LIFETIME
})
const verCache = require('persistent-cache')({
    base: './cache',
    name: 'verified',
    duration: process.env.VERIFIED_PID_LIFETIME
})

module.exports = {cache, verCache}