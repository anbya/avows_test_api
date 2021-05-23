const mysql = require("mysql");

const connection = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: 'armyalic_avowstest',
    multipleStatements: true
});


module.exports = connection;