const expres = require("express");

const app = expres();


app.get("/", (req, res) => {
    res.json("Hello World");
})

app.listen("3001", function () {
    console.log("app is listening at port 3001");
});