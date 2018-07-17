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
const utils = require('../utils')
let clientApp
describe('featherjs UCODEX services', () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.use(require('chai-subset'))
        return new Promise((resolve, reject) => {
            const socket = io('http://127.0.0.1:3030');
            clientApp = feathers();
            clientApp.configure(socketio(socket))
            clientApp.configure(auth({storage: localStorage}))
            clientApp.authenticate({
                strategy: 'local',
                email:'freeaces@yandex.ru',
                password: 'sup@testp@ssw0rd'
            }).then((response) => {
                return clientApp.passport.verifyJWT(response.accessToken);
            }).then((data) => {
                //console.log(data.userId)
                return clientApp.service('/users').get(data.userId);
            }).then(user => {
                clientApp.set('user', user)
                resolve()
            })
            .catch(err => reject(err))
        })
    })
    it('try to add my dublicate codex data ', () => {
        return expect(clientApp.service('/ucodex').create({
            userCores: 0,
            userLvl: 8,
            codexId: 109
        })).to.eventually.be.rejectedWith('You cannot add more same codexes for this user')
    })
    it('try get my codex data ', () => {
        return expect(clientApp.service('/ucodex').find({
            query: {
                codexId: 109
            }
        })).to.eventually.include({total:1});
    })
    it('try get not my codex data - will recieve my codex', () => {
        return clientApp.service('/ucodex').find({
            query: {
                userId: 'N2ZqsJf7C70tqF7t',
                codexId: 109
            }
        }).then(data => {
             expect(data.data).containSubset([{ userId: 'uLWjAq1toycr455m'}])
        })
    })
    it('try get out of range codex', () => {
        return expect(clientApp.service('/ucodex').find({
            query: {
                codexId: 555
            }
        })).to.eventually.include({total:0});
    })
    it('try to create codex', () => {
        return clientApp.service('/ucodex').create({
            userCores: 0,
            userLvl: 3,
            userId: clientApp.get('user')._id,
            codexId: 107
        }).then(result => {
            //console.log(result)
            clientApp.set('del', result._id)
            expect(result).to.have.property('_id')
        })
    })
    it('try to update codex', () => {
        let rnd = utils.getRandomInt(0, 30)
        return clientApp.service('/ucodex').find({
            query: {
                codexId: 107
            }
        }).then(data => {
            return clientApp.service('/ucodex').patch(data.data[0]._id, {
                userCores: rnd
            })
        }).then(result => {
            expect(result.userCores).to.equals(rnd)
        }).catch(err => console.log(err))
    })
    it('try to remove codex', () => {
        //console.log(clientApp.get('del'))
        return clientApp.service('/ucodex').remove(clientApp.get('del')).then(result => {
            expect(result).to.have.property('_id')
        })
    })
    it('try to get codex data result', () => {
        return clientApp.service('/ucodex').find().then(data => {
            //console.log(data.data)
            return clientApp.service('/ucodex/result').get('', {query:{ucodex:data.data}})
        }).then(result => {
            // expect(result).to.have.property('_id')
            //console.log(result)
            let rows = result.filter(c => c.id === 109)
            expect(rows).containSubset([{ cpForStone: '0'}])
            expect(rows).containSubset([{ potentialCpForStone: '32.9' }])
            expect(rows).containSubset([{ stonesToLvlUp: '1.1'}])
        }).catch(err => console.log(err))
    })
})