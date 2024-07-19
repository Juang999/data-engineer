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
            useUTC: false
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
        timezone: envProduction.DB_TIMEZONE
    }
}