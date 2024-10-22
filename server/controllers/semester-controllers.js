const Course = require("../models/Course");
const Semester = require("../models/Semester");
const Paper = require("../models/Paper");
const { deleteFile } = require("../utils/awsS3");


const createSemester = async (req, res) => {
  try {
    const user = req.user;
    const { semesterNumber, courseId, key } = req.body;
    if (!user.isAdmin) {
      res
        .status(401)
        .json({ msg: "You are not authorized to create a semester" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    //check if semester already exists
    const semesterExists = await Semester.findOne({ semesterNumber, courseId });
    if (semesterExists) {
      return res.status(403).json({ msg: "Semester already exists" });
    }
    const semester = new Semester({
      semesterNumber,
      courseId,
      key
    });
    await semester.save();
    const newSemester = await Semester.findById(semester._id).populate("courseId");
    res.status(201).json({ msg: "Semester created successfully", semester: newSemester });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateSemester = async (req, res) => { 
  try {
    const user = req.user;
    const { semesterNumber, courseId, Id } = req.body;
    if (!user.isAdmin) {
      res
        .status(401)
        .json({ msg: "You are not authorized to update a semester" });
    }
    const semester = await Semester.findById(Id).populate("courseId");
    if (!semester) {
      return res.status(404).json({ msg: "Semester not found" });
    }
    // check if semester already exists
    const semesterExists = await Semester.findOne({ semesterNumber, courseId });
    if (semesterExists) {
      return res.status(400).json({ msg: "Semester already exists" });
    }
    semester.semesterNumber = semesterNumber;
    await semester.save();
    res.status(200).json({ msg: "Semester updated successfully", semester });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateSemesterKey = async (req, res) => {
  try {
    const user = req.user;
    const { Id, key } = req.body;
    if (!user.isAdmin) {
      res
        .status(401)
        .json({ msg: "You are not authorized to update a semester" });
    }
    const semester = await Semester.findById(Id).populate("courseId");
    if (!semester) {
      return res.status(404).json({ msg: "Semester not found" });
    }
    if (semester.key && semester.key!==key) {
      const deleteKey = await deleteFile(semester.key);
      if (deleteKey.error) {
        return res.status(500).json({ msg: deleteKey.error });
      }
    }
    semester.key = key;
    await semester.save();
    res.status(200).json({ msg: "Semester key updated successfully", semester });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteSemester = async (req, res) => {
  try {
    const user = req.user;
    const { semesterId } = req.body;
    if (!user.isAdmin) {
      res
        .status(401)
        .json({ msg: "You are not authorized to delete a semester" });
    }
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ msg: "Semester not found" });
    }
    //check if semester has papers
    const papers = await Paper.find({ semesterId });
    if (papers.length > 0) {
      return res
        .status(400)
        .json({ msg: "Semester has papers, cannot delete" });
    }
    // if semester has key
    if (semester.key) {
      const deleteKey = await deleteFile(semester.key);
      if (deleteKey.error) {
        return res.status(500).json({ msg: deleteKey.error });
      }
    }
    await semester.deleteOne();
    res.status(200).json({ msg: "Semester deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getSemesters = async (req, res) => {
  try {
    const { courseId } = req.body;
    const semesters = await Semester.find({ courseId });
    if (semesters.length === 0) {
      return res.status(404).json({ msg: "No semesters found" });
    }
    res.status(200).json({ semesters });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getFilteredSemesters = async (req, res) => {
  try {
    const user = req.user;
    let { filterdata } = req.body;
    const { perPage = 10, page = 1 } = req.query;
    const perPageNo = Math.max(parseInt(perPage), 1);
    const pageNo = Math.max(parseInt(page), 1);

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }
    if(filterdata){
      const courseId = filterdata.courseId || "";
      const semesterNumber = filterdata.semesterNumber || "";

      const query = {};
      if (courseId) {
        query.courseId = courseId;
      }
      if (semesterNumber) {
        query.semesterNumber = semesterNumber;
      }
      const totalSemesters = await Semester.countDocuments(query);

      if (totalSemesters === 0) {
        return res.status(404).json({
          semesters: [],
          totalSemesters: 0,
          msg: "No semesters found" });
      }

      const maxPageNo = Math.ceil(totalSemesters / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);

      const semesters = await Semester.find(query)
        .limit(perPageNo)
        .skip(perPageNo * (adjustedPageNo - 1))
        .populate("courseId")
        .sort({ semesterNumber: 1 });
      res.status(200).json({ semesters, totalSemesters });
    } else{
      const totalSemesters = await Semester.countDocuments();
      if (totalSemesters === 0) {
        return res.status(404).json({
          semesters: [],
          totalSemesters: 0,
          msg: "No semesters found" });
      }
      const maxPageNo = Math.ceil(totalSemesters / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);
      const semesters = await Semester.find()
        .limit(perPageNo)
        .skip(perPageNo * (adjustedPageNo - 1))
        .populate("courseId")
        .sort({ semesterNumber: 1 });
      res.status(200).json({ semesters, totalSemesters });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { createSemester, updateSemester, deleteSemester, getSemesters, getFilteredSemesters, updateSemesterKey };
