
const express = require("express");
const PaymentController = require("./controllers/payment.controller");


const app = express();


app.get("/", (req, res) => {
    res.json("Hello World");
})

app.get("/invoice", async (req, res) => {
    try {
        const pay = new PaymentController();
        const result = await pay.uploadInvoice();
        return res.send(result.data);
    } catch (e) {
        console.error(e);
        return res.send(400, { error: e.message });
    }
})

app.listen("3001", function () {
    console.log("app is listening at port 3001");
});