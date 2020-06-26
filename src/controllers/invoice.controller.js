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
    /**
     * @description Gets a plain-text string that can be converted to a Qr-code
     * */
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
    /**
     * @description Zapper Http web-hook for payment notifications
     * You can also write this info to your own database
     * */
    async notificationWebHook(zapperResponse) {
        const response = {
            Reference: zapperResponse.Reference,
            PaymentStatusId: zapperResponse.PaymentStatusId,
            PosReference: zapperResponse.PosReference,
            PSPData: zapperResponse.PSPData,
            Amount: zapperResponse.Amount,
            ZapperId: zapperResponse.ZapperId,
            UpdatedDate: zapperResponse.UpdatedDate,
            TipAmount: zapperResponse.TipAmount,
            VoucherAmount: zapperResponse.VoucherAmount,
            ZapperDiscountAmount: zapperResponse.ZapperDiscountAmount,
            InvoiceAmount: zapperResponse.InvoiceAmount,
            Vouchers:[],
            CustomFields:[]
        }
        if (response.PaymentStatusId === 5) {
            /** payment failed */
        }

        if (response.PaymentStatusId === 2) {
            /** payment was successful */
            await this.closeInvoiceByRef(response.Reference)
        }
    }
}

module.exports = InvoiceController;