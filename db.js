const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/tutorial1").then(() => {
    console.log("mongodb connected")
}).catch((err) => {
    console.log("database Error", err)
})