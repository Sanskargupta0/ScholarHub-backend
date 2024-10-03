const User = require("../models/User_model");

const userdata = async (req, res) => {
  try {
    const userData = req.user;
    const userDataFromDB = await User.findById(userData.userid)
      .select("-password")
      .select({
        isVerified: 0,
      });
    res.status(200).json(userDataFromDB);
  } catch (error) {
    console.log(error);
  }
};

const updateUserData = async (req, res) => {
  try {
    const userData = req.user;
    const { updateData } = req.body;
    const userDataFromDB = await User.findById(userData.userid);
    for (let key in updateData) {
      if (
        key === "isVerified" ||
        key === "isAdmin" ||
        key === "password" ||
        key === "_id" ||
        key === "email"
      ) {
        return res.status(400).json({ message: "You can't update this data" });
      }
      userDataFromDB[key] = updateData[key];
    }
    const update = await userDataFromDB.save();
    if (!update) {
      return res.status(400).json({ msg: "Failed to update user data" });
    } else {
      res.status(200).json({ msg: "User data updated successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { userdata, updateUserData };
