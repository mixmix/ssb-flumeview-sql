'use strict'

var Knex = require('knex')
var SqlView = require('./build/Release/binding.node')

module.exports = function SsbDb (logPath, dbPath, secretKey) {
  if (typeof (logPath) !== 'string') {
    throw new TypeError('Expected logPath to be a string')
  }
  if (typeof (dbPath) !== 'string') {
    throw new TypeError('Expected dbPath to be a string')
  }
  if (!Buffer.isBuffer(secretKey)) {
    throw new TypeError('Expected secret key to be a buffer. This should be the secret key returned by ssb-keys.')
  }

  var knex = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: dbPath
    }
  })

  var db = new SqlView(logPath, dbPath, secretKey)

  var exports = {
    process,
    getLatest: () => db.getLatest(),
    knex
  }

  return exports

  function process (opts) {
    opts = opts || { chunkSize: -1 }
    db.process(opts.chunkSize)
  }
}
