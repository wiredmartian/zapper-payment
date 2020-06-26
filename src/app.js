const express = require("express");
const InvoiceController = require("./controllers/invoice.controller");

const app = express();

const today = new Date(Date.now());
const invoice = {
    externalReference: "MAR-INV-" + Math.floor(Math.random() * 1000),
    siteReference: "martians.com",
    currencyISOCode: "ZAR",
    amount: 0,
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
    origin: "martians.com",
    createdUTCDate: "",
    originReference: ""
}

app.post("/api/invoice/qr-code", async (req, res) => {
    try {
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        const result = await new InvoiceController().uploadQRCodeInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        return res.send(400, { error: e.message });
    }
});
app.post("/api/invoice/plain-text", async (req, res) => {
    try {
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        const result = await new InvoiceController().uploadPlainTextInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        return res.send(400, { error: e.message });
    }
});
app.post("/api/invoice/json", async (req, res) => {
    try {
        invoice.createdUTCDate = today.toISOString();
        invoice.lineItems = req.body.lineItems;
        Array.from(invoice.lineItems).forEach((item) => {
            invoice.amount += item.unitPrice * item.quantity
        });
        const result = await new InvoiceController().uploadJSONInvoice(invoice);
        return res.send(result.data);
    } catch (e) {
        return res.send(400, { error: e.message });
    }
});

app.listen("3001", function () {
    console.log("app is listening at port 3001");
});