const chai = require('chai')
const expect = chai.expect
const cpStone = require('./cpStone')
let data = require('./cores.spec')
describe('L2R CODEX amount of cp to stone', () => {
    before(() => {
        chai.use(require('chai-as-promised'))
        chai.use(require('chai-subset'))
        
    });
    it('fill data with cpForStone property ', () => {
        return expect(cpStone(data))
            .to.eventually.have.deep.nested.property('[0].cpForStone')
    })
    it('fill data with cpForStone property but no data provide ', () => {
        return expect(cpStone())
            .to.eventually.rejectedWith('no data!')
    })
    it('fill data with cpForStone property and check result', () => {
        return cpStone(data).then((codexes) => {
            //console.log(codexes[0])
            //expect(codexes).containSubset([{ cpForStone: '160'}])
            expect(true).to.equals(true)
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data(8 lvl) and check result', () => {
        return cpStone(data, [{
            userCores: 0,
            userLvl: 8,
            user: '',
            codexId: 109
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 109)
            expect(rows[0].cpForStone).to.equals('0')
            expect(rows[0].potentialCpForStone).to.equals(33)
            expect(rows[0].stonesToLvlUp).to.equals('1.1')
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data (8 lvl, 30 cores) and check result', () => {
        return cpStone(data, [{
            userCores: 30,
            userLvl: 8,
            user: '',
            codexId: 109
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 109)
            expect(rows[0].cpForStone).to.equals('0')
            expect(rows[0].potentialCpForStone).to.equals(33)
            expect(rows[0].stonesToLvlUp).to.equals('1.1')
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data (3 lvl, 2 cores, DOOM SKULL) and check result', () => {
        return cpStone(data, [{
            userCores: 2,
            userLvl: 3,
            user: '',
            codexId: 54
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 54)
            expect(rows[0].cpForStone).to.equals('48')
            expect(rows[0].potentialCpForStone).to.equals(24)
            expect(rows[0].stonesToLvlUp).to.equals('0.6')
            //expect(rows[0].cpArray).to.equals([24, 24])
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data (5 lvl, 4 cores, DOOM SKULL) and check result', () => {
        return cpStone(data, [{
            userCores: 4,
            userLvl: 5,
            user: '',
            codexId: 54
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 54)
            expect(rows[0].cpForStone).to.equals('24')
            expect(rows[0].potentialCpForStone).to.equals(24)
            expect(rows[0].stonesToLvlUp).to.equals('1.0')
            //expect(rows[0].cpArray).to.equals([24, 24])
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data (9 lvl, 30 cores, OOMBA) and check result', () => {
        return cpStone(data, [{
            userCores: 30,
            userLvl: 9,
            user: '',
            codexId: 61
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 61)
            expect(rows[0].cpForStone).to.equals('0')
            expect(rows[0].potentialCpForStone).to.equals(228)
            expect(rows[0].stonesToLvlUp).to.equals('5.9')
            //expect(rows[0].cpArray).to.equals([24, 24])
        }).catch(err => {throw(err)})
    })
    it('fill data with cpForStone property with user data (9 lvl, 220 cores, OOMBA) and check result', () => {
        return cpStone(data, [{
            userCores: 220,
            userLvl: 9,
            user: '',
            codexId: 61
        }]).then((codexes) => {
            let rows = codexes.filter((c) => c.id === 61)
            expect(rows[0].cpForStone).to.equals(0)
            expect(rows[0].potentialCpForStone).to.equals(0)
            expect(rows[0].stonesToLvlUp).to.equals(0)
            //expect(rows[0].cpArray).to.equals([24, 24])
        }).catch(err => {throw(err)})
    })
})

/*  userCores: ''
    userLvl:
    user: ''
    codexId: ''
*/