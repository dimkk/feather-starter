var request = require('request');
var zlib = require('zlib')
const cache = require('./cache')


var headers = {
    'Cache-Control': 'no-cache'
};



function setOptions({clan, seq, q}) {
    return {
        url: 'http://forum.netmarble.com/api/cafes/'+ clan +'/members/list?searchType=ALL&searchNickname='+ q +'&cafeId='+ clan +'&cafeSeq='+ seq +'&rows=50&start=0&sortType=JOIN_DATETIME&_=1516493595850',
        headers: headers
    };
}


/* response
 {
    "custom": null,
    "code": "SUCCESS",
    "success": true,
    "msg": "Action complete.",
    "redirectUrl": null,
    "result": [
      {
        "memberSeq": 23002391,
        "cafeSeq": 1868973,
        "playerSeq": 28048786,
        "nickname": "tooop5",
        "profileImageUrl":
          "http://lin2ws.gcdn.netmarble.com/lin2ws/forum/profile/class/67.png",
        "memberLevelCd": "99",
        "statusCd": "Y",
        "charSeq": null,
        "withdrawReasonCd": null,
        "withdrawDesc": null,
        "articleCount": 6,
        "replyCount": 0,
        "memoCount": 0,
        "visitCount": 17,
        "lastVisitDatetime": 1516489961000,
        "followCount": 0,
        "followerCount": 2,
        "hashTag": "supertest",
        "cafeId": "lin2ws_6338006113837068298",
        "cafeName": "Slavs(Кен Рохель04)",
        "memberLevelName": "Leader",
        "iconCd": "M",
        "pid": "8AFFB2F2CE6F43B8A2A1899B3C49ECA3",
        "restrictFlag": "N",
        "memberRestrictSeq": null,
        "restrictRegDatetime": null,
        "restrictEndDatetime": null,
        "restrictReasonCd": null,
        "restrictReasonName": null,
        "restrictDesc": null,
        "restrictDay": null,
        "auth": 0,
        "authMenuSeq": null,
        "menuAuth": 0,
        "isFollow": false,
        "characterInfo": null,
        "regDatetime": 1511697715000,
        "staff": false,
        "manager": true,
        "restricted": false,
        "authBinary": "0"
      }

       slavs
       cafeSeq: 1868973,
       cafeId: 'lin2ws_6338006113837068298',
       cafeName: 'Slavs(Ken Rauhel04)',
*
*/
module.exports = function(data){
    let CACHE_KEY = 'clanplayersearch_' + data.seq
    return new Promise((resolve, reject) => {
        let chunks = [];
        try {
            if (!cache.getSync(CACHE_KEY)) {
                request(setOptions(data), (error, response, body) => {
                    if (error || response.statusCode !== 200) reject(error)
                    let result = JSON.parse(body)
                    if (!cache.getSync(CACHE_KEY)) {
                        cache.putSync(CACHE_KEY, result)
                    }
                    resolve(cache.getSync(CACHE_KEY))
                })
            }
            else {
                resolve(cache.getSync(CACHE_KEY))
            }
        } catch(e) {
            console.log(e)
            reject(e)
        }
    })
    
}