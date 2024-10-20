const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
  });

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;