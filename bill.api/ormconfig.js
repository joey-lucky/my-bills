module.exports = {
    "type": "mysql",
    "name": "default",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "123456",
    "database": "bill",
    "synchronize": true,
    "logging": [
        "query",
        "error",
        "warn",
        "info",
        "log"
    ],
    "entityPrefix": "",
    "dateStrings": false,
    "connectTimeout": 10000,
    "acquireTimeout": 10000,
    "maxQueryExecutionTime": 10000,
    "debug": false,
    "entities": [
        "app/database/entity/*.ts"
    ],
    "subscribers": [
        "app/database/subscriber/*.ts"
    ],
    "migrations": [
        "app/database/migration/*.ts"
    ],
    "cli": {
        "entitiesDir": "app/database/entity",
        "migrationsDir": "app/database/migration",
        "subscribersDir": "app/database/subscriber"
    }
};