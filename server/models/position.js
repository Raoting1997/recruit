const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const positionSchema = new Schema({
  companyName: String,
  positionType: String,
  positionName: String,
  legalPerson: String,
  address: String,
  requirements: String,
  duties: String,
  publishDate: Date,
  salary: String,
  experience: String,
  education: String,
  workType: String,
  resume_id: Array,
  resume_ids: Array
});

module.exports = mongoose.model("positions", positionSchema);
