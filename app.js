require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const router = require("./routes/index.js");
const cloudinary = require("cloudinary").v2;


app.use(cors())
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Connect MongoDb 
const DB_URI = process.env.DB_URI
mongoose.connect(DB_URI);
mongoose.connection.on("connected", () => console.log("Connected Mongo db"))
mongoose.connection.on("error", (err) => console.log("error----", err))

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(router)

app.get('/', (req, res) => res.json({ message: "SERVER UP" }));

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})