const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    account: String,
    password: String,
    registerDate: Date
});

module.exports = mongoose.model("users", userSchema);
