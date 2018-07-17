var request = require('request');
var zlib = require('zlib')
const cache = require('./cache')

var headers = {
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'http://forum.netmarble.com/game/lin2ws?gLanguageCd=en_US',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Cookie': 'org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=en_US; languageCd=en_US; gLanguageCd=en_US;'
};

function setOptions(q) {
    return {
        url: 'http://forum.netmarble.com/api/game/lin2ws/guildCafes?start=0&rows=10&searchCafeName=' + q + '&_=1516531223707',
        headers: headers
    };
}


/* response
*{ custom: null,
  code: 'SUCCESS',
  success: true,
  msg: 'Action complete.',
  redirectUrl: null,
  result:
   [ { cafeSeq: 2031195,
       cafeId: 'lin2ws_6349205238150544384',
       cafeName: 'BrothersSlavs(Кен Рохель07)',
       region: 'en',
       languageCd: 'en_US',
       languageName: null,
       statusCd: 'Y',
       cafeStatusCode: 'NORMAL',
       mainImgUrl: 'http://sgimage.netmarble.com/images/netmarble/lin2ws/20171107/1510055372905.jpg',
       mobileMainImgUrl: 'http://sgimage.netmarble.com/images/netmarble/lin2ws/20171107/1510055372905.jpg',
       thumbImgUrl: 'http://lin2ws.gcdn.netmarble.com/lin2ws/forum/profile/guild/1007_2019.png',
       openDatetime: 1513800892000,
       closeRegDatetime: null,
       closeDatetime: null,
       updDatetime: 1514530706000,
       description: 'Клан Братьев-Славян.',
       memberCount: 2,
       managerMemberSeq: 24578872,
       managerPlayerSeq: null,
       managerPId: null,
       managerNickname: null,
       reportArticleCount: null,
       cafeUri: 'lin2ws_6349205238150544384',
       serviceVersion: '20',
       shareImgUrl: null,
       restrictRegDatetime: 1513800892000,
       restrictEndDatetime: 1513800892000,
       restrictRegUsn: null,
       gameCode: 'lin2ws',
       guildSeq: 1013479,
       recentListUseFlag: 'N',
       boardTypeCd: 'NOTICE',
       piwikIdSite: null,
       lastWriteDatetime: null,
       cafeType: null,
       guild: null,
       managerProfileImageUrl: null,
       officialCafeId: null,
       guildUseFlag: null,
       officialCafe: false,
       closed: false }]}
*
*/
module.exports = function(q){
    let CACHE_KEY = 'searchClanReq_' + q
    return new Promise((resolve, reject) => {
        let chunks = [];
        try {
            //console.log(cache.getSync(CACHE_KEY))
            if (!cache.getSync(CACHE_KEY)) {
                request(setOptions(q))
                    .pipe(zlib.createGunzip())
                    .on('data', (data) => {
                        chunks.push(data)
                    })
                    .on('end', () => {
                        let buf = Buffer.concat(chunks)
                        let result = JSON.parse(buf.toString())
                        // TODO??? возможно, надо прочитать может можно ограничить поля
                        // let clanArray = []
                        // result.result.map((clan) => {
                        //     clanArray.push
                        // })
                        if (!cache.getSync(CACHE_KEY)) {
                            cache.putSync(CACHE_KEY, result)
                        }
                        //console.log('normal resolve')
                        resolve(result)
                    
                })
            }
            else {
                //console.log('cached resolve')
                resolve(cache.getSync(CACHE_KEY))
            }
        } catch(e) {
            console.log(e)
            reject(e)
        }
    })
    
}