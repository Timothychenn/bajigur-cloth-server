require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./routes/index.js");
const { errorHandler } = require("./middlewares/error-handler");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

app.use("/", router);
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Current PORT : ${PORT}`)
})

module.exports = app