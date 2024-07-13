const path = require('path');

let envDevelopment = require('dotenv').config({path: path.resolve( './.env.development')});
let envProduction = require('dotenv').config({path: path.resolve( './.env.production')});

module.exports = {
    development: {
        username: envDevelopment.parsed.DB_DESTINATION_USERNAME,
        password: envDevelopment.parsed.DB_DESTINATION_PASSWORD,
        database: envDevelopment.parsed.DB_DESTINATION_DATABASE,
        host: envDevelopment.parsed.DB_DESTINATION_HOST,
        port: envDevelopment.parsed.DB_DESTINATION_PORT,
        dialect: envDevelopment.parsed.DB_DIALECT,
        dialectOptions: {
            useUTC: false
        },
        timezone: envDevelopment.parsed.DB_TIMEZONE
    },
    production: {
        username: envProduction.parsed.DB_DESTINATION_USERNAME,
        password: envProduction.parsed.DB_DESTINATION_PASSWORD,
        database: envProduction.parsed.DB_DESTINATION_DATABASE,
        host: envProduction.parsed.DB_DESTINATION_HOST,
        port: envProduction.parsed.DB_DESTINATION_PORT,
        dialect: envProduction.parsed.DB_DIALECT,
        dialectOptions: {
            useUTC: false
        },
        timezone: envProduction.parsed.DB_TIMEZONE
    }
}