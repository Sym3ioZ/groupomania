const mysql = require('mysql2')

function dbConnection() {
  const connection = mysql.createConnection(process.env.DB_CONNECTION_STRING)

  connection.connect(function (error) {
    if (error) throw error
    else console.log('connected to GROUPOMANIA database!')
  })
  return connection
}

module.exports = dbConnection()
