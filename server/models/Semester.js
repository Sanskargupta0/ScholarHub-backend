const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SemesterSchema = new Schema({
    semesterNumber: { type: Number, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    key: { type: String},
  });

const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = Semester;