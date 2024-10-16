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
    res.status(500).json({ msg: error.message });
  }
};

const updateUserData = async (req, res) => {
  try {
    const userData = req.user;
    const { updateData } = req.body;
    const io = req.io;
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
    let currentUTC = new Date();
    let currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const notification = {
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
      date: currentIST,
    };
    userDataFromDB.notifications.push(notification);
    const update = await userDataFromDB.save();
    if (!update) {
      return res.status(400).json({ msg: "Failed to update user data" });
    } else {
      io.to(userData.userid).emit("newNotification", notification);
      res.status(200).json({ msg: "User data updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { userdata, updateUserData };
