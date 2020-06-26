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

class InvoiceController {

    /**
     * @description Uploads invoice and returns Zapper qr-code as SVG
     * */
    async uploadQRCodeInvoice(invoice) {
        return axios.post(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices`, invoice, {
            headers: {
                "Accept": "image/svg+xml"
            }
        });
    }
    /**
     * @description Uploads invoice and returns a JSON response with "reference"
     * */
    async uploadJSONInvoice(invoice) {
        return axios.post(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices`, invoice, {
            headers: {
                "Accept": "application/json"
            }
        });
    }
    async uploadPlainTextInvoice(invoice) {
        return axios.post(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices`, invoice, {
            headers: {
                "Accept": "text/plain"
            }
        });
    }
    /**
     * @description Closes an invoice to ensure your customers receive the Zapper Code that is relevant to their payment
     * Invoices are automatically closed after 1Hr
     * @returns {string} - success
     * */
    async closeInvoiceByRef(invoiceReference) {
        return axios.delete(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices/${invoiceReference}`);
    }
    /**
     * @description Closes an invoice to ensure your customers receive the Zapper Code that is relevant to their payment
     * Invoices are automatically closed after 1Hr
     * @returns {string} - success
     * */
    async closeInvoiceByExternalRef(externalRef) {
        return axios.delete(`/api/v1/merchants/${config.MERCHANT_ID}/sites/${config.SITE_ID}/invoices?externalReference=${externalRef}`);
    }
}

module.exports = InvoiceController;