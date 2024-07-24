const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo-tdd");
    } catch (err) {
        console.error("Error connection to mongodb");
        console.error(err);
    }
}

module.exports = { connect };