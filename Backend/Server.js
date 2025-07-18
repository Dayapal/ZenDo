const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const routes = require("./routes/TodoRoutes.js")

const cors = require("cors")

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDb Connected'))
    .catch((error) => console.log("error with mongodb", error));

app.use("/api", routes)

app.use("/" , (req,res) =>{
    res.send("<h1>Hello Dedicatd Do the things very carefully</h1>")
})

app.listen(PORT, () => {
    console.log(`You server is running at ${PORT}`)
})