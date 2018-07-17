module.exports = function() {
    const app = this;
    const getClan = {
        get(q) {
            return nm.searchClan(q === -1 ? '' : q)
        }
    }
    const getPlayers = {
        get(q, params) {
            //console.log(q)
            //console.log(params)
            return nm.searchPlayer(params.query)
        }
    }
    app.use('/getclan', getClan)
    app.use('/getplayers', getPlayers)
}