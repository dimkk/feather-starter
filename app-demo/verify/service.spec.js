const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const c = require('./constants')
const confirm = require('./confirm')

const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
let clientApp;
describe('featherjs L2R VERIFY services', () => {
    before(() => {
        chai.use(chaiAsPromised)
        const socket = io('http://127.0.0.1:3030');
        clientApp = feathers();
        clientApp.configure(socketio(socket))
    });
    it('should ws connect and get random phrase ', () => {
        return expect(clientApp.service('/getphrase').get('8AFFB2F2CE6F43B8A2A1899B3C49ECA3'))
            .to.eventually.include(process.env.APP_DOMAIN)
    })
    it('should ws connect and get error verification ', () => {
        return expect(clientApp.service('/verifyphrase').get('8AFFB2F2CE6F43B8A2A1899B3C49ECA3', {query:{clan: 'lin2ws_6338006113837068298', seq:'1868973'}}))
            .to.be.rejectedWith("No posts with phrase found! Please try again")
    })
    // it('should ws connect and get ok verification ', () => {
    //     return expect(clientApp.service('/verifyphrase').get('8AFFB2F2CE6F43B8A2A1899B3C49ECA3', {query:{
    //             clan: 'lin2ws_6338006113837068298', seq:'1868973',
    //             debug:'test_omg_ok'
    //         }
    //         }))
    //         .eventually.deep.include({'type':'success'})
    // })
    it('should get the confirmation on PID verified ', () => {
        return expect(confirm('8AFFB2F2CE6F43B8A2A1899B3C49ECA3'))
            .to.equals("true")
    })
})