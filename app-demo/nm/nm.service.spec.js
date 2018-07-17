const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
let clientApp;
describe('featherjs NETMARBLES services', () => {
    before(() => {
        chai.use(chaiAsPromised)
        const socket = io('http://127.0.0.1:3030');
        clientApp = feathers();
        clientApp.configure(socketio(socket))
    });
    it('should ws connect and get clans ', () => {
        return expect(clientApp.service('/getclan').get('')).to.eventually.deep.include({'success':true})
    })
    it('should ws connect and get clans with keys sla', () => {
        return expect(clientApp.service('/getclan').get('sla')).to.eventually.deep.include({'success':true})
    })
    it('should ws connect and get clans with keys slav', () => {
        return expect(clientApp.service('/getclan').get('slav')).to.eventually.deep.include({'success':true})
    })
    it('should ws connect and get clans with keys slavs', () => {
        return expect(clientApp.service('/getclan').get('slavs')).to.eventually.deep.include({'success':true})
    })
    it('should ws connect and get clans with keys sla', () => {
        return expect(clientApp.service('/getclan').get('sla')).to.eventually.deep.include({'success':true})
    })
    it('should ws connect and get users from clan ', () => {
        return expect(clientApp.service('/getplayers').get('', {query:{clan: 'lin2ws_6338006113837068298', seq:'1868973'}})).to.eventually.deep.include({'success':true})
    })
})