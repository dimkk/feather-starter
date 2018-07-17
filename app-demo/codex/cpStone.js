const _ = require('lodash')


/**
 * Filles codexes with cp for one stone 
 * with respect to start codex level and 
 * amount of cores player already got
 * @param {*Array of codexes} codex data 
 * @returns promise with codexes with new new fields
 * cpForStone - amount of CP you get 100% by finishing this stone
 * potentialCpForStone - amount of cp you get, when you finish stonesToLvlUp amoutn of stones
 * stonesToLvlUp - amount of stones to finish current lvl
 */
module.exports = function(data, userData){
    if (!data) return new Promise((resolve, reject) => {reject('no data!')})
    const cps = data.map((codex) => {
        let userDataRow = {}
        if (userData) {
            let userDataRows = _.filter(userData, {codexId: codex.id})
            userDataRow = userDataRows.length > 0 ? userDataRows[0] : {}
        }
        return setKoef(codex, userDataRow)
    });
    return Promise.all(cps)
}

function setKoef(codex, {userDropAmount, userLvl, userCores}) {
    return new Promise((resolve, reject) => {
        
        let startLvl = 0, startCores = 0,
        // Если юзер ввел свое кол-во ядер 
        drop = userDropAmount ? userDropAmount : parseInt(codex.dropamount),
        results = []

        if (userLvl > 0) {
            startLvl = parseInt(userLvl)
        }
        
        if (startLvl === 10 || parseInt(codex[`amountlvl${startLvl}`]) <= userCores ) {
            codex.cpForStone = -1
            codex.error = 'User Cores input error - more cores then in max amount on current level'
            resolve(codex)
        }

        // Если юзер имеет сколько-то камней
        if (userCores > 0) {
            //if (codex.id === 109) console.log(userCores)
            startCores = userCores//parseInt(codex[`amountlvl${startLvl}`])
        }
        codex.userLvl = userLvl
        codex.userCores = userCores
        //if (codex.id === 54) console.log(startLvl)
        fillResults(codex, startLvl, startCores, drop, results, resolve, drop, startLvl)
    })
}

function fillResults(codex, startLvl, startCores, drop, arr, resolve, startDrop, initLvl) {
    let lvlcores = (parseInt(codex[`amountlvl${startLvl}`]))
    //if (codex.id === 109) console.log(startCores)
    const check2 = (lvlcores === startCores && initLvl === 9)
    const check1 = (startLvl === initLvl === 10)
    //if (codex.id === 61) console.log({check1, check2})
    if (check1 || check2) {
        const res = arr.reduce(function(total, num) {return (parseFloat(total) + parseFloat(num)).toFixed(1)}, '0')
        codex.cpArray = []
        codex.cpForStone = 0
        // codex.userCores = 0
        // codex.userLvl = 10
        codex.potentialCpForStone = 0
        codex.stonesToLvlUp = 0
        resolve(codex)
        //if (codex.id === 61) console.log({codex})
        return
    } 
    let dropMinusAmountMinusStart = drop - lvlcores - startCores
    const cpAmount = codex.cp / 10
    // А тут не корректно считаем цп за каждый камень на уровне
    //const cpAmount = ((lvlcores - startCores) * cpAtLvl).toFixed(1)
    
    if (dropMinusAmountMinusStart >= 0) {
        arr.push(cpAmount)
        fillResults(codex, startLvl + 1, 0, dropMinusAmountMinusStart, arr, resolve, startDrop, initLvl)
    } else {
        const res = arr.reduce(function(total, num) {return (parseFloat(total) + parseFloat(num)).toFixed()}, '0')
        codex.cpForStone = parseFloat(res)
        codex.cpArray = arr
        codex.potentialCpForStone = parseFloat(cpAmount)
        const corestToCompleteLvl = (lvlcores - Math.abs(drop))
        const stones = (corestToCompleteLvl / startDrop).toFixed(1)
        codex.stonesToLvlUp = parseFloat(stones)
        //if (codex.id === 61) console.log({res})//{startLvl, currentLvlAmount, startCores, corestToCompleteLvl, stones, drop, arr})
        //console.log({res, cpAmount, stones})
        resolve(codex);
        //if (codex.id === 61) console.log({codex})
        return
    }
}

/* http://www.csvjson.com/csv2json
cpForStone
userCores:
userLvl:
user: ''
'core': 'Julius',
    location: 'CTF 3',
    monster: 'Meforde',
    level: '',
    stat: 'Max MP',
    maxstat: '1030',
    cp: '1030',
    grade: 'A',
    dropamount: '24',
    farmtime: '5',
    close10lvltime: '187.5',
    close7lvltime: '71.9',
    close4lvl: '18.8',
    cplvl1: '6.87',
    cplvl2: '6.87',
    cplvl3: '3.43',
    cplvl4: '3.43',
    cplvl5: '1.58',
    cplvl6: '1.58',
    cplvl7: '0.82',
    cplvl8: '0.82',
    cplvl9: '0.48',
    cplvl10: '0.48',
    amountlvl1: '15',
    amountlvl2: '15',
    amountlvl3: '30',
    amountlvl4: '30',
    amountlvl5: '65',
    amountlvl6: '65',
    amountlvl7: '125',
    amountlvl8: '125',
    amountlvl9: '215',
    amountlvl10: '215',
    Total: '900'

*/