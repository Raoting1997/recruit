const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const positionTypeSchema = new Schema({ name: String });

module.exports = mongoose.model("positionTypes", positionTypeSchema);