const fs = require('fs')

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDbFolder() {
    if (!fs.existsSync('./db')) {
        fs.mkdirSync('./db')
    }
}

module.exports = {
    createDbFolder,
    getRandomInt
}