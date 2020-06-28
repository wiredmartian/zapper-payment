const express = require("express");
const bodyParser = require("body-parser");
const InvoiceController = require("./controllers/invoice.controller");
const PaymentController = require("./controllers/payment.controller");

const app = express();

app.use(bodyParser.json());

const today = new Date(Date.now());
const invoice = {
    externalReference: "",
    siteReference: "martians.com",
    currencyISOCode: "ZAR",
    amount: 0,
    origin: "martians.com",
    createdUTCDate: "",
    originReference: ""
}
console.log(invoice.externalReference);

app.post("/api/invoice/qr-code", async (req, res) => {
    try {
        /**
         * lineItems: [{ name: "", productCode: "", SKU: "", unitPrice: 500, categories: [], quantity: 2 }]
         * */
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        invoice.externalReference = "MAR-INV-" + Math.floor(Math.random() * 1000);
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        invoice.amount = invoice.amount * 100; // convert to cents
        const result = await new InvoiceController().uploadQRCodeInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        console.log(e);
        return res.status(400).send( { error: e.message });
    }
});
app.post("/api/invoice/plain-text", async (req, res) => {
    try {
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        invoice.externalReference = "MAR-INV-" + Math.floor(Math.random() * 1000);
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        const result = await new InvoiceController().uploadPlainTextInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        return res.status(400).send( { error: e.message });
    }
});
app.post("/api/invoice/json", async (req, res) => {
    try {
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        invoice.externalReference = "MAR-INV-" + Math.floor(Math.random() * 1000);
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        const result = await new InvoiceController().uploadJSONInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        return res.status(400).send( { error: e.message });
    }
});
app.post("/api/payment/notify", async (req, res) => {
    try {
        const zapperPayResponse = req.body;
        await new InvoiceController().notificationWebHook(zapperPayResponse);
        return res.send("Ok");
    } catch (e) {
        return res.status(400).send( { error: e.message });
    }
});

app.get("/api/merchant/payments", async (req, res) => {
    try {
        const payments = await new PaymentController().getPaymentsByMerchant();
        return res.send(payments.data);
    } catch (e) {
        console.error(e);
        return res.status(400).send( { error: e.message });
    }
})

app.listen("3001", function () {
    console.log("app is listening at port 3001");
});