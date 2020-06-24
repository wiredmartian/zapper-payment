const express = require("express");
const InvoiceController = require("./controllers/invoice.controller");

const app = express();

app.post("/invoice", async (req, res) => {
    try {
        const result = await new InvoiceController().uploadInvoice(0);
        return res.send(result.data);
    } catch (e) {
        return res.send(400, { error: e.message });
    }
})

app.listen("3001", function () {
    console.log("app is listening at port 3001");
});