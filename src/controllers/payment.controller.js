const envSchema = require("env-schema");
const axios = require("axios");

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

/** axios defaults */
axios.defaults.baseURL = config.ZAPPER_API_URL;
axios.defaults.headers["Authorization"] = `Bearer ${ config.MERCHANT_API_KEY }`;
axios.defaults.headers["Content-Type"] = "application/json";
/***/

class PaymentController {

    async uploadInvoice(invoiceType) {
        const today = new Date(Date.now());
        const invoice = {
            externalReference: "MAR-INV-" + Math.floor(Math.random() * 1000),
            siteReference: "martian.co.za",
            currencyISOCode: "ZAR",
            amount: 1000,
            lineItems: [
                {
                    name: "",
                    productCode: "",
                    SKU: "",
                    unitPrice: 500,
                    categories: [],
                    quantity: 2
                }
            ],
            origin: "martian.co.za",
            createdUTCDate: today.toISOString(),
            originReference: ""
        }
        /** control generated invoice types */
        let invType = "image/svg+xml";

        if (invoiceType === 1) {
            invType = "application/json"
        }
        if (invoiceType === 2) {
            invType = "text/plain";
        }
        /** control generated invoice types */

        return axios.post(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices`, invoice, {
            headers: {
                "Accept": invType
            }
        });
    }
}

module.exports = PaymentController;