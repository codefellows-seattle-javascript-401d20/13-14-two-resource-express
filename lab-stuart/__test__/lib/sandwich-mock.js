'use strict'

const faker = require('faker')
const menuMock = require('./menu-mock.js')
const Sandwich = require('../../model/sandwich.js')

let create = () => {
  let result = {}
  return menuMock.create()
  .then(menu => {
    result.menu = menu
    return new Sandwich({
      title: faker.lorem.words(4),
      bread: faker.lorem.words(4),
      cheese: faker.lorem.words(4),
      spread: faker.lorem.words(4).split(' '),
      veggies: faker.lorem.words(4).split(' '),
      menu: menu._id,
    }).save()
  })
  .then(sandwich => {
    result.sandwich = sandwich
    return result
  })
}

let createMany = (num) => {
  let result = {}
  return menuMock.create()
  .then(menu => {
    result.menu = menu
    return Promise.all(new Array(num).fill(0)
    .map(() => { 
      return new Sandwich({
        title: faker.lorem.words(4),
        bread: faker.lorem.words(4),
        cheese: faker.lorem.words(4),
        spread: faker.lorem.words(4).split(' '),
        veggies: faker.lorem.words(4).split(' '),
        menu: menu._id,
      }).save()
    }))
  })
  .then(sandwiches => {
    result.sandwiches = sandwiches
    return result
  })
}

let remove = () => Promise.all([
  Sandwich.remove({}),
  menuMock.remove(),
])

module.exports = {create, createMany, remove}
