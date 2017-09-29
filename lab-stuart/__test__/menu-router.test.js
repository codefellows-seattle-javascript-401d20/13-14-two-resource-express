'use strict'

require('./lib/setup.js')

const superagent = require('superagent')
const server = require('../lib/server.js')
const menuMock = require('./lib/menu-mock.js')

let apiURL = `http://localhost:${process.env.PORT}`

describe('/menus', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(menuMock.remove)
  
  describe('POST /menus', () => {
    test('200', () => {
      return superagent.post(`${apiURL}/menus`)
      .send({
        title: 'Garden',
        type: 'Healthy',
      })
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeTruthy()
        expect(res.body.timestamp).toBeTruthy()
        expect(res.body.title).toEqual('Garden')
        expect(res.body.type).toEqual('Healthy')
      })
    })

    test('409 due to lack duplicate title', () => {
      return menuMock.create()
      .then(menu => {
        return superagent.post(`${apiURL}/menus`)
        .send({
          title: menu.title,
          type: menu.type,
        })
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409)
      })
    })

    test('400 due to lack of title', () => {
      return superagent.post(`${apiURL}/menus`)
      .send({type: 'Healthy'})
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400)
      })
    })

    test('400 due to bad json', () => {
      return superagent.post(`${apiURL}/menus`)
      .set('Content-Type', 'application/json')
      .send('{')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400)
      })
    })
  })

  describe('PUT /menus/:id', () => {
    test('200', () => {
      let tempMenu
      return menuMock.create()
      .then(menu => {
        tempMenu = menu
        return superagent.put(`${apiURL}/menus/${menu._id}`)
        .send({
          title: 'Garden',
          type: 'Healthy',
        })
      })
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body._id).toEqual(tempMenu._id.toString())
        expect(res.body.timestamp).toBeTruthy()
        expect(res.body.title).toEqual('Garden')
        expect(res.body.type).toEqual('Healthy')
      })
    })
  })

  describe('GET /menus/:id', () => {
    test('200', () => {
      let tempMenu 
      return menuMock.create()
      .then(menu => {
        tempMenu = menu
        return superagent.get(`${apiURL}/menus/${menu._id}`)
      })
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body._id).toEqual(tempMenu._id.toString())
        expect(res.body.timestamp).toBeTruthy()
        expect(res.body.title).toEqual(tempMenu.title)
        expect(res.body.title).toEqual(tempMenu.title)
        expect(JSON.stringify(res.body.keywords)).toEqual(JSON.stringify(tempMenu.keywords))
      })
    })
  })

  describe('DELETE /menus/:id', () => {
    test('200', () => {
      let tempMenu 
      return menuMock.create()
      .then(menu => {
        tempMenu = menu
        return superagent.delete(`${apiURL}/menus/${menu._id}`)
      })
      .then(res => {
        expect(res.status).toEqual(204)
      })
    })
  })
})















