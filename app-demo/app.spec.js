const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../app')
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');

describe('featherjs APP', () => {
    before(() => {
        chai.use(chaiAsPromised)
    })
    it('should return app as a function', () => {
        expect(app).to.be.a('function')
    })
    it('should connect to app via ws and check if it ok', () => {
        const socket = io('http://127.0.0.1:3030');
        const clientApp = feathers();
        clientApp.configure(socketio(socket));
        expect(clientApp.version).to.include('.')
    })
})