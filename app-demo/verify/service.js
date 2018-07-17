const randomWord = require('random-word')
const {verCache, cache} = require('./cache')
const nm = require('../nm')
const c = require('./constants')
const _ = require('lodash')


module.exports = function() {
    const app = this;
    const getPhrase = {
        get(q) {
            return new Promise((resolve, reject) => {
                if (!q) reject(new Error('Phrase should be generated for pid, no pid was send'))
                const phrase = `${process.env.APP_DOMAIN} ${randomWord()} ${randomWord()}`
                cache.putSync(q, phrase)
                //console.log('phrase generated - ' + phrase)
                resolve(phrase)
            })
        }
    }
    const verifyPhrase = {
        get(q, params) {
            return new Promise((resolve, reject) => {
                const phrase = cache.getSync(q)
                //console.log(phrase)
                if (!phrase) {
                    console.log('rejected')
                    reject(c.VERIFICATION_EXPIRED)
                } 
                //console.log(params)
                let {clan, seq, debug} = params.query
                if (!clan || !q || !seq) reject(new Error('Some of params missing'))
                nm.getUPosts({clan, player:q, seq}).then((data) => {
                    //console.log(!!debug)
                    if (!data.errCode && data.totalCount > 0) {
                        let posts = _.filter(data.articleList, (a => {
                            // I DONT KNOW WHY THE FUCK, BUT THIS WORKS ONLY LIKE THAT
                            // NOT LIKE THAT - a => a.title ? debug : phrase
                            let result, ph
                            if (!!debug) ph = debug
                            else ph = phrase
                            if (ph === a.title) result = true
                            else result = false
                            //console.log(result)
                            return result
                        }))
                        if (posts.length > 0) {
                            //console.log(posts.length)
                            verCache.putSync(q, 'true')
                            resolve(c.VERIFICATION_SUCCESS)
                        } else {
                            reject(c.VERIFICATION_ERROR)
                        }
                    } else {
                        reject(c.VERIFICATION_ERROR)
                    }
                    
                }).catch(err => {console.log(err);eject(err)})
            })
        }
    }
    
    app.use('/getphrase', getPhrase)
    app.use('/verifyphrase', verifyPhrase)
}