const envSchema = require("env-schema");
const axios = require("axios");

const schema = {
    type: 'object',
    properties: {
        ZAPPER_API_URL: { type: 'string' },
        MERCHANT_API_KEY: { type: 'string' },
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});

/** axios defaults */
axios.defaults.baseURL = config.ZAPPER_API_URL;
axios.defaults.headers["Authorization"] = `Bearer ${ config.MERCHANT_API_KEY }`;
axios.defaults.headers["Content-Type"] = "application/json";
/***/

module.exports = axios;