const envSchema = require("env-schema");
const axios = require("../interceptor");
const schema = {
    type: 'object',
    properties: {
        ZAPPER_API_URL: { type: 'string' },
        MERCHANT_API_KEY: { type: 'string' },
        MERCHANT_ID: { type: 'string' },
        SITE_ID: { type: 'string' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});
class PaymentController {
    async getPaymentsByMerchant(externalRef) {
        return axios.get(`/api/v1/merchants/${config.MERCHANT_ID}/payments?externalReference=MAR-INV-333`, {
            headers: {
                Accept: "application/json",
                "x-api-key": config.MERCHANT_API_KEY
            }
        });
    }
    async getPaymentBySite() {
        return axios.get(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/payments?externalReference=MAR-INV-333`, {
            headers: {
                Accept: "application/json",
                "x-api-key": config.MERCHANT_API_KEY
            }
        })
    }
}

module.exports = PaymentController;