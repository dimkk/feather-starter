const nm = require('./index')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

describe('NETMARBLE module', () => {
    before(() => {
        chai.use(chaiAsPromised);
    })
    it('should export an object', () => {
        expect(nm).to.be.a('object')
    })
    describe('should have methods:', () => {
        it('searchClans', () => {
            expect(nm.searchClan).to.be.a('function')
        })
        it('searchPlayer', () => {
            expect(nm.searchPlayer).to.be.a('function')
        })
        it('getUPosts', () => {
            expect(nm.getUPosts).to.be.a('function')
        })
    })
    describe('shoud return ok result', () => {
        it('searchClan ok', () => {
            return expect(nm.searchClan('')).to.eventually.deep.include({'success':true})
        })
        it('searchPlayer ok', () => {
            return expect(nm.searchPlayer({clan: 'lin2ws_6338006113837068298', seq:'1868973', q:''})).to.eventually.deep.include({'success':true})
        })
        it('getUPosts ok', () => {
            return expect(nm.getUPosts({clan: 'lin2ws_6338006113837068298', seq:'1868973', player:'8AFFB2F2CE6F43B8A2A1899B3C49ECA3'})).to.eventually.deep.include({'errCode':null})
        })
    })
})