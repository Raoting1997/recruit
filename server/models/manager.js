const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const managerSchema = new Schema({ account: String, password: String });

module.exports = mongoose.model("managers", managerSchema);