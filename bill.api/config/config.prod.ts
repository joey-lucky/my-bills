const typeorm = {
    client: {
        "type": "mysql",
        "name": "default",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "123456",
        "database": "bill",
        "synchronize": false,
        "cache": false,
        "logging": [
            // "query",
            "error",
            // "warn",
            // "info",
            // "log"
        ],
        "entityPrefix": "",
        "dateStrings": false,
        "connectTimeout": 10000,
        "acquireTimeout": 10000,
        "maxQueryExecutionTime": 10000,
        "debug": false,
        "entities": [
            "app/database/entity/*.js",
            "app/database/view/*.js"
        ],
        "subscribers": [
            "app/database/subscriber/*.js"
        ],
        "migrations": [
            "app/database/migration/*.js"
        ],
        "cli": {
            "entitiesDir": "app/database/entity",
            "migrationsDir": "app/database/migration",
            "subscribersDir": "app/database/subscriber"
        }
    },
    app: true,
    agent: false,
};

export default () => {
  return {
      typeorm,
  };
};
