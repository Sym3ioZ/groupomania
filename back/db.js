const mysql = require('mysql2')

// Defining connection to the database to use it in each route that nedd it
function dbConnection() {
  const connection = mysql.createConnection(process.env.DB_CONNECTION_STRING)

  connection.connect(function (error) {
    if (error) throw error
    else console.log('connected to GROUPOMANIA database!')
  })
  return connection
}

module.exports = dbConnection()
