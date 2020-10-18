require('dotenv').config()

module.exports =
{
  "development": {
    "username": process.env.db_username,
    "password": process.env.db_password,
    "database": "bajigur-cloth-server",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.db_username,
    "password": process.env.db_password,
    "database": "bajigur-cloth-server-testing",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
