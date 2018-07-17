const searchClanReq = require('./requests/searchClanReq')
const clanPlayerSearch = require('./requests/clanPlayerSearch')
const getUserPosts = require('./requests/getUserPosts')

const searchClan = (q) => {
    return searchClanReq(q)
}

/**
 * data - clan, seq, q
 */
const searchPlayer = (data) => {
    return clanPlayerSearch(data)
}

/**
 * data - clan, player, seq
 */
const getUPosts = (data) => {
    return getUserPosts(data)
}


module.exports = {
    searchClan,
    searchPlayer,
    getUPosts
}