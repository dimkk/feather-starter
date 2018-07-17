const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')

const feathers = require('@feathersjs/feathers')
const socketio = require('@feathersjs/socketio-client')
const io = require('socket.io-client')
const auth = require('@feathersjs/authentication-client')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./ls')
let clientApp
describe('featherjs AUTH services', () => {
    before(() => {
        chai.use(chaiAsPromised)
        return new Promise((resolve, reject) => {
            const socket = io('http://127.0.0.1:3030');
            clientApp = feathers();
            clientApp.configure(socketio(socket))
            clientApp.configure(auth({storage: localStorage}))
            clientApp.authenticate({
                strategy: 'local',
                email:'dimkk@outlook.com',
                password: 'Fucku2u2'
            }).then(() => {
                return clientApp.service('/users').remove(null, {query: {
                    email:'homchevp@yahoo.com'
                }})
            }).then((data) => {
                clientApp.logout()
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    })
    after(() => new Promise((resolve, reject) => {
        return clientApp.service('/users').remove(null, {query: {
            email:'homchevp@yahoo.com'
        }}).then(resolve)
    }))
    it('login attempt with localstorage ', () => {
        return expect(clientApp.authenticate({storage:'null'})).to.be.rejectedWith("Could not find stored JWT and no authentication strategy was given");
    })
    it('create test admin user ', () => {
        return expect(clientApp.service('/users').create({
            email:'homchevp@yahoo.com', password:'sup@testp@ssw0rd' //, l2rPid:'8AFFB2F2CE6F43B8A2A1899B3C49ECA2'
        })).to.to.eventually.have.property("_id");
    })
    it('create test user ', () => {
        return expect(clientApp.service('/users').create({
            email:'test@test.com', password:'sup@testp@ssw0rd' //, l2rPid:'8AFFB2F2CE6F43B8A2A1899B3C49ECA2'
        })).to.to.eventually.have.property("_id");
    })
    it('check test user to have only user role', () => {
        return clientApp.authenticate({
            strategy: 'local',
            email:'test@test.com',
            password: 'sup@testp@ssw0rd'
        }).then((response) => {
            return clientApp.passport.verifyJWT(response.accessToken);
        }).then((data) => {
            return clientApp.service('/users').get(data.userId);
        }).then(user => {
            clientApp.set('test', user._id)
            expect(user.roles).to.not.include('superAdmin')
            expect(user.roles).to.not.include('admin')
            
        }).catch(err => console.log(err))
        //return expect().to.to.eventually.have.property("_id");
    })
    it('remove test user ', () => {
        return expect(clientApp.service('/users').remove(clientApp.get('test'))).to.to.eventually.be.fulfilled;
    })
    it('try to list users no auth ', () => {
        return clientApp.logout().then(() => {
            expect(clientApp.service('/users').find()).to.be.rejectedWith("You do not have valid permissions to access this.")
        })  
    })
    it('try to login ', () => {
        return expect(clientApp.authenticate({
            strategy: 'local',
            email:'homchevp@yahoo.com',
            password: 'sup@testp@ssw0rd'
        })).to.eventually.have.property("accessToken");
    })
    it('try to list users ', () => {
        return expect(clientApp.service('/users').find()).to.eventually.have.property('total');
    })
})