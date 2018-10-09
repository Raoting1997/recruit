const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const resumeSchema = new Schema({
  name: String,
  gender: String,
  age: Number,
  mobile: Number,
  email: String,
  education: String,
  jobIntension: String,
  educationBackground: [],
  projectExperience: [],
  workExperience: [],
  advantage: String,
  user_id: String,
  position_ids: []
});

module.exports = mongoose.model("resumes", resumeSchema);