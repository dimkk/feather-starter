const {verCache} = require('./cache')

module.exports = function (pid) {
    return verCache.getSync(pid)
}