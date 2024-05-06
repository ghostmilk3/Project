import events from 'events'
import mongodbMemoryServer from 'mongodb-memory-server'
import mongoose from '../src/services/mongoose'

const { MongoMemoryServer } = mongodbMemoryServer

events.EventEmitter.defaultMaxListeners = Infinity

jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000

global.Array = Array
global.Date = Date
global.Function = Function
global.Math = Math
global.Number = Number
global.Object = Object
global.RegExp = RegExp
global.String = String
global.Uint8Array = Uint8Array
global.WeakMap = WeakMap
global.Set = Set
global.Error = Error
global.TypeError = TypeError
global.parseInt = parseInt
global.parseFloat = parseFloat

let mongoServer

beforeAll(async () => {
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(mongoUri, undefined, err => {
    if (err) {
      console.error(err)
    }
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  const { collections } = mongoose.connection
  const promises = []
  Object.keys(collections).forEach(collection => {
    promises.push(collections[collection].deleteMany({}))
  })
  await Promise.all(promises)
})
