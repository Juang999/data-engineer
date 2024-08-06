const path = require('path');

let {parsed: envDevelopment} = require('dotenv').config({path: path.resolve( './.env.development')});
let {parsed: envProduction} = require('dotenv').config({path: path.resolve( './.env.production')});

module.exports = {
    development: {
        username: envDevelopment.DB_DESTINATION_USERNAME,
        password: envDevelopment.DB_DESTINATION_PASSWORD,
        database: envDevelopment.DB_DESTINATION_DATABASE,
        host: envDevelopment.DB_DESTINATION_HOST,
        port: envDevelopment.DB_DESTINATION_PORT,
        dialect: envDevelopment.DB_DIALECT,
        dialectOptions: {
            useUTC: false,
            connectionTimeout: 300
        },
        pool: {
            max: parseInt(envDevelopment.DB_MAX_CONNECTION),
            min: parseInt(envDevelopment.DB_MIN_CONNECTION),
            idle: parseInt(envDevelopment.DB_IDLE_CONNECTION),
            acquire: parseInt(envDevelopment.DB_ACQUIRE_CONNECTION),
        },
        timezone: envDevelopment.DB_TIMEZONE
    },
    production: {
        username: envProduction.DB_DESTINATION_USERNAME,
        password: envProduction.DB_DESTINATION_PASSWORD,
        database: envProduction.DB_DESTINATION_DATABASE,
        host: envProduction.DB_DESTINATION_HOST,
        port: envProduction.DB_DESTINATION_PORT,
        dialect: envProduction.DB_DIALECT,
        dialectOptions: {
            useUTC: false
        },
        pool: {
            max: parseInt(envProduction.DB_MAX_CONNECTION),
            min: parseInt(envProduction.DB_MIN_CONNECTION),
            idle: parseInt(envProduction.DB_IDLE_CONNECTION),
            acquire: parseInt(envProduction.DB_ACQUIRE_CONNECTION),
        },
        timezone: envProduction.DB_TIMEZONE
    }
}