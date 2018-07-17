var request = require('request');
var zlib = require('zlib')
const cache = require('./cache')
 //TODO Добавть сюда юзера ид, который делает запрос


function setOptions({clan, player, seq}) {
    return { 
        method: 'POST',
    url: 'http://forum.netmarble.com/boardapi/v2/article/list',
    headers: 
     { 'Postman-Token': '586cd5f1-bdf5-ccdb-ba79-b385a2b4ef84',
       Referer: 'http://forum.netmarble.com/'+clan+'/profile?pid='+player,
       Connection: 'keep-alive',
       Cookie: '_ga=GA1.2.952388904.1514126776; viewType=L; _gid=GA1.2.395985384.1516489314; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=ru_RU; languageCd=en_US; gLanguageCd=en_US; _pk_id.18.0234=fb8ca29a89f58e64.1515797108.6.1516531050.1516531050.; _pk_ses.19.0234=*; _gat=1; _pk_id.19.0234=4655d07c341e0c49.1515797022.6.1516540805.1516540705.',
       'X-Requested-With': 'XMLHttpRequest',
       'Cache-Control': 'no-cache',
       Accept: 'application/json, text/javascript, */*; q=0.01',
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
       'X-Compress': 'null',
       'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
       Origin: 'http://forum.netmarble.com',
       Pragma: 'no-cache' },
    body: 'bbsId=0&rows=10&keyword='+player+'&start=0&channel=001&siteCode='+clan+'&searchField=PID&searchArea=SITE_CODE&endDate='+Date.now()+'&cafeSeq='+seq }
}


/* response
 {
    "act": "ARTICLE_GET_LIST",
    "totalCount": 6,
    "todayCount": null,
    "id": null,
    "errCode": null,
    "errMessage": null,
    "bbsId": null,
    "articleList": [
      {
        "custom": { "regDate": "2018-01-16 13:01:57", "isOwner": "false" },
        "gameCode": null,
        "pid": "8AFFB2F2CE6F43B8A2A1899B3C49ECA3",
        "cid": null,
        "playerSeq": null,
        "charSeq": null,
        "memberSeq": 23002391,
        "siteCode": null,
        "communityType": null,
        "siteName": null,
        "language": null,
        "cafeSeq": 1868973,
        "objId": "5a5d7935e4b0c735be81e965",
        "id": 545807,
        "bbsId": 3627553,
        "refId": [5],
        "depth": 0,
        "loginId": null,
        "nickname": "tooop5",
        "remoteIp": null,
        "channel": null,
        "title": "Write here the text from instruction",
        "content": "1\r\n",
        "regDate": 1516075317436,
        "timezone": null,
        "modifyDate": null,
        "deleteDate": null,
        "addDate": 1516075317436,
        "delFlag": 0,
        "delMessage": null,
        "memoCount": 0,
        "likeCount": 0,
        "recentLikeHistory": null,
        "viewCount": 4,
        "replyCount": 0,
        "categoryId": 0,
        "categoryName": null,
        "etc": {
          "level": "10",
          "guildName": "Slavs",
          "iconCd": "1",
          "guildId": "6338006113837068298",
          "charName": "tooop5",
          "profileImageUrl":
            "http://lin2ws.gcdn.netmarble.com/lin2ws/forum/profile/class/67.png",
          "serverId": "204",
          "serverName": "Ken Rauhel04",
          "guildUri": "/lin2ws_6338006113837068298",
          "memberLevelName": "Squire"
        },
        "thumbnailUrl": null,
        "displayMobile": null,
        "type": "DEFAULT",
        "typeIndex": null,
        "deviceType": null,
        "isService": null,
        "isSelected": null,
        "isMemoPerm": false,
        "isReplyArticlePerm": true,
        "viewLevel": 10,
        "attachFiles": null,
        "writerIconCd": null,
        "writerProfileImageUrl": null,
        "attachFileInfo": [],
        "videos": null,
        "parentId": 0,
        "parentArticleInfo": null,
        "recommendDate": 0,
        "childArticleInfo": null,
        "isSurveyUse": false,
        "hashTags": null,
        "articleOpenType": "OPEN",
        "version": null,
        "bbsIdList": null,
        "noticeStartDatetime": null,
        "noticeStartTimezone": null,
        "noticeEndDatetime": null,
        "noticeEndTimezone": null,
        "isEventDate": null,
        "eventStartDatetime": null,
        "eventStartTimezone": null,
        "eventEndDatetime": null,
        "eventEndTimezone": null,
        "currentDatetime": null,
        "announceDatetime": null,
        "announceTimezone": null,
        "noticeStartOffset": null,
        "noticeEndOffset": null,
        "eventStartOffset": null,
        "eventEndOffset": null,
        "announceOffset": null,
        "announceUrl": null,
        "prevId": null,
        "prevTitle": null,
        "nextId": null,
        "nextTitle": null,
        "noticeRank": null,
        "myLikeArticle": false,
        "displayPc": null
      },
*
*/
module.exports = function(data){
    let CACHE_KEY = 'getuserposts_' + data.player
    return new Promise((resolve, reject) => {
        let chunks = [];
        try {
            if (!cache.getSync(CACHE_KEY)) {
                request(setOptions(data), (error, response, body) => {
                    //console.log(body)
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